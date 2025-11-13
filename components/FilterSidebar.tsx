import React, { useState, useEffect } from 'react';

export interface Filters {
  price_min: string;
  price_max: string;
  categories: string[];
  rating: number;
}

interface FilterSidebarProps {
  onFilterChange: (filters: Filters) => void;
  categories?: string[];
  showCategoryFilter: boolean;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange, categories = [], showCategoryFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<Filters>({
    price_min: '',
    price_max: '',
    categories: [],
    rating: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
        setLocalFilters(prev => ({
            ...prev,
            categories: checked 
                ? [...prev.categories, value]
                : prev.categories.filter(cat => cat !== value),
        }));
    } else {
       setLocalFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRatingChange = (rating: number) => {
    setLocalFilters(prev => ({...prev, rating: prev.rating === rating ? 0 : rating }));
  };
  
  const applyFilters = () => {
    onFilterChange(localFilters);
    setIsOpen(false); // Close mobile drawer on apply
  };
  
  const clearFilters = () => {
    const clearedFilters = { price_min: '', price_max: '', categories: [], rating: 0 };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
    setIsOpen(false);
  }

  // Apply filters immediately on desktop as user interacts with them
  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop) {
        onFilterChange(localFilters);
    }
  }, [localFilters, onFilterChange]);


  const renderFilters = () => (
    <div className="space-y-6">
      {/* Price Filter */}
      <div>
        <h3 className="font-bold text-gray-800 mb-2">Price Range</h3>
        <div className="flex items-center space-x-2">
          <input type="number" name="price_min" value={localFilters.price_min} onChange={handleInputChange} placeholder="Min" className="w-full p-2 border border-gray-300 rounded-md" />
          <span>-</span>
          <input type="number" name="price_max" value={localFilters.price_max} onChange={handleInputChange} placeholder="Max" className="w-full p-2 border border-gray-300 rounded-md" />
        </div>
      </div>

      {/* Category Filter */}
      {showCategoryFilter && (
        <div>
          <h3 className="font-bold text-gray-800 mb-2">Category</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {categories.map(category => (
              <label key={category} className="flex items-center">
                <input type="checkbox" value={category} checked={localFilters.categories.includes(category)} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="ml-3 text-gray-600">{category}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Rating Filter */}
      <div>
        <h3 className="font-bold text-gray-800 mb-2">Rating</h3>
        <button onClick={() => handleRatingChange(4)} className={`w-full text-left p-2 rounded-md border ${localFilters.rating === 4 ? 'bg-primary text-white border-primary' : 'border-gray-300'}`}>
          4 stars & up
        </button>
      </div>

      {/* Action Buttons (for mobile) */}
      <div className="lg:hidden space-y-2 pt-4 border-t">
        <button onClick={applyFilters} className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg">Apply Filters</button>
        <button onClick={clearFilters} className="w-full bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Clear Filters</button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button onClick={() => setIsOpen(true)} className="w-full flex items-center justify-center bg-white border border-gray-300 p-3 rounded-lg shadow-sm">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" /></svg>
          Filter Results
        </button>
      </div>
      
      {/* Mobile Drawer */}
       {isOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsOpen(false)}></div>
       )}
      <div className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden p-6 overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={() => setIsOpen(false)}>&times;</button>
        </div>
        {renderFilters()}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block bg-secondary p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Filters</h2>
            <button onClick={clearFilters} className="text-sm text-primary hover:underline">Clear</button>
        </div>
        {renderFilters()}
      </div>
    </>
  );
};

export default FilterSidebar;
