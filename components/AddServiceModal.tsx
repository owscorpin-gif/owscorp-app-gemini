import React, { useState } from 'react';
import type { Service } from '../types';

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddService: (service: Partial<Service>) => void;
}

const AddServiceModal: React.FC<AddServiceModalProps> = ({ isOpen, onClose, onAddService }) => {
  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    category: 'Web Application',
    price: 0,
    description: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      onAddService(formData);
      // Reset form for next time
      setFormData({ title: '', category: 'Web Application', price: 0, description: '' });
    }, 500);
  };

  const categories = ['Web Application', 'Mobile App', 'Desktop Software', 'Agentic AI'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Add a New Service</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="modal-title" className="block text-sm font-bold text-gray-700 mb-2">Service Title</label>
            <input type="text" id="modal-title" name="title" value={formData.title} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="modal-category" className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <select id="modal-category" name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
             <div>
                <label htmlFor="modal-price" className="block text-sm font-bold text-gray-700 mb-2">Price (USD)</label>
                <input type="number" id="modal-price" name="price" value={formData.price} onChange={handleInputChange} required min="0" step="0.01" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" />
             </div>
          </div>
           <div>
            <label htmlFor="modal-description" className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea id="modal-description" name="description" rows={4} value={formData.description} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div className="flex justify-end items-center p-6 border-t mt-6">
            <button type="button" onClick={onClose} className="text-gray-600 font-medium hover:text-primary mr-4">Cancel</button>
            <button type="submit" disabled={isSaving} className="bg-accent text-white font-bold py-2 px-6 rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center disabled:opacity-70">
              {isSaving ? 'Adding...' : 'Add Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServiceModal;
