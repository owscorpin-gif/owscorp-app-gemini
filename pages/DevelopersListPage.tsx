import React, { useState, useEffect } from 'react';
import type { Profile } from '../types';
import { supabase } from '../supabaseClient';
import DeveloperCard from '../components/DeveloperCard';

interface DevelopersListPageProps {
  onNavigate: (page: string, params?: any) => void;
}

const DevelopersListPage: React.FC<DevelopersListPageProps> = ({ onNavigate }) => {
  const [developers, setDevelopers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevelopers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'developer'); // Filter only for developers
      
      if (error) {
        console.error('Error fetching developers:', error);
      } else {
        setDevelopers(data as Profile[]);
      }
      setLoading(false);
    };

    fetchDevelopers();
  }, []);

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold font-heading text-gray-900">Our Developers</h1>
          <p className="mt-4 text-lg text-gray-600">Browse the talented creators building the future of software on OWSCORP.</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          </div>
        ) : developers.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {developers.map(dev => (
              <DeveloperCard key={dev.id} developer={dev} onNavigate={onNavigate} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-secondary rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800">No Developers Found</h3>
            <p className="text-gray-500 mt-2">Check back soon as our community grows!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DevelopersListPage;