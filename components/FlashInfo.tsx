
import React from 'react';
import { NewsItem } from '../types';
import { Announce } from './Icons';

interface FlashInfoProps {
  newsItems: NewsItem[];
}

const FlashInfo: React.FC<FlashInfoProps> = ({ newsItems }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
        <Announce className="w-6 h-6 mr-2" />
        Informations Flash
      </h2>
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {newsItems.length > 0 ? (
          newsItems.map(item => (
            <div key={item.id} className="p-4 bg-light rounded-lg border-l-4 border-secondary">
              <h3 className="font-bold text-dark text-lg">{item.title}</h3>
              <p className="text-sm text-gray-500 mb-2">
                {new Date(item.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-gray-700">{item.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Aucune information pour le moment.</p>
        )}
      </div>
    </div>
  );
};

export default FlashInfo;
