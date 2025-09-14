import React, { useState } from 'react';
import { CalendarEvent } from '../types';
// FIX: Import CalendarAction from types.ts where it is now defined, instead of App.tsx.
import { CalendarAction } from '../types';
import Modal from './Modal';
import { Edit, Plus } from './Icons';
import SwipeToDelete from './SwipeToDelete';


interface AdminCalendarProps {
  events: CalendarEvent[];
  onCalendarAction: (action: CalendarAction) => void;
}

const EventForm = ({ event, onSave, onCancel }: { event: Partial<CalendarEvent>, onSave: (event: CalendarEvent) => void, onCancel: () => void }) => {
    const [title, setTitle] = useState(event.title || '');
    const [description, setDescription] = useState(event.description || '');
    const [date, setDate] = useState(event.date || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: event.id || crypto.randomUUID(),
            title,
            description,
            date
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="eventTitle" className="block text-sm font-medium text-gray-700">Titre de l'événement</label>
                <input type="text" id="eventTitle" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary" required />
            </div>
             <div>
                <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">Date</label>
                <input type="date" id="eventDate" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary" required />
            </div>
            <div>
                <label htmlFor="eventDesc" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="eventDesc" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary" required></textarea>
            </div>
            <div className="flex justify-end space-x-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-dark">Sauvegarder</button>
            </div>
        </form>
    );
};

const AdminCalendar: React.FC<AdminCalendarProps> = ({ events, onCalendarAction }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Partial<CalendarEvent> | null>(null);

    const handleSave = (eventToSave: CalendarEvent) => {
        onCalendarAction({ type: 'add_or_update', payload: eventToSave });
        setIsModalOpen(false);
        setEditingEvent(null);
    };

    const handleDelete = (id: string) => {
        onCalendarAction({ type: 'delete', payload: { id } });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-dark">Gestion du Calendrier</h3>
                 <button onClick={() => { setEditingEvent({}); setIsModalOpen(true); }} className="flex items-center space-x-1 bg-primary hover:bg-dark text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    <Plus className="w-5 h-5"/> <span>Ajouter</span>
                </button>
            </div>
            <div className="space-y-3">
                {[...events].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(event => (
                    <SwipeToDelete key={event.id} onDelete={() => handleDelete(event.id)}>
                        <div className="p-3 rounded-lg flex justify-between items-center border cursor-grab">
                            <div>
                                <p className="font-bold">{event.title} <span className="font-normal text-sm text-gray-500">- {new Date(event.date).toLocaleDateString('fr-FR')}</span></p>
                                <p className="text-sm text-gray-600">{event.description}</p>
                            </div>
                            <div className="flex space-x-2 pl-4">
                                <button onClick={() => { setEditingEvent(event); setIsModalOpen(true); }} className="text-blue-500 hover:text-blue-700 p-2"><Edit className="w-5 h-5"/></button>
                            </div>
                        </div>
                    </SwipeToDelete>
                ))}
            </div>
             {isModalOpen && editingEvent && (
                <Modal onClose={() => setIsModalOpen(false)} title={editingEvent.id ? "Modifier l'événement" : "Ajouter un événement"}>
                    <EventForm event={editingEvent} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
                </Modal>
            )}
        </div>
    );
};

export default AdminCalendar;