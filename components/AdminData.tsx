import React, { useState, useEffect } from 'react';
import { Member, NewsItem, CalendarEvent } from '../types';
import { Mail, UploadCloud, RotateCw } from './Icons';

interface AdminDataProps {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  news: NewsItem[];
  setNews: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  adminEmail: string;
  setAdminEmail: React.Dispatch<React.SetStateAction<string>>;
}

const AdminData: React.FC<AdminDataProps> = (props) => {
  const [email, setEmail] = useState(props.adminEmail);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [publishMessage, setPublishMessage] = useState('');

  useEffect(() => {
    setEmail(props.adminEmail);
  }, [props.adminEmail]);

  const handleSaveEmail = () => {
    props.setAdminEmail(email);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const exportToJson = <T extends object>(data: T[], filename: string) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoadPublished = async () => {
    if (!window.confirm("Êtes-vous sûr ? Cela remplacera toutes vos modifications locales non publiées par les données actuellement en ligne sur le site.")) {
      return;
    }
    try {
      // Add cache-busting query parameter
      const cacheBuster = `?t=${new Date().getTime()}`;
      const [membersRes, newsRes, eventsRes] = await Promise.all([
        fetch(`/data/members.json${cacheBuster}`),
        fetch(`/data/news.json${cacheBuster}`),
        fetch(`/data/events.json${cacheBuster}`),
      ]);
      if (membersRes.ok) props.setMembers(await membersRes.json());
      if (newsRes.ok) props.setNews(await newsRes.json());
      if (eventsRes.ok) props.setEvents(await eventsRes.json());
      alert("Les données publiées ont été chargées avec succès.");
    } catch (error) {
      console.error("Failed to load published data:", error);
      alert("Une erreur est survenue lors du chargement des données.");
    }
  };
  
  const handlePublish = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir publier les changements ? Cela déclenchera une mise à jour du site public.")) {
      return;
    }
    setIsPublishing(true);
    setPublishStatus('idle');
    setPublishMessage('');

    try {
      const response = await fetch('/.netlify/functions/publish-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          members: props.members,
          news: props.news,
          events: props.events,
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Une erreur est survenue.');
      }
      
      setPublishStatus('success');
      setPublishMessage('Publication réussie ! Le site sera mis à jour dans quelques minutes.');

    } catch (error) {
      const err = error as Error;
      setPublishStatus('error');
      setPublishMessage(err.message || 'La publication a échoué. Veuillez vérifier la configuration ou réessayer.');
    } finally {
      setIsPublishing(false);
      setTimeout(() => {
        setPublishStatus('idle');
        setPublishMessage('');
      }, 6000);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-dark mb-4">Publication et Synchronisation des Données</h3>

      {/* Automatic Publication Section */}
      <div className="mb-8 p-4 border rounded-lg bg-green-50 border-green-200">
        <h4 className="text-lg font-medium text-green-800 mb-2">Publication Automatique (Recommandé)</h4>
        <p className="text-sm text-green-700 mb-3">
          Publiez toutes vos modifications locales directement sur le site en un seul clic.
        </p>
        <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          {isPublishing ? (
            <RotateCw className="w-5 h-5 animate-spin" />
          ) : (
            <UploadCloud className="w-5 h-5"/>
          )}
          <span>{isPublishing ? 'Publication en cours...' : 'Publier les changements'}</span>
        </button>
        {publishStatus === 'success' && (
          <p className="text-sm text-green-600 mt-2 font-medium">{publishMessage}</p>
        )}
        {publishStatus === 'error' && (
          <p className="text-sm text-red-600 mt-2 font-medium">{publishMessage}</p>
        )}

        <details className="mt-4 text-xs text-gray-600">
          <summary className="cursor-pointer font-medium hover:text-black">Comment configurer la publication automatique ?</summary>
          <div className="mt-2 p-3 bg-white rounded border space-y-2">
            <p>Pour activer la publication en un clic, vous devez autoriser l'application à écrire dans votre dépôt GitHub de manière sécurisée.</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                <strong>Créez un jeton d'accès GitHub :</strong> Allez dans 
                <code className="text-xs bg-gray-100 p-1 rounded mx-1">GitHub &gt; Settings &gt; Developer settings &gt; Personal access tokens &gt; Fine-grained tokens</code>.
                Créez un nouveau token avec la permission "Contents: Read and write" pour ce dépôt uniquement. Copiez le jeton.
              </li>
              <li>
                <strong>Configurez Netlify :</strong> Dans votre tableau de bord Netlify, allez dans 
                <code className="text-xs bg-gray-100 p-1 rounded mx-1">Site settings &gt; Build & deploy &gt; Environment &gt; Environment variables</code>.
                Ajoutez les 3 variables suivantes :
                <ul className="list-disc list-inside ml-4 mt-1 font-mono bg-gray-50 p-2 rounded">
                  <li><code className="text-xs">GITHUB_TOKEN</code> : Collez votre jeton d'accès.</li>
                  <li><code className="text-xs">GITHUB_REPO</code> : Le nom du dépôt (ex: <code className="text-xs">mon-user/mon-repo</code>).</li>
                  <li><code className="text-xs">GITHUB_BRANCH</code> : La branche à mettre à jour (ex: <code className="text-xs">main</code>).</li>
                </ul>
              </li>
              <li>Redéployez votre site sur Netlify pour que les variables soient prises en compte ("Trigger deploy").</li>
            </ol>
          </div>
        </details>
      </div>
      
      {/* Sync and Manual Section */}
      <div className="p-4 border rounded-lg bg-gray-50">
          <details>
              <summary className="font-medium text-gray-800 cursor-pointer hover:text-black">Alternative : Méthode Manuelle et Synchronisation</summary>
              <div className="mt-3">
                  {/* Sync Section */}
                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-700 mb-1">Synchronisation</h5>
                    <p className="text-sm text-gray-600 mb-3">Si un autre administrateur a mis le site à jour, cliquez ici pour charger les dernières données publiées. Attention, cela écrasera vos modifications locales.</p>
                    <button 
                        onClick={handleLoadPublished}
                        className="bg-secondary hover:bg-dark text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                      Charger les données publiées
                    </button>
                  </div>
                  {/* Export Section */}
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-2">Exporter pour publication manuelle</h5>
                    <div className="flex flex-wrap gap-3">
                      <button onClick={() => exportToJson(props.members, 'members.json')} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">
                        Exporter les Membres
                      </button>
                      <button onClick={() => exportToJson(props.news, 'news.json')} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">
                        Exporter les Infos Flash
                      </button>
                      <button onClick={() => exportToJson(props.events, 'events.json')} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">
                        Exporter le Calendrier
                      </button>
                    </div>
                  </div>
              </div>
          </details>
      </div>
      
      <hr className="my-6"/>

      {/* Admin Email Section */}
      <div className="p-4 border rounded-lg bg-gray-50">
        <h4 className="text-lg font-medium text-gray-800">Configuration</h4>
        <div>
            <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">Email de l'administrateur pour les notifications</label>
            <div className="mt-1 flex items-center space-x-2">
                <Mail className="w-5 h-5 text-gray-400" />
                <input type="email" id="adminEmail" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" className="flex-grow block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary" />
                <button
                    onClick={handleSaveEmail}
                    className={`font-bold py-2 px-4 rounded-lg transition-colors w-32 text-center ${
                      saveStatus === 'saved'
                        ? 'bg-green-500 text-white'
                        : 'bg-primary hover:bg-dark text-white'
                    }`}
                >
                  {saveStatus === 'saved' ? 'Enregistré!' : 'Enregistrer'}
                </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Une notification pour chaque nouvelle inscription sera envoyée à cette adresse.</p>
        </div>
      </div>

    </div>
  );
};

export default AdminData;