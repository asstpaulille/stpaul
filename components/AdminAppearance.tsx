import React, { useRef, useState, useEffect } from 'react';
import { defaultLogoBase64 } from '../utils/initialData';

interface AdminAppearanceProps {
  logoSrc: string;
  setLogoSrc: (src: string) => void;
  ctaText: string;
  setCtaText: (text: string) => void;
  bannerTitle: string;
  setBannerTitle: (title: string) => void;
  bannerSubtitle: string;
  setBannerSubtitle: (subtitle: string) => void;
  infoBannerText: string;
  setInfoBannerText: (text: string) => void;
  bannerBg: string;
  setBannerBg: (src: string) => void;
}

const AdminAppearance: React.FC<AdminAppearanceProps> = ({ 
  logoSrc, setLogoSrc, 
  ctaText, setCtaText,
  bannerTitle, setBannerTitle,
  bannerSubtitle, setBannerSubtitle,
  infoBannerText, setInfoBannerText,
  bannerBg, setBannerBg,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerBgFileInputRef = useRef<HTMLInputElement>(null);
  
  const [currentCtaText, setCurrentCtaText] = useState(ctaText);
  const [ctaSaveStatus, setCtaSaveStatus] = useState<'idle' | 'saved'>('idle');
  
  const [currentBannerTitle, setCurrentBannerTitle] = useState(bannerTitle);
  const [titleSaveStatus, setTitleSaveStatus] = useState<'idle' | 'saved'>('idle');
  
  const [currentBannerSubtitle, setCurrentBannerSubtitle] = useState(bannerSubtitle);
  const [subtitleSaveStatus, setSubtitleSaveStatus] = useState<'idle' | 'saved'>('idle');
  
  const [currentInfoText, setCurrentInfoText] = useState(infoBannerText);
  const [infoSaveStatus, setInfoSaveStatus] = useState<'idle' | 'saved'>('idle');
  

  useEffect(() => {
    setCurrentCtaText(ctaText);
  }, [ctaText]);

  useEffect(() => {
    setCurrentBannerTitle(bannerTitle);
  }, [bannerTitle]);
  
  useEffect(() => {
    setCurrentBannerSubtitle(bannerSubtitle);
  }, [bannerSubtitle]);
  
  useEffect(() => {
    setCurrentInfoText(infoBannerText);
  }, [infoBannerText]);
  

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert("Veuillez sélectionner un fichier image (png, jpg, etc.).");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        setLogoSrc(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBannerBgFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert("Veuillez sélectionner un fichier image (png, jpg, etc.).");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        setBannerBg(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser le logo par défaut ?")) {
        setLogoSrc(defaultLogoBase64);
    }
  };

  const handleResetBannerBg = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser l'image de fond par défaut ?")) {
        setBannerBg('');
    }
  };

  const triggerFileSelect = () => {
      fileInputRef.current?.click();
  }

  const triggerBannerBgFileSelect = () => {
      bannerBgFileInputRef.current?.click();
  }
  
  const handleSaveCtaText = () => {
    setCtaText(currentCtaText);
    setCtaSaveStatus('saved');
    setTimeout(() => setCtaSaveStatus('idle'), 2000);
  }

  const handleSaveBannerTitle = () => {
    setBannerTitle(currentBannerTitle);
    setTitleSaveStatus('saved');
    setTimeout(() => setTitleSaveStatus('idle'), 2000);
  }
  
  const handleSaveBannerSubtitle = () => {
    setBannerSubtitle(currentBannerSubtitle);
    setSubtitleSaveStatus('saved');
    setTimeout(() => setSubtitleSaveStatus('idle'), 2000);
  }

  const handleSaveInfoText = () => {
    setInfoBannerText(currentInfoText);
    setInfoSaveStatus('saved');
    setTimeout(() => setInfoSaveStatus('idle'), 2000);
  }
  
  return (
    <div>
      <h3 className="text-xl font-semibold text-dark mb-4">Gestion de l'apparence</h3>
      <div className="space-y-8 p-4 border rounded-lg bg-gray-50">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo de l'association</label>
            <div className="flex items-center space-x-4">
                <div className="bg-white p-2 rounded-lg border shadow-sm">
                    <img src={logoSrc} alt="Logo actuel" className="h-20 w-auto" />
                </div>
                <div className="flex flex-col space-y-2">
                     <button 
                        onClick={triggerFileSelect}
                        className="bg-secondary hover:bg-dark text-white font-bold py-2 px-4 rounded-lg transition-colors"
                     >
                        Changer le logo
                     </button>
                     <button
                        onClick={handleResetLogo}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                     >
                        Réinitialiser
                     </button>
                </div>
            </div>
            <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
             <p className="text-xs text-gray-500 mt-2">Pour de meilleurs résultats, utilisez une image avec un fond transparent (PNG).</p>
        </div>
        
        <hr/>

        <div className="space-y-6">
            <h4 className="text-lg font-medium text-gray-800">Bannière d'inscription</h4>

            <div>
              <label htmlFor="bannerTitle" className="block text-sm font-medium text-gray-700 mb-2">Titre de la bannière</label>
              <div className="flex items-center space-x-2">
                  <input
                      type="text"
                      id="bannerTitle"
                      value={currentBannerTitle}
                      onChange={(e) => setCurrentBannerTitle(e.target.value)}
                      className="flex-grow block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary"
                  />
                  <button
                      onClick={handleSaveBannerTitle}
                      className={`font-bold py-2 px-4 rounded-lg transition-colors w-32 text-center ${
                        titleSaveStatus === 'saved'
                          ? 'bg-green-500 text-white'
                          : 'bg-primary hover:bg-dark text-white'
                      }`}
                  >
                    {titleSaveStatus === 'saved' ? 'Enregistré!' : 'Enregistrer'}
                  </button>
              </div>
            </div>

            <div>
              <label htmlFor="bannerSubtitle" className="block text-sm font-medium text-gray-700 mb-2">Sous-titre de la bannière</label>
              <div className="flex items-start space-x-2">
                  <textarea
                      id="bannerSubtitle"
                      value={currentBannerSubtitle}
                      onChange={(e) => setCurrentBannerSubtitle(e.target.value)}
                      rows={3}
                      className="flex-grow block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary"
                  />
                  <button
                      onClick={handleSaveBannerSubtitle}
                      className={`font-bold py-2 px-4 rounded-lg transition-colors w-32 text-center ${
                        subtitleSaveStatus === 'saved'
                          ? 'bg-green-500 text-white'
                          : 'bg-primary hover:bg-dark text-white'
                      }`}
                  >
                    {subtitleSaveStatus === 'saved' ? 'Enregistré!' : 'Enregistrer'}
                  </button>
              </div>
            </div>

            <div>
              <label htmlFor="ctaText" className="block text-sm font-medium text-gray-700 mb-2">Texte du bouton d'inscription</label>
              <div className="flex items-center space-x-2">
                  <input
                      type="text"
                      id="ctaText"
                      value={currentCtaText}
                      onChange={(e) => setCurrentCtaText(e.target.value)}
                      className="flex-grow block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary"
                  />
                  <button
                      onClick={handleSaveCtaText}
                      className={`font-bold py-2 px-4 rounded-lg transition-colors w-32 text-center ${
                        ctaSaveStatus === 'saved'
                          ? 'bg-green-500 text-white'
                          : 'bg-primary hover:bg-dark text-white'
                      }`}
                  >
                    {ctaSaveStatus === 'saved' ? 'Enregistré!' : 'Enregistrer'}
                  </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Ce texte apparaît sur le bouton principal de la bannière d'accueil.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image de fond de la bannière</label>
              <div className="flex items-center space-x-4">
                  <div 
                      className="w-32 h-20 rounded-lg border shadow-sm bg-cover bg-center" 
                      style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${bannerBg || 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop'})` }}
                      aria-label="Aperçu de l'image de fond de la bannière"
                  ></div>
                  <div className="flex flex-col space-y-2">
                       <button 
                          onClick={triggerBannerBgFileSelect}
                          className="bg-secondary hover:bg-dark text-white font-bold py-2 px-4 rounded-lg transition-colors"
                       >
                          Changer l'image
                       </button>
                       <button
                          onClick={handleResetBannerBg}
                          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                       >
                          Réinitialiser
                       </button>
                  </div>
              </div>
              <input 
                  type="file"
                  ref={bannerBgFileInputRef}
                  onChange={handleBannerBgFileChange}
                  accept="image/*"
                  className="hidden"
              />
               <p className="text-xs text-gray-500 mt-2">Utilisez une image de haute qualité (ex: 1920x1080) pour un meilleur rendu.</p>
            </div>
        </div>
        
        <hr/>

        <div className="space-y-6">
            <h4 className="text-lg font-medium text-gray-800">Bannière d'information</h4>
            <div>
              <label htmlFor="infoBannerText" className="block text-sm font-medium text-gray-700 mb-2">Texte de la bannière d'information</label>
              <div className="flex items-start space-x-2">
                  <textarea
                      id="infoBannerText"
                      value={currentInfoText}
                      onChange={(e) => setCurrentInfoText(e.target.value)}
                      rows={3}
                      className="flex-grow block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary"
                      placeholder="Affichez une information importante ici..."
                  />
                  <button
                      onClick={handleSaveInfoText}
                      className={`font-bold py-2 px-4 rounded-lg transition-colors w-32 text-center ${
                        infoSaveStatus === 'saved'
                          ? 'bg-green-500 text-white'
                          : 'bg-primary hover:bg-dark text-white'
                      }`}
                  >
                    {infoSaveStatus === 'saved' ? 'Enregistré!' : 'Enregistrer'}
                  </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Ce texte apparaît dans une bannière sous la bannière d'inscription principale.</p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default AdminAppearance;