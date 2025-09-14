import React, { useState } from 'react';
import { Member, NewsItem, CalendarEvent, NewsAction, CalendarAction } from '../types';
import AdminAppearance from './AdminAppearance';
import AdminMembers from './AdminMembers';
import AdminNews from './AdminNews';
import AdminCalendar from './AdminCalendar';
import AdminEmail from './AdminEmail';
import AdminData from './AdminData';

interface AdminDashboardProps {
  adminEmail: string;
  setAdminEmail: React.Dispatch<React.SetStateAction<string>>;
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  news: NewsItem[];
  setNews: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  onNewsAction: (action: NewsAction) => void;
  onCalendarAction: (action: CalendarAction) => void;
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

type AdminTab = 'appearance' | 'members' | 'news' | 'calendar' | 'email' | 'data';

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('appearance');

  const renderContent = () => {
    switch (activeTab) {
      case 'appearance':
        return <AdminAppearance 
            logoSrc={props.logoSrc}
            setLogoSrc={props.setLogoSrc}
            ctaText={props.ctaText}
            setCtaText={props.setCtaText}
            bannerTitle={props.bannerTitle}
            setBannerTitle={props.setBannerTitle}
            bannerSubtitle={props.bannerSubtitle}
            setBannerSubtitle={props.setBannerSubtitle}
            infoBannerText={props.infoBannerText}
            setInfoBannerText={props.setInfoBannerText}
            bannerBg={props.bannerBg}
            setBannerBg={props.setBannerBg}
        />;
      case 'members':
        return <AdminMembers members={props.members} setMembers={props.setMembers} />;
      case 'news':
        return <AdminNews news={props.news} onNewsAction={props.onNewsAction} />;
      case 'calendar':
        return <AdminCalendar events={props.events} onCalendarAction={props.onCalendarAction} />;
      case 'email':
        return <AdminEmail members={props.members} />;
      case 'data':
        return <AdminData 
            members={props.members}
            setMembers={props.setMembers}
            news={props.news}
            setNews={props.setNews}
            events={props.events}
            setEvents={props.setEvents}
            adminEmail={props.adminEmail}
            setAdminEmail={props.setAdminEmail}
        />;
      default:
        return null;
    }
  };
  
  const TabButton: React.FC<{tab: AdminTab; label: string}> = ({ tab, label }) => (
      <button
        onClick={() => setActiveTab(tab)}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          activeTab === tab 
            ? 'bg-primary text-white shadow' 
            : 'text-gray-600 hover:bg-gray-200'
        }`}
      >
        {label}
      </button>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl w-full">
      <h2 className="text-3xl font-bold text-primary mb-6 border-b pb-4">Panneau d'Administration</h2>
      <div className="flex flex-wrap gap-2 border-b mb-6 pb-4">
          <TabButton tab="appearance" label="Apparence" />
          <TabButton tab="data" label="Publication" />
          <TabButton tab="members" label="Membres" />
          <TabButton tab="news" label="Infos Flash" />
          <TabButton tab="calendar" label="Calendrier" />
          <TabButton tab="email" label="Emails" />
      </div>
      <div>{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;