import React from 'react';
import { ArrowRight } from './Icons';

interface RegistrationBannerProps {
  onCTAClick: () => void;
  ctaText: string;
  bannerTitle: string;
  bannerSubtitle: string;
  bannerBg: string;
}

const RegistrationBanner: React.FC<RegistrationBannerProps> = ({ onCTAClick, ctaText, bannerTitle, bannerSubtitle, bannerBg }) => {
  const bannerImageUrl = bannerBg || 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop';
  
  const bannerStyle = {
    backgroundImage: `linear-gradient(rgba(13, 71, 161, 0.7), rgba(0, 33, 113, 0.8)), url('${bannerImageUrl}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div 
      className="bg-primary text-white rounded-lg shadow-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between"
      style={bannerStyle}
    >
      <div className="md:w-2/3 mb-6 md:mb-0 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-bold text-accent mb-2">{bannerTitle}</h2>
        <p className="text-lg text-light">
          {bannerSubtitle}
        </p>
      </div>
      <button 
        onClick={onCTAClick}
        className="flex items-center space-x-2 px-6 py-3 bg-accent hover:bg-yellow-500 text-primary font-bold rounded-lg transition-colors duration-300 shadow-lg text-lg transform hover:scale-105"
      >
        <span>{ctaText}</span>
        <ArrowRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default RegistrationBanner;