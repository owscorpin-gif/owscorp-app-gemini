import React, { useState, useMemo, useCallback } from 'react';
import type { Service } from '../types';
import { services } from '../data/services';
import ServiceCard from '../components/ServiceCard';
import ServiceQuickViewModal from '../components/ServiceQuickViewModal';
import FilterSidebar, { Filters } from '../components/FilterSidebar';

interface SearchResultsPageProps {
  query: string;
  onNavigate: (page: string, params?: any) => void;
  onAddToCart: (service: Service) => void;
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ query, onNavigate, onAddToCart }) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [filters, setFilters] = useState<Filters>({
    price_min: '',
    price_max: '',
    categories: [],
    rating: 0,
  });

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      // Search query filter
      const matchesQuery = service.title.toLowerCase().includes(query.toLowerCase()) ||
                           service.description.toLowerCase().includes(query.toLowerCase()) ||
                           service.developer.toLowerCase().includes(query.toLowerCase());
      if (!matchesQuery) return false;

      // Price filter
      const minPrice = parseFloat(filters.price_min);
      const maxPrice = parseFloat(filters.price_max);
      if (!isNaN(minPrice) && service.price < minPrice) return false;
      if (!isNaN(maxPrice) && service.price > maxPrice) return false;

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(service.category)) {
        return false;
      }
      
      // Rating filter
      if (filters.rating > 0 && service.rating < filters.rating) return false;

      return true;
    });
  }, [query, filters]);
  
  const allCategories = useMemo(() => [...new Set(services.map(s => s.category))], []);

  const handleOpenModal = (service: Service) => {
    setSelectedService(service);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
  };
  
  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);


  return (
    <>
      <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold font-heading text-gray-900">Search Results</h1>
            {query && (
              <p className="mt-2 text-lg text-gray-600">
                Showing results for: <span className="font-bold text-primary">{query}</span>
              </p>
            )}
          </div>
          
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            <aside className="lg:col-span-1">
              <FilterSidebar 
                onFilterChange={handleFilterChange}
                categories={allCategories}
                showCategoryFilter={true}
              />
            </aside>
            
            <main className="lg:col-span-3">
              {filteredServices.length > 0 ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredServices.map(service => (
                    <ServiceCard 
                      key={service.id} 
                      service={service} 
                      onOpenModal={handleOpenModal}
                      onAddToCart={onAddToCart}
                    />
                  ))}
                </div>
              ) : (
                 <div className="text-center py-16 bg-secondary rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-800">No Services Found</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your search query or filters.</p>
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

export default SearchResultsPage;