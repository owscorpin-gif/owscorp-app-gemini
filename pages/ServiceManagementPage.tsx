import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { ToastType, Service } from '../types';
import { services } from '../data/services';

interface ServiceManagementPageProps {
  onNavigate: (page: string, params?: any) => void;
  session: Session | null;
  showToast: (message: string, type: ToastType) => void;
  serviceId?: string | null;
}

const ServiceManagementPage: React.FC<ServiceManagementPageProps> = ({ onNavigate, showToast, serviceId }) => {
  const [isNewService, setIsNewService] = useState(!serviceId);
  const initialFormData = useMemo(() => ({
    title: '',
    category: 'Web Application',
    price: 0,
    description: '',
  }), []);
  
  const [formData, setFormData] = useState<Partial<Service>>(initialFormData);
  const [keyFeatures, setKeyFeatures] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [images, setImages] = useState<string[]>([]); // URLs for existing or newly uploaded images
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (serviceId) {
      const existingService = services.find(s => s.id === serviceId);
      if (existingService) {
        setFormData(existingService);
        setKeyFeatures('- Feature 1\n- Feature 2\n- Feature 3');
        if(existingService.imageUrl) {
          setImages([existingService.imageUrl]);
        }
        setIsNewService(false);
      } else {
        showToast(`Service with ID ${serviceId} not found.`, 'error');
        onNavigate('developer-dashboard');
      }
    } else {
      setIsNewService(true);
      setFormData(initialFormData);
    }
  }, [serviceId, onNavigate, showToast, initialFormData]);

  // Track unsaved changes
  useEffect(() => {
    // A simple deep comparison could be implemented here for more accuracy
    const isDirty = JSON.stringify(formData) !== JSON.stringify(initialFormData) || keyFeatures !== '' || images.length > 0;
    setHasUnsavedChanges(isDirty);
  }, [formData, keyFeatures, images, initialFormData]);

  // Warn user before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = ''; // Required for Chrome
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);
  
  const handleNavigate = (page: string, params: any = {}) => {
      if (hasUnsavedChanges && !window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        return;
      }
      onNavigate(page, params);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setHasUnsavedChanges(false); // Reset unsaved changes flag
      const action = isNewService ? 'created' : 'updated';
      showToast(`Service "${formData.title}" ${action} successfully! (Demo)`, 'success');
      console.log('Saving service:', { ...formData, keyFeatures, images });
      onNavigate('developer-dashboard');
    }, 1000);
  };
  
  const handleImageUpload = useCallback((files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files).slice(0, 4 - images.length); // Limit to 4 images total
      const imagePreviews = newImages.map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...imagePreviews]);
    }
  }, [images.length]);

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const categories = ['Web Application', 'Mobile App', 'Desktop Software', 'Agentic AI'];

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="flex items-center mb-8">
          <button onClick={() => handleNavigate('developer-dashboard')} className="text-primary hover:text-blue-700 mr-4">
            &larr; Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isNewService ? 'List a New Service' : `Editing "${formData.title}"`}
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-secondary p-8 rounded-lg shadow-md space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">Service Title</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <select id="category" name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-bold text-gray-700 mb-2">Price (USD)</label>
            <input type="number" id="price" name="price" value={formData.price} onChange={handleInputChange} required min="0" step="0.01" className="w-full md:w-1/3 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">About Product / Description</label>
            <textarea id="description" name="description" rows={5} value={formData.description} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label htmlFor="keyFeatures" className="block text-sm font-bold text-gray-700 mb-2">Key Features (one per line)</label>
            <textarea id="keyFeatures" name="keyFeatures" rows={5} value={keyFeatures} onChange={(e) => setKeyFeatures(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="- Feature 1..." />
          </div>

           <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Product Images (up to 4)</label>
             <div 
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleImageUpload(e.dataTransfer.files); }}
             >
                <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-blue-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                        <span>Upload files</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={(e) => handleImageUpload(e.target.files)} disabled={images.length >= 4} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
            </div>
             {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {images.map((imgSrc, index) => (
                    <div key={index} className="relative group">
                      <img src={imgSrc} alt={`Preview ${index + 1}`} className="h-32 w-full object-cover rounded-md" />
                      <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button type="submit" disabled={isSaving} className="w-full sm:w-auto bg-accent text-white font-bold py-3 px-8 rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center disabled:opacity-70">
              {isSaving ? 'Saving...' : 'Save Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceManagementPage;