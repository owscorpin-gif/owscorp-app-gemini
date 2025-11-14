import React, { useState, useMemo, useCallback, useEffect } from 'react';
import ServiceCard from '../components/ServiceCard';
import type { Service, ToastType } from '../types';
import ServiceQuickViewModal from '../components/ServiceQuickViewModal';
import FilterSidebar, { Filters } from '../components/FilterSidebar';
import { supabase } from '../supabaseClient';
import { services as mockServices } from '../data/services';

interface CategoryPageProps {
  categoryName: string;
  onNavigate: (page: string, params?: any) => void;
  onAddToCart: (service: Service) => void;
  showToast: (message: string, type?: ToastType) => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ categoryName, onNavigate, onAddToCart, showToast }) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    price_min: '',
    price_max: '',
    categories: [],
    rating: 0,
  });

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('category', categoryName);

      if (error) {
        console.warn(`Error fetching services for category ${categoryName}, falling back to mock data:`, error.message);
        showToast('Could not fetch live data. Showing demo content.', 'error');
        const categoryServices = mockServices.filter(s => s.category === categoryName);
        setServices(categoryServices);
      } else {
        setServices(data as Service[]);
      }
      setLoading(false);
    };

    fetchServices();
  }, [categoryName, showToast]);

  const filteredServices = useMemo(() => {
    return services
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
  }, [services, filters]);


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
      <div className="bg-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
             <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <button onClick={() => onNavigate('home')} className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                    Home
                  </button>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                    <button onClick={() => onNavigate('categories-list')} className="ml-1 text-sm font-medium text-gray-700 hover:text-primary md:ml-2">Categories</button>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                    <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">{categoryName}</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
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
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                </div>
              ) : filteredServices.length > 0 ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredServices.map(service => (
                    <ServiceCard 
                      key={service.id} 
                      service={service} 
                      onOpenModal={handleOpenModal}
                      onAddToCart={onAddToCart}
                      onNavigate={onNavigate}
                    />
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