import React, { useState, useEffect } from 'react';
import type { Service, ToastType } from '../types';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';

interface CustomerDashboardPageProps {
  onNavigate: (page: string, params?: any) => void;
  session: Session | null;
  showToast: (message: string, type?: ToastType) => void;
}

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const CustomerDashboardPage: React.FC<CustomerDashboardPageProps> = ({ onNavigate, session, showToast }) => {
  const [purchasedItems, setPurchasedItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchasedItems = async () => {
      if (!session?.user?.id) {
        showToast('You must be logged in to view your dashboard.', 'error');
        onNavigate('auth');
        return;
      }
      
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          services(*)
        `)
        .eq('user_id', session.user.id);

      if (error) {
        showToast('Could not fetch purchase history.', 'error');
        console.warn('Error fetching purchased items:', error.message);
      } else {
        // Fix: Deduplicate items. If a user buys the same service twice, it should only appear once.
        const uniqueItemsMap = new Map<string, Service>();
        data.forEach(order => {
          // The join might return a null service if it was deleted, so we check for that.
          if (order.services && !uniqueItemsMap.has(order.services.id)) {
            uniqueItemsMap.set(order.services.id, order.services as Service);
          }
        });
        const uniqueItems = Array.from(uniqueItemsMap.values());
        setPurchasedItems(uniqueItems);
      }
      setLoading(false);
    };

    if (session) {
      fetchPurchasedItems();
    }
  }, [session, onNavigate, showToast]);

  const handleDownload = (serviceTitle: string) => {
    showToast(`Downloading "${serviceTitle}"...`, 'success');
    // In a real app, this would trigger a file download.
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-secondary min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Purchased Services</h1>

        {purchasedItems.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800">No Purchases Yet</h2>
            <p className="text-gray-600 mt-2 mb-6">
              You haven't purchased any services. Explore our marketplace to find the perfect solution!
            </p>
            <button
              onClick={() => onNavigate('categories-list')}
              className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-900 transition-transform transform hover:scale-105 shadow-lg"
            >
              Explore Services
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b-2 border-gray-200">
                  <tr className="text-sm text-gray-500 uppercase">
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4 hidden md:table-cell">Developer</th>
                    <th className="py-3 px-4 hidden sm:table-cell">Price</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {purchasedItems.map(item => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover rounded-md mr-4 hidden sm:block"/>
                          <div>
                            <p className="font-medium text-gray-800">{item.title}</p>
                            <p className="text-sm text-gray-500">{item.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600 hidden md:table-cell">{item.developer}</td>
                      <td className="py-4 px-4 text-gray-600 hidden sm:table-cell font-mono">${item.price.toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleDownload(item.title)}
                          className="flex items-center bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors"
                        >
                          <DownloadIcon />
                          <span>Download</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboardPage;