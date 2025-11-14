import React, { useState, useEffect } from 'react';
import type { Service, ToastType } from '../types';
import ServiceQuickViewModal from './ServiceQuickViewModal';
import ServiceCard from './ServiceCard';
import { supabase } from '../supabaseClient';
import { services as mockServices } from '../data/services';


interface FeaturedServicesProps {
  onAddToCart: (service: Service) => void;
  onNavigate: (page: string, params?: any) => void;
  showToast: (message: string, type?: ToastType) => void;
}

const FeaturedServices: React.FC<FeaturedServicesProps> = ({ onAddToCart, onNavigate, showToast }) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .limit(4); // Fetch 4 featured services

      if (error) {
        console.warn('Error fetching featured services, falling back to mock data:', error.message);
        showToast('Could not fetch live data. Showing demo content.', 'error');
        setFeaturedServices(mockServices.slice(0, 4));
      } else {
        setFeaturedServices(data as Service[]);
      }
      setLoading(false);
    };

    fetchServices();
  }, [showToast]);

  const handleOpenModal = (service: Service) => {
    setSelectedService(service);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
  };

  return (
    <>
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 font-heading">Featured Solutions</h2>
            <p className="mt-4 text-lg text-gray-600">Hand-picked services from top developers in our ecosystem.</p>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredServices.map(service => (
                    <ServiceCard 
                      key={service.id} 
                      service={service} 
                      onOpenModal={handleOpenModal}
                      onAddToCart={onAddToCart}
                      onNavigate={onNavigate}
                    />
                ))}
            </div>
          )}
        </div>
      </section>
      {selectedService && (
        <ServiceQuickViewModal 
          service={selectedService} 
          onClose={handleCloseModal}
          onAddToCart={onAddToCart}
          onNavigate={onNavigate}
        />
      )}
    </>
  );
};

export default FeaturedServices;