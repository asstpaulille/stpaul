import React from 'react';
import { User, Shield } from './Icons';

interface HeaderProps {
  isAdminView: boolean;
  onToggleView: () => void;
  logoSrc: string;
}

const Header: React.FC<HeaderProps> = ({ isAdminView, onToggleView, logoSrc }) => {
  return (
    <header className="bg-primary shadow-lg text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="bg-white p-1 rounded-lg shadow-md">
            <img 
              src={logoSrc}
              alt="Logo A.S. Saint-Paul Lille" 
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-accent">A.S. Saint-Paul Lille</h1>
        </div>
        <button
          onClick={onToggleView}
          className="flex items-center space-x-2 px-4 py-2 bg-secondary hover:bg-dark text-white rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50"
          aria-label={isAdminView ? "Aller à la vue utilisateur" : "Aller à la vue admin"}
        >
          {isAdminView ? <User className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
          <span className="hidden sm:block">{isAdminView ? 'Vue Utilisateur' : 'Admin'}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;