import React, { useState } from 'react';
import { NewsItem } from '../types';
// FIX: Import NewsAction from types.ts where it is now defined, instead of App.tsx.
import { NewsAction } from '../types';
import Modal from './Modal';
import { Edit, Plus } from './Icons';
import SwipeToDelete from './SwipeToDelete';

interface AdminNewsProps {
  news: NewsItem[];
  onNewsAction: (action: NewsAction) => void;
}

const NewsForm = ({ item, onSave, onCancel }: { item: Partial<NewsItem>, onSave: (item: NewsItem) => void, onCancel: () => void }) => {
    const [title, setTitle] = useState(item.title || '');
    const [content, setContent] = useState(item.content || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: item.id || crypto.randomUUID(),
            title,
            content,
            date: item.date || new Date().toISOString()
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Titre</label>
                <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary" required />
            </div>
            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">Contenu</label>
                <textarea id="content" value={content} onChange={e => setContent(e.target.value)} rows={4} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary" required></textarea>
            </div>
            <div className="flex justify-end space-x-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-dark">Sauvegarder</button>
            </div>
        </form>
    );
};

const AdminNews: React.FC<AdminNewsProps> = ({ news, onNewsAction }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Partial<NewsItem> | null>(null);
    
    const handleSave = (itemToSave: NewsItem) => {
        onNewsAction({ type: 'add_or_update', payload: itemToSave });
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleDelete = (id: string) => {
        // Confirmation is handled by the swipe gesture now, but a window.confirm can be an extra layer
        onNewsAction({ type: 'delete', payload: { id } });
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-dark">Gestion des Infos Flash</h3>
                <button onClick={() => { setEditingItem({}); setIsModalOpen(true); }} className="flex items-center space-x-1 bg-primary hover:bg-dark text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    <Plus className="w-5 h-5"/> <span>Ajouter</span>
                </button>
            </div>
             <div className="space-y-3">
                {[...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(item => (
                    <SwipeToDelete key={item.id} onDelete={() => handleDelete(item.id)}>
                        <div className="p-3 rounded-lg flex justify-between items-center border cursor-grab">
                            <div>
                                <p className="font-bold">{item.title}</p>
                                <p className="text-sm text-gray-600">{item.content.substring(0, 50)}...</p>
                            </div>
                            <div className="flex space-x-2 pl-4">
                                <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="text-blue-500 hover:text-blue-700 p-2"><Edit className="w-5 h-5"/></button>
                            </div>
                        </div>
                    </SwipeToDelete>
                ))}
            </div>
            {isModalOpen && editingItem && (
                <Modal onClose={() => setIsModalOpen(false)} title={editingItem.id ? "Modifier l'actualité" : "Ajouter une actualité"}>
                    <NewsForm item={editingItem} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
                </Modal>
            )}
        </div>
    );
};

export default AdminNews;