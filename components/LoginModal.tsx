import React, { useState } from 'react';
import Modal from './Modal';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (user: string, pass: string) => boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(username, password);
    if (!success) {
      setError('Identifiant ou mot de passe incorrect.');
      setPassword('');
    }
  };

  return (
    <Modal onClose={onClose} title="Accès Administrateur">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3" role="alert">
            <p>{error}</p>
          </div>
        )}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Identifiant
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary"
            required
            autoFocus
          />
        </div>
        <div>
          <label htmlFor="password"className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary"
            required
          />
        </div>
        <div className="flex justify-end space-x-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-dark transition-colors"
          >
            Se connecter
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default LoginModal;