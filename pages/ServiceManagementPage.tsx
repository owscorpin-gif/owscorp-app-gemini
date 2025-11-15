import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { ToastType, Service } from '../types';
import { supabase } from '../supabaseClient';
import { services as mockServices } from '../data/services';

interface ServiceManagementPageProps {
  onNavigate: (page: string, params?: any) => void;
  session: Session | null;
  showToast: (message: string, type: ToastType) => void;
  serviceId?: string | null;
}

const ServiceManagementPage: React.FC<ServiceManagementPageProps> = ({ onNavigate, session, showToast, serviceId }) => {
  const isNewService = !serviceId;
  
  const initialFormData = useMemo(() => ({
    title: '',
    category: 'Web Application',
    price: 0,
    imageUrl: 'https://picsum.photos/seed/new-service/400/300',
    description: '',
    developer: session?.user?.user_metadata?.full_name || 'Unknown Developer',
    developer_id: session?.user?.id || '',
    developerVerified: true, 
    rating: 0,
    image_urls: []
  }), [session]);
  
  const [formData, setFormData] = useState<Partial<Service>>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!isNewService);
  const [images, setImages] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchService = async () => {
      if (serviceId) {
        if (!session?.user?.id) {
          showToast('You must be logged in to edit a service.', 'error');
          onNavigate('auth');
          return;
        }
        setIsLoading(true);

        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('id', serviceId)
          .eq('developer_id', session.user.id) // Security check for ownership
          .single();

        if (error || !data) {
          showToast('You do not have permission to edit this service or it does not exist.', 'error');
          onNavigate('developer-dashboard');
          return;
        }

        setFormData(data as Service);
        setImages(data.image_urls || (data.imageUrl ? [data.imageUrl] : []));
        setIsLoading(false);

      } else {
        setFormData(initialFormData);
        setImages([]);
      }
    };
    fetchService();
  }, [serviceId, onNavigate, showToast, initialFormData, session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return showToast('You must be logged in.', 'error');
    
    setIsSaving(true);
    
    const serviceDataToSave = {
      ...formData,
      developer: session.user.user_metadata?.full_name,
      developer_id: session.user.id,
      image_urls: images,
      imageUrl: images[0] || formData.imageUrl, // Set primary image
    };

    const { error } = await supabase.from('services').upsert(serviceDataToSave);
    setIsSaving(false);

    if (error) showToast(error.message, 'error');
    else {
      showToast(`Service "${formData.title}" ${isNewService ? 'created' : 'updated'} successfully!`, 'success');
      onNavigate('developer-dashboard');
    }
  };
  
  const handleImageUpload = useCallback(async (files: FileList | null) => {
    if (!files || !session?.user?.id) return;

    const filesToUpload = Array.from(files).slice(0, 4 - images.length);
    if (filesToUpload.length === 0) return;

    for (const file of filesToUpload) {
      const filePath = `${session.user.id}/${Date.now()}-${file.name}`;
      
      const { error } = await supabase.storage
        .from('service-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (error) {
        showToast(`Upload failed for ${file.name}: ${error.message}`, 'error');
      } else {
        const { data: { publicUrl } } = supabase.storage.from('service-images').getPublicUrl(filePath);
        setImages(prev => [...prev, publicUrl]);
      }
    }
  }, [images.length, session, showToast]);


  const handleRemoveImage = useCallback(async (imageUrl: string, index: number) => {
    const filePath = imageUrl.substring(imageUrl.lastIndexOf('service-images/') + 'service-images/'.length);
    
    const { error } = await supabase.storage.from('service-images').remove([filePath]);
    if (error) showToast(`Failed to delete image: ${error.message}`, 'error');
    else {
      setImages(prev => prev.filter((_, i) => i !== index));
      showToast('Image removed.', 'success');
    }
  }, [showToast]);

  const categories = ['Web Application', 'Mobile App', 'Desktop Software', 'Agentic AI'];

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="flex items-center mb-8">
          <button onClick={() => onNavigate('developer-dashboard')} className="text-primary hover:text-blue-700 mr-4">&larr; Back to Dashboard</button>
          <h1 className="text-3xl font-bold text-gray-900">{isNewService ? 'List a New Service' : `Editing "${formData.title}"`}</h1>
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
             <label className="block text-sm font-bold text-gray-700 mb-2">Product Images (up to 4)</label>
             <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); handleImageUpload(e.dataTransfer.files); }}>
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
                    <div key={imgSrc} className="relative group">
                      <img src={imgSrc} alt={`Preview ${index + 1}`} className="h-32 w-full object-cover rounded-md" />
                      <button type="button" onClick={() => handleRemoveImage(imgSrc, index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
                       {index === 0 && <span className="absolute bottom-1 left-1 bg-primary text-white text-xs font-bold px-2 py-1 rounded">Primary</span>}
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