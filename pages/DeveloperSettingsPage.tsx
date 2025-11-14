import React, { useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { ToastType } from '../types';

interface DeveloperSettingsPageProps {
  onNavigate: (page: string, params?: any) => void;
  session: Session | null;
  showToast: (message: string, type: ToastType) => void;
}

const DeveloperSettingsPage: React.FC<DeveloperSettingsPageProps> = ({ onNavigate, session, showToast }) => {
  const [formData, setFormData] = useState({
    fullName: session?.user?.user_metadata?.full_name || '',
    companyName: '',
    email: session?.user?.email || '',
    mobileNo: '',
    address: '',
    panNo: '',
    aadharNo: '',
    qualification: '',
    description: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      showToast('Profile updated successfully! (Demo)', 'success');
      console.log('Saving developer profile:', formData);
      // In a real app, you would save this data to your database
      // await supabase.from('profiles').update({ ... }).eq('id', session.user.id)
    }, 1000);
  };
  
  const FormField: React.FC<{ label: string; name: string; value: string; placeholder?: string; type?: string; required?: boolean }> = 
  ({ label, name, value, placeholder, type = 'text', required = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-bold text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={handleInputChange}
            required={required}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder={placeholder || `Enter your ${label.toLowerCase()}`}
        />
    </div>
  );

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
            <FormField label="Full Name" name="fullName" value={formData.fullName} required />
            <FormField label="Company Name (Optional)" name="companyName" value={formData.companyName} />
            <FormField label="Contact Email" name="email" value={formData.email} type="email" required />
            <FormField label="Mobile Number" name="mobileNo" value={formData.mobileNo} />
            <FormField label="Address (as per Aadhar)" name="address" value={formData.address} />
            <FormField label="PAN Number" name="panNo" value={formData.panNo} />
            <FormField label="Aadhar Number" name="aadharNo" value={formData.aadharNo} />
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
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Tell clients about your expertise, experience, and the types of solutions you specialize in."
              />
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
