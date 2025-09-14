
import React, { useState } from 'react';
import { Member } from '../types';

interface AdminEmailProps {
  members: Member[];
}

const AdminEmail: React.FC<AdminEmailProps> = ({ members }) => {
  const [recipientType, setRecipientType] = useState<'all' | 'individual'>('all');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleMemberSelect = (email: string) => {
    setSelectedMembers(prev => 
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
    );
  };

  const handleSendEmail = () => {
    let recipients: string[] = [];
    if (recipientType === 'all') {
      recipients = members.map(m => m.email);
    } else {
      recipients = selectedMembers;
    }

    if (recipients.length === 0) {
      alert('Veuillez sélectionner au moins un destinataire.');
      return;
    }

    const mailtoLink = `mailto:${recipients.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-dark mb-4">Envoyer un Email</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Destinataires</label>
          <div className="flex items-center space-x-4 mt-1">
            <label className="flex items-center">
              <input type="radio" name="recipientType" value="all" checked={recipientType === 'all'} onChange={() => setRecipientType('all')} className="form-radio text-secondary"/>
              <span className="ml-2">Tous les membres</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="recipientType" value="individual" checked={recipientType === 'individual'} onChange={() => setRecipientType('individual')} className="form-radio text-secondary"/>
              <span className="ml-2">Sélectionner des membres</span>
            </label>
          </div>
        </div>

        {recipientType === 'individual' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Choisir des membres</label>
            <div className="mt-1 border border-gray-300 rounded-md p-2 h-48 overflow-y-auto">
              {members.map(member => (
                <label key={member.id} className="flex items-center space-x-2 p-1">
                  <input type="checkbox" checked={selectedMembers.includes(member.email)} onChange={() => handleMemberSelect(member.email)} className="form-checkbox text-secondary"/>
                  <span>{member.firstName} {member.lastName} ({member.email})</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Sujet</label>
          <input type="text" id="subject" value={subject} onChange={e => setSubject(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary" />
        </div>

        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700">Corps du message</label>
          <textarea id="body" value={body} onChange={e => setBody(e.target.value)} rows={8} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary"></textarea>
        </div>
        
        <div className="text-right">
            <p className="text-sm text-gray-500 mb-2">Cela ouvrira votre client de messagerie par défaut.</p>
            <button onClick={handleSendEmail} className="bg-accent hover:bg-yellow-500 text-primary font-bold py-2 px-6 rounded-lg transition-colors">
                Envoyer
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminEmail;
