import React, { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { ToastType, Profile } from '../types';
import { supabase } from '../supabaseClient';

interface DeveloperSettingsPageProps {
  onNavigate: (page: string, params?: any) => void;
  session: Session | null;
  showToast: (message: string, type: ToastType) => void;
}

const DeveloperSettingsPage: React.FC<DeveloperSettingsPageProps> = ({ onNavigate, session, showToast }) => {
  const [formData, setFormData] = useState<Profile>({
    id: session?.user?.id || '',
    full_name: session?.user?.user_metadata?.full_name || '',
    company_name: '',
    mobile_no: '',
    address: '',
    pan_no: '',
    aadhar_no: '',
    qualification: '',
    description: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) {
          setIsLoading(false);
          return;
      };
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') { // Ignore "No rows found" error
        showToast(error.message, 'error');
      } else if (data) {
        setFormData({
            id: data.id,
            full_name: data.full_name || formData.full_name,
            company_name: data.company_name || '',
            mobile_no: data.mobile_no || '',
            address: data.address || '',
            pan_no: data.pan_no || '',
            aadhar_no: data.aadhar_no || '',
            qualification: data.qualification || '',
            description: data.description || '',
        });
      }
      setIsLoading(false);
    };
    fetchProfile();
  }, [session, showToast, formData.full_name]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
        showToast('You must be logged in to update your profile.', 'error');
        return;
    }
    setIsSaving(true);
    
    const { error } = await supabase.from('profiles').upsert({
        ...formData,
        id: session.user.id,
        updated_at: new Date().toISOString(),
    });

    setIsSaving(false);
    if (error) {
        showToast(error.message, 'error');
    } else {
        showToast('Profile updated successfully!', 'success');
        onNavigate('developer-dashboard');
    }
  };
  
  const FormField: React.FC<{ label: string; name: keyof Profile; value: string | undefined; placeholder?: string; type?: string; required?: boolean }> = 
  ({ label, name, value, placeholder, type = 'text', required = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-bold text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            value={value || ''}
            onChange={handleInputChange}
            required={required}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder={placeholder || `Enter your ${label.toLowerCase()}`}
        />
    </div>
  );

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      );
  }

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="flex items-center mb-8">
            <button onClick={() => onNavigate('developer-dashboard')} className="text-primary hover:text-blue-700 mr-4">
                 &larr; Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Developer Profile Settings</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-secondary p-8 rounded-lg shadow-md space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Full Name" name="full_name" value={formData.full_name} required />
            <FormField label="Company Name (Optional)" name="company_name" value={formData.company_name} />
            <FormField label="Mobile Number" name="mobile_no" value={formData.mobile_no} />
            <FormField label="Address (as per Aadhar)" name="address" value={formData.address} />
            <FormField label="PAN Number" name="pan_no" value={formData.pan_no} />
            <FormField label="Aadhar Number" name="aadhar_no" value={formData.aadhar_no} />
            <FormField label="Highest Qualification" name="qualification" value={formData.qualification} />
          </div>
          
           <div>
              <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">
                Public Bio / Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                value={formData.description || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Tell clients about your expertise, experience, and the types of solutions you specialize in."
              />
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Account Verification</h3>
              <p className="text-gray-600 mb-4">
                  Upload a government-issued ID to get a verified badge on your profile and services. This increases trust with buyers.
              </p>
              <button
                  type="button"
                  onClick={() => showToast('Verification document upload is coming soon!', 'success')}
                  className="bg-primary text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-900 transition-colors flex items-center justify-start"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  Upload Identification Document
              </button>
            </div>

            <div className="pt-4 border-t border-gray-200">
                 <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full sm:w-auto bg-accent text-white font-bold py-3 px-8 rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center disabled:opacity-70"
                >
                    {isSaving ? 'Saving...' : 'Save Profile'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default DeveloperSettingsPage;