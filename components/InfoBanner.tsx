import React from 'react';
import { Info } from './Icons';

interface InfoBannerProps {
  text: string;
}

const InfoBanner: React.FC<InfoBannerProps> = ({ text }) => {
  if (!text?.trim()) return null;

  return (
    <div className="mt-8 bg-blue-100 border-l-4 border-secondary text-primary p-4 rounded-r-lg shadow-md" role="status">
      <div className="flex items-center">
        <Info className="w-6 h-6 mr-3 flex-shrink-0" />
        <p className="text-base">{text}</p>
      </div>
    </div>
  );
};

export default InfoBanner;
