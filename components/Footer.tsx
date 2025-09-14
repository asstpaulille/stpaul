
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-gray-300 py-4 mt-8">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} A.S. Saint-Paul Lille. Tous droits réservés.</p>
        <p className="text-sm text-gray-400 mt-1">Conçu avec passion pour le sport.</p>
      </div>
    </footer>
  );
};

export default Footer;