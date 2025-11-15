import React, { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { ToastType, Service } from '../types';
import ConfirmationModal from '../components/ConfirmationModal';
import { supabase } from '../supabaseClient';
import { services as mockServices } from '../data/services';

// --- SVG Icons ---
const DollarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v1m0 6v1m6-4a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;
const SalesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;

interface DeveloperDashboardPageProps {
  onNavigate: (page: string, params?: any) => void;
  session: Session | null;
  showToast: (message: string, type: ToastType) => void;
}

const AnalyticsCard: React.FC<{ title: string, value: string, icon: React.ReactNode, color: string }> = ({ title, value, icon, color }) => (
  <div className={`bg-gradient-to-br ${color} p-6 rounded-xl shadow-lg text-white`}>
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm font-medium uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className="bg-white/20 p-3 rounded-full">
        {icon}
      </div>
    </div>
  </div>
);

const DeveloperDashboardPage: React.FC<DeveloperDashboardPageProps> = ({ onNavigate, session, showToast }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [developerServices, setDeveloperServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeveloperServices = async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('developer_id', session.user.id);
    
    if (error) {
      showToast('Could not fetch your services, showing demo data.', 'error');
      console.warn('Error fetching developer services, falling back to mock data:', error.message);
      const demoServices = mockServices.filter(s => s.developer_id === 'ai-genix');
      setDeveloperServices(demoServices);
    } else {
      setDeveloperServices(data as Service[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDeveloperServices();
  }, [session, showToast]);


  const handleOpenDeleteModal = (service: Service) => {
    setServiceToDelete(service);
    setIsDeleteModalOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;

    // 1. Delete associated images from storage (if they exist)
    if (serviceToDelete.image_urls && serviceToDelete.image_urls.length > 0) {
      const filePaths = serviceToDelete.image_urls.map(url => {
        // Extract the path from the full public URL
        const path = url.split('/service-images/')[1];
        return path;
      }).filter(Boolean); // Filter out any undefined/null paths

      if (filePaths.length > 0) {
        const { error: storageError } = await supabase.storage.from('service-images').remove(filePaths);
        if (storageError) {
          showToast(`Could not delete associated images: ${storageError.message}`, 'error');
          // We will still proceed to delete the database record
        }
      }
    }

    // 2. Delete the service record from the database
    const { error: dbError } = await supabase.from('services').delete().eq('id', serviceToDelete.id);
    if (dbError) {
      showToast(dbError.message, 'error');
    } else {
      showToast(`"${serviceToDelete.title}" has been deleted.`, 'success');
      fetchDeveloperServices(); // Refresh the list
    }

    // 3. Clean up state
    setIsDeleteModalOpen(false);
    setServiceToDelete(null);
  };
  
  const welcomeName = session?.user?.user_metadata?.full_name || session?.user?.email || 'Developer';

  return (
    <div className="bg-secondary min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Developer Dashboard</h1>
            <p className="mt-1 text-gray-600">Welcome back, {welcomeName}!</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
             <button onClick={() => onNavigate('developer-settings')} className="bg-white text-gray-700 font-medium py-2 px-4 rounded-lg shadow-sm hover:bg-gray-100 border">
                Edit Profile
              </button>
             <button onClick={() => onNavigate('service-management')} className="bg-accent text-white font-bold py-2 px-4 rounded-lg shadow-sm hover:bg-emerald-600">
                + List New Service
              </button>
          </div>
        </div>

        {/* Analytics Section - Values are placeholders for a real analytics backend */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AnalyticsCard title="Total Revenue" value="--" icon={<DollarIcon />} color="from-blue-500 to-blue-700" />
          <AnalyticsCard title="Services Sold" value="--" icon={<CartIcon />} color="from-emerald-500 to-emerald-700" />
          <AnalyticsCard title="Listed Services" value={loading ? '--' : developerServices.length.toString()} icon={<SalesIcon />} color="from-indigo-500 to-indigo-700" />
          <AnalyticsCard title="Average Rating" value="--" icon={<StarIcon />} color="from-amber-500 to-amber-700" />
        </div>

        {/* Service Management Section */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Manage Your Services</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b-2 border-gray-200">
                <tr className="text-sm text-gray-500 uppercase">
                  <th className="py-3 px-4">Service Name</th>
                  <th className="py-3 px-4 hidden md:table-cell">Category</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Price</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                    <tr><td colSpan={4} className="text-center py-8">Loading services...</td></tr>
                ) : developerServices.map(service => (
                  <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-800">{service.title}</td>
                    <td className="py-4 px-4 text-gray-600 hidden md:table-cell">{service.category}</td>
                    <td className="py-4 px-4 text-gray-600 hidden sm:table-cell font-mono">${service.price.toFixed(2)}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => onNavigate('service-management', { serviceId: service.id })} className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm p-2 rounded-md bg-blue-100/50 hover:bg-blue-100">
                          <EditIcon /> <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button onClick={() => handleOpenDeleteModal(service)} className="flex items-center text-red-600 hover:text-red-800 font-medium text-sm p-2 rounded-md bg-red-100/50 hover:bg-red-100">
                           <DeleteIcon /> <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
             {!loading && developerServices.length === 0 && (
              <p className="text-center py-8 text-gray-500">You haven't listed any services yet.</p>
            )}
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Service"
        message={`Are you sure you want to delete "${serviceToDelete?.title}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default DeveloperDashboardPage;