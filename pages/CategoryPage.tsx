import React, { useState, useMemo } from 'react';
import { services } from '../data/services';
import ServiceCard from '../components/ServiceCard';
import type { Service } from '../types';
import ServiceQuickViewModal from '../components/ServiceQuickViewModal';
import FilterSidebar, { Filters } from '../components/FilterSidebar';

interface CategoryPageProps {
  categoryName: string;
  onNavigate: (page: string, params?: any) => void;
  onAddToCart: (service: Service) => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ categoryName, onNavigate, onAddToCart }) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [filters, setFilters] = useState<Filters>({
    price_min: '',
    price_max: '',
    categories: [],
    rating: 0,
  });

  const filteredServices = useMemo(() => {
    return services
      .filter(service => service.category === categoryName)
      .filter(service => {
        // Price filter
        const minPrice = parseFloat(filters.price_min);
        const maxPrice = parseFloat(filters.price_max);
        if (!isNaN(minPrice) && service.price < minPrice) return false;
        if (!isNaN(maxPrice) && service.price > maxPrice) return false;

        // Rating filter
        if (filters.rating > 0 && service.rating < filters.rating) return false;

        return true;
      });
  }, [categoryName, filters]);


  const handleOpenModal = (service: Service) => {
    setSelectedService(service);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
  };
  
  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  return (
    <>
      <div className="bg-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold font-heading text-gray-900">{categoryName}</h1>
            <p className="text-lg text-gray-600 mt-2">Browse all services available in the {categoryName} category.</p>
          </div>

          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            <aside className="lg:col-span-1 mb-8 lg:mb-0">
               <FilterSidebar 
                onFilterChange={handleFilterChange}
                showCategoryFilter={false}
              />
            </aside>
            
            <main className="lg:col-span-3">
              {filteredServices.length > 0 ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredServices.map(service => (
                    <ServiceCard key={service.id} service={service} onOpenModal={handleOpenModal} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-secondary rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-800">No Services Found</h3>
                  <p className="text-gray-500 mt-2">There are no services matching your current filters in this category.</p>
                </div>
              )}
            </main>
          </div>
          
          <div className="text-center mt-16">
              <button
                onClick={() => onNavigate('home')}
                className="inline-block bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-900 transition-transform transform hover:scale-105 shadow-lg"
              >
                &larr; Back to Home
              </button>
          </div>
        </div>
      </div>
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

export default CategoryPage;
