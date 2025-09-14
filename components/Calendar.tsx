
import React, { useState } from 'react';
import { CalendarEvent } from '../types';
import { CalendarIcon, ChevronLeft, ChevronRight } from './Icons';

interface CalendarProps {
  events: CalendarEvent[];
}

const Calendar: React.FC<CalendarProps> = ({ events }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - (startDate.getDay() === 0 ? 6 : startDate.getDay() - 1)); // Start week on Monday

  const days = [];
  let day = new Date(startDate);

  while (days.length < 42) { // Always render 6 weeks for consistent height
    days.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }
  
  const eventsByDate = events.reduce((acc, event) => {
    const date = event.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const selectedDayEvents = selectedDay ? eventsByDate[selectedDay.toISOString().split('T')[0]] || [] : [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
        <CalendarIcon className="w-6 h-6 mr-2" />
        Calendrier des Événements
      </h2>
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-light"><ChevronLeft className="w-6 h-6 text-primary"/></button>
        <h3 className="text-xl font-semibold text-dark capitalize">
          {currentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-light"><ChevronRight className="w-6 h-6 text-primary"/></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center font-semibold text-gray-600">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 mt-2">
        {days.map((d, i) => {
          const dateStr = d.toISOString().split('T')[0];
          const hasEvent = !!eventsByDate[dateStr];
          const isCurrentMonth = d.getMonth() === currentDate.getMonth();
          const isToday = d.toDateString() === new Date().toDateString();
          const isSelected = selectedDay?.toDateString() === d.toDateString();

          let dayClasses = 'p-2 h-14 flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all duration-200';

          if (!isCurrentMonth) {
            dayClasses += ' text-gray-300';
          } else {
            dayClasses += ' text-gray-800';
          }

          if (isSelected) {
            dayClasses += ' bg-secondary text-white transform scale-105 shadow-lg';
          } else if (isToday) {
            dayClasses += ' bg-accent text-white font-bold';
            if (hasEvent) {
              dayClasses += ' ring-2 ring-offset-2 ring-offset-white ring-red-500';
            }
          } else if (hasEvent && isCurrentMonth) {
            dayClasses += ' bg-red-600 text-white hover:bg-red-700';
          } else if (isCurrentMonth) {
            dayClasses += ' hover:bg-light';
          }


          return (
            <div key={i} onClick={() => isCurrentMonth && setSelectedDay(d)}
              className={dayClasses}>
              <span className="font-medium">{d.getDate()}</span>
            </div>
          );
        })}
      </div>
      {selectedDay && (
         <div className="mt-4 p-4 bg-light rounded-lg animate-fade-in">
           <h4 className="font-bold text-dark">
             Événements du {selectedDay.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}:
            </h4>
           {selectedDayEvents.length > 0 ? (
            <ul className="list-disc list-inside mt-2 space-y-1">
              {selectedDayEvents.map(event => (
                <li key={event.id} className="text-gray-700">
                  <strong>{event.title}:</strong> {event.description}
                </li>
              ))}
            </ul>
           ) : (
            <p className="text-gray-500 mt-2">Aucun événement prévu pour ce jour.</p>
           )}
         </div>
       )}
    </div>
  );
};

export default Calendar;
