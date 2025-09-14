import React, { useState } from 'react';
import { Member, Sport } from '../types';
import { SPORTS_LIST } from '../constants';
import { Trash, Edit, Plus } from './Icons';
import Modal from './Modal';

interface AdminMembersProps {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
}

const MemberForm = ({ member, onSave, onCancel }: { member: Partial<Member>, onSave: (member: Member) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState({
        firstName: member.firstName || '',
        lastName: member.lastName || '',
        email: member.email || '',
        phone: member.phone || '',
        birthDate: member.birthDate || '',
        sports: member.sports || [] as Sport[],
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        const sport = value as Sport;
        setFormData(prev => {
            const newSports = checked
                ? [...prev.sports, sport]
                : prev.sports.filter(s => s !== sport);
            return { ...prev, sports: newSports };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            id: member.id || crypto.randomUUID(),
            registrationDate: member.registrationDate || new Date().toISOString(),
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Prénom</label>
                    <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary" required />
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Nom</label>
                    <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary" required />
                </div>
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary" required />
            </div>
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Téléphone</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary" />
            </div>
            <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Date de naissance</label>
                <input type="date" id="birthDate" name="birthDate" value={formData.birthDate} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary" required />
            </div>
            <div>
                <p className="block text-sm font-medium text-gray-700">Sports</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                    {SPORTS_LIST.map(sport => (
                        <label key={sport} className="flex items-center space-x-2">
                            <input type="checkbox" value={sport} checked={formData.sports.includes(sport)} onChange={handleCheckboxChange} className="rounded border-gray-300 text-secondary focus:ring-secondary" />
                            <span>{sport}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-dark">Sauvegarder</button>
            </div>
        </form>
    );
};


const AdminMembers: React.FC<AdminMembersProps> = ({ members, setMembers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<Member> | null>(null);

  const handleSave = (memberToSave: Member) => {
    const existing = members.find(m => m.id === memberToSave.id);
    if (existing) {
        setMembers(members.map(m => m.id === memberToSave.id ? memberToSave : m));
    } else {
        setMembers(prev => [memberToSave, ...prev]);
    }
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const deleteMember = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
      setMembers(prev => prev.filter(m => m.id !== id));
    }
  };

  return (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-dark">Gestion des Membres</h3>
             <button onClick={() => { setEditingMember({}); setIsModalOpen(true); }} className="flex items-center space-x-1 bg-primary hover:bg-dark text-white font-bold py-2 px-4 rounded-lg transition-colors">
                <Plus className="w-5 h-5"/> <span>Ajouter un membre</span>
            </button>
        </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-secondary text-white">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Nom</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Email</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Sports</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {members.sort((a,b) => a.lastName.localeCompare(b.lastName)).map(member => (
              <tr key={member.id} className="border-b hover:bg-light">
                <td className="py-3 px-4">{member.lastName}, {member.firstName}</td>
                <td className="py-3 px-4">{member.email}</td>
                <td className="py-3 px-4">{member.sports.join(', ')}</td>
                <td className="py-3 px-4 flex space-x-2">
                   <button onClick={() => { setEditingMember(member); setIsModalOpen(true); }} className="text-blue-500 hover:text-blue-700 p-1"><Edit className="w-5 h-5"/></button>
                  <button onClick={() => deleteMember(member.id)} className="text-red-500 hover:text-red-700 p-1">
                    <Trash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
             {members.length === 0 && (
                <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">Aucun membre inscrit.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && editingMember && (
          <Modal onClose={() => setIsModalOpen(false)} title={editingMember.id ? "Modifier le membre" : "Ajouter un membre"}>
              <MemberForm member={editingMember} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
          </Modal>
      )}
    </div>
  );
};

export default AdminMembers;