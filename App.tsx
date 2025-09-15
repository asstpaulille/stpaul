import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import FlashInfo from './components/FlashInfo';
import Calendar from './components/Calendar';
import AdminDashboard from './components/AdminDashboard';
import LoginModal from './components/LoginModal';
import RegistrationBanner from './components/RegistrationBanner';
import RegistrationModal from './components/RegistrationModal';
import useLocalStorage from './hooks/useLocalStorage';
import { Member, NewsItem, CalendarEvent, NewsAction, CalendarAction } from './types';
import { initialNews, initialEvents, defaultLogoBase64 } from './utils/initialData';
import InfoBanner from './components/InfoBanner';


function App() {
  const [isAdminView, setIsAdminView] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  
  const [adminEmail, setAdminEmail] = useLocalStorage<string>('sspl_admin_email', 'admin@example.com');
  
  const [members, setMembers] = useLocalStorage<Member[]>('sspl_members', []);
  const [news, setNews] = useLocalStorage<NewsItem[]>('sspl_news', initialNews);
  const [events, setEvents] = useLocalStorage<CalendarEvent[]>('sspl_events', initialEvents);

  // Fetch latest data on app load. useLocalStorage provides the initial value from localStorage,
  // and this effect updates it with fresh data from the network (via the service worker).
  // This ensures the app is up-to-date when online, while still working offline.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersRes, newsRes, eventsRes] = await Promise.all([
          fetch('/data/members.json'),
          fetch('/data/news.json'),
          fetch('/data/events.json'),
        ]);

        if (membersRes.ok) setMembers(await membersRes.json());
        if (newsRes.ok) setNews(await newsRes.json());
        if (eventsRes.ok) setEvents(await eventsRes.json());
      } catch (error) {
        console.error("Failed to fetch latest data:", error);
        // On error (e.g., offline), the app will gracefully continue using the data
        // already loaded from localStorage by the useLocalStorage hook.
      }
    };
    fetchData();
  }, []); // Empty dependency array ensures this runs only once on mount.


  const handleAddMember = (newMemberData: Omit<Member, 'id' | 'registrationDate'>) => {
    // Add to local storage
    const newMember: Member = {
      ...newMemberData,
      id: crypto.randomUUID(),
      registrationDate: new Date().toISOString(),
    };
    setMembers(prev => [newMember, ...prev]);

    // Send an email notification to the admin
    const subject = "Nouvelle inscription A.S. Saint-Paul Lille";
    const body = `
Une nouvelle personne s'est inscrite. Pensez à publier la liste des membres mise à jour.

Détails :
- Nom: ${newMemberData.lastName}
- Prénom: ${newMemberData.firstName}
- Email: ${newMemberData.email}
- Téléphone: ${newMemberData.phone}
- Date de naissance: ${newMemberData.birthDate}
- Sports: ${newMemberData.sports.join(', ')}
    `;
    window.location.href = `mailto:${adminEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleNewsAction = (action: NewsAction) => {
    switch (action.type) {
      case 'add_or_update': {
        const existing = news.find(n => n.id === action.payload.id);
        if (existing) {
          setNews(news.map(n => n.id === action.payload.id ? action.payload : n));
        } else {
          setNews([action.payload, ...news]);
        }
        break;
      }
      case 'delete':
        setNews(news.filter(n => n.id !== action.payload.id));
        break;
    }
  };

  const handleCalendarAction = (action: CalendarAction) => {
    switch (action.type) {
      case 'add_or_update': {
        const existing = events.find(e => e.id === action.payload.id);
        if (existing) {
          setEvents(events.map(e => e.id === action.payload.id ? action.payload : e));
        } else {
          setEvents([action.payload, ...events]);
        }
        break;
      }
      case 'delete':
        setEvents(events.filter(e => e.id !== action.payload.id));
        break;
    }
  };


  // Appearance states
  const [logoSrc, setLogoSrc] = useLocalStorage<string>('sspl_logo', defaultLogoBase64);
  const [ctaText, setCtaText] = useLocalStorage<string>('sspl_cta_text', "Je m'inscris");
  const [bannerTitle, setBannerTitle] = useLocalStorage<string>('sspl_banner_title', "Prêt à relever le défi ?");
  const [bannerSubtitle, setBannerSubtitle] = useLocalStorage<string>('sspl_banner_subtitle', "Rejoignez l'A.S. Saint-Paul Lille pour la nouvelle saison ! Inscrivez-vous dès maintenant et faites partie de notre équipe.");
  const [infoBannerText, setInfoBannerText] = useLocalStorage<string>('sspl_info_banner', "Bienvenue à l'A.S. Saint-Paul Lille ! Retrouvez ici les dernières actualités et les événements à venir.");
  const [bannerBg, setBannerBg] = useLocalStorage<string>('sspl_banner_bg', '');
  
  const sortedNews = useMemo(() => [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [news]);
  const sortedEvents = useMemo(() => [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [events]);

  const handleLogin = (user: string, pass: string): boolean => {
    if (user === 'stpaulille' && pass === 'equipeeps') {
      setIsAdminView(true);
      setIsLoginModalOpen(false);
      return true;
    }
    return false;
  };

  const handleToggleView = () => {
    if (isAdminView) {
      setIsAdminView(false);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleBannerClick = () => {
    setIsRegistrationModalOpen(true);
  };


  return (
    <div className="flex flex-col min-h-screen font-sans bg-light">
      <Header isAdminView={isAdminView} onToggleView={handleToggleView} logoSrc={logoSrc} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {isAdminView ? (
          <div className="max-w-6xl mx-auto">
            <AdminDashboard 
              adminEmail={adminEmail}
              setAdminEmail={setAdminEmail}
              members={members}
              setMembers={setMembers}
              news={news}
              setNews={setNews}
              events={events}
              setEvents={setEvents}
              onNewsAction={handleNewsAction}
              onCalendarAction={handleCalendarAction}
              logoSrc={logoSrc}
              setLogoSrc={setLogoSrc}
              ctaText={ctaText}
              setCtaText={setCtaText}
              bannerTitle={bannerTitle}
              setBannerTitle={setBannerTitle}
              bannerSubtitle={bannerSubtitle}
              setBannerSubtitle={setBannerSubtitle}
              infoBannerText={infoBannerText}
              setInfoBannerText={setInfoBannerText}
              bannerBg={bannerBg}
              setBannerBg={setBannerBg}
            />
          </div>
        ) : (
          <>
            <RegistrationBanner 
              onCTAClick={handleBannerClick} 
              ctaText={ctaText}
              bannerTitle={bannerTitle}
              bannerSubtitle={bannerSubtitle}
              bannerBg={bannerBg}
            />
            <InfoBanner text={infoBannerText} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
              <FlashInfo newsItems={sortedNews} />
              <Calendar events={sortedEvents} />
            </div>
          </>
        )}
      </main>
      <Footer />
      {isLoginModalOpen && (
        <LoginModal 
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={handleLogin}
        />
      )}
      {isRegistrationModalOpen && (
        <RegistrationModal 
          onClose={() => setIsRegistrationModalOpen(false)}
          onAddMember={handleAddMember}
        />
      )}
    </div>
  );
}

export default App;