// This function is designed to run on Netlify and handle the automatic publishing of data to GitHub.

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
    }

    const { GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH } = process.env;

    if (!GITHUB_TOKEN || !GITHUB_REPO || !GITHUB_BRANCH) {
        return { statusCode: 500, body: JSON.stringify({ message: 'Missing GitHub configuration on Netlify. Please set GITHUB_TOKEN, GITHUB_REPO, and GITHUB_BRANCH environment variables.' }) };
    }

    const [owner, repo] = GITHUB_REPO.split('/');
    if (!owner || !repo) {
        return { statusCode: 500, body: JSON.stringify({ message: 'Invalid GITHUB_REPO format. Expected "owner/repo".' }) };
    }
    
    const API_BASE = 'https://api.github.com';

    const headers = {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
    };

    const githubApi = async (endpoint, options = {}) => {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers,
            ...options
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(`GitHub API Error for ${endpoint}: ${response.status} ${error.message}`);
        }
        return response.json();
    };

    try {
        const data = JSON.parse(event.body);
        const { members, news, events } = data;

        if (typeof members === 'undefined' || typeof news === 'undefined' || typeof events === 'undefined') {
            return { statusCode: 400, body: JSON.stringify({ message: 'Missing data in request body. Required: members, news, events.' }) };
        }

        // 1. Get the latest commit SHA from the branch
        const refData = await githubApi(`/repos/${owner}/${repo}/git/ref/heads/${GITHUB_BRANCH}`);
        const parentCommitSha = refData.object.sha;

        // 2. Get the tree SHA for that commit
        const commitData = await githubApi(`/repos/${owner}/${repo}/git/commits/${parentCommitSha}`);
        const baseTreeSha = commitData.tree.sha;

        // 3. Create blobs for the new content
        const filesToUpdate = [
            { path: 'public/data/members.json', content: JSON.stringify(members, null, 2) },
            { path: 'public/data/news.json', content: JSON.stringify(news, null, 2) },
            { path: 'public/data/events.json', content: JSON.stringify(events, null, 2) }
        ];

        const createBlobPromises = filesToUpdate.map(file => 
            githubApi(`/repos/${owner}/${repo}/git/blobs`, {
                method: 'POST',
                body: JSON.stringify({ content: file.content, encoding: 'utf-8' })
            })
        );
        const blobs = await Promise.all(createBlobPromises);

        // 4. Create a new tree with the new blobs
        const tree = filesToUpdate.map((file, index) => ({
            path: file.path,
            mode: '100644',
            type: 'blob',
            sha: blobs[index].sha
        }));

        const newTreeData = await githubApi(`/repos/${owner}/${repo}/git/trees`, {
            method: 'POST',
            body: JSON.stringify({ base_tree: baseTreeSha, tree })
        });
        const newTreeSha = newTreeData.sha;

        // 5. Create a new commit
        const newCommitData = await githubApi(`/repos/${owner}/${repo}/git/commits`, {
            method: 'POST',
            body: JSON.stringify({
                message: `chore: Update data from admin panel [skip ci]`,
                tree: newTreeSha,
                parents: [parentCommitSha]
            })
        });
        const newCommitSha = newCommitData.sha;

        // 6. Update the branch reference to point to the new commit
        await githubApi(`/repos/${owner}/${repo}/git/refs/heads/${GITHUB_BRANCH}`, {
            method: 'PATCH',
            body: JSON.stringify({ sha: newCommitSha })
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Data published successfully!' })
        };

    } catch (error) {
        console.error('Error during GitHub publish process:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message || 'An internal error occurred during the publish process.' })
        };
    }
};
