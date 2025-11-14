import React, { useState } from 'react';
import type { Service } from '../types';
import ServiceQuickViewModal from './ServiceQuickViewModal';
import ServiceCard from './ServiceCard';
import { services as featuredServices } from '../data/services';


interface FeaturedServicesProps {
  onAddToCart: (service: Service) => void;
  onNavigate: (page: string, params?: any) => void;
}

const FeaturedServices: React.FC<FeaturedServicesProps> = ({ onAddToCart, onNavigate }) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

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