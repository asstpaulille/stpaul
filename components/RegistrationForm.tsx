import React, { useState } from 'react';
import { Sport, Member } from '../types';
import { SPORTS_LIST } from '../constants';

interface RegistrationFormProps {
  onAddMember: (member: Omit<Member, 'id' | 'registrationDate'>) => void;
  onCloseModal: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onAddMember, onCloseModal }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    sports: [] as Sport[],
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

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
    if (formData.sports.length === 0) {
      setError('Veuillez sélectionner au moins un sport.');
      return;
    }
    setError('');

    onAddMember(formData);

    setSubmitted(true);
    setTimeout(() => {
      onCloseModal();
    }, 3000);
  };

  return (
    <div>
      {submitted ? (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
          <p className="font-bold">Inscription réussie !</p>
          <p>Bienvenue à l'A.S. Saint-Paul Lille. Votre inscription a bien été enregistrée.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
           {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3" role="alert">
                <p>{error}</p>
            </div>
          )}
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
            <p className="block text-sm font-medium text-gray-700">Sports (choix multiples)</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {SPORTS_LIST.map(sport => (
                <label key={sport} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={sport}
                    checked={formData.sports.includes(sport)}
                    onChange={handleCheckboxChange}
                    className="rounded border-gray-300 text-secondary focus:ring-secondary"
                  />
                  <span className="text-gray-800">{sport}</span>
                </label>
              ))}
            </div>
          </div>
          <button type="submit" className="w-full bg-accent hover:bg-yellow-500 text-primary font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-md">
            Confirmer mon inscription
          </button>
        </form>
      )}
    </div>
  );
};

export default RegistrationForm;