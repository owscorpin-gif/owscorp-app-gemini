import React, { useState, useEffect } from 'react';
import type { Service } from '../types';

const StarIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const SpinnerIcon: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

interface ServiceQuickViewModalProps {
  service: Service;
  onClose: () => void;
  onAddToCart: (service: Service) => void;
  onNavigate: (page: string, params?: any) => void;
}

const ServiceQuickViewModal: React.FC<ServiceQuickViewModalProps> = ({ service, onClose, onAddToCart, onNavigate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  if (!service) return null;

  const handleAddToCartClick = () => {
    setIsAdding(true);
    // Simulate an async API call
    setTimeout(() => {
      onAddToCart(service);
      setIsAdding(false);
      setIsAdded(true);
    }, 500);
  };

  const handleNavigateToDeveloper = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
    onNavigate('developer', { developer_id: service.developer_id, developerName: service.developer });
  };
  
  useEffect(() => {
    if (isAdded) {
      const timer = setTimeout(() => setIsAdded(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isAdded]);

  useEffect(() => {
    setIsAdded(false);
    setIsAdding(false);
  }, [service]);


  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row" onClick={(e) => e.stopPropagation()}>
        <div className="w-full md:w-1/2">
            <img src={service.imageUrl} alt={service.title} className="w-full h-64 md:h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none" />
        </div>
        <div className="w-full md:w-1/2 p-8 relative flex flex-col">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" aria-label="Close modal">
                 <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div className="flex-grow">
                <span className="inline-block bg-accent text-white px-3 py-1 rounded-full text-xs font-bold uppercase">{service.category}</span>
                <h2 className="text-3xl font-bold font-heading text-gray-900 mt-4">{service.title}</h2>
                <p className="text-md text-gray-500 mt-2">
                    by <a href="#" onClick={handleNavigateToDeveloper} className="text-primary hover:underline inline-flex items-center">
                        {service.developer}
                        {service.developerVerified && (
                            <span title="Verified Developer">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1.5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </span>
                        )}
                    </a>
                </p>
                
                <div className="flex items-center mt-4">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} className={`w-5 h-5 ${i < Math.round(service.rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                    </div>
                    <span className="ml-2 text-gray-600 font-bold">{service.rating.toFixed(1)}</span>
                    <span className="ml-2 text-gray-400 text-sm">(based on 24 reviews)</span>
                </div>

                <p className="mt-6 text-gray-600">{service.description}</p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
                 <div className="flex justify-between items-center">
                    <p className="text-3xl font-extrabold text-primary">${service.price.toFixed(2)}</p>
                     <button 
                        onClick={handleAddToCartClick}
                        disabled={isAdding || isAdded}
                        className={`font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center w-48 ${
                        isAdded
                            ? 'bg-accent text-white cursor-not-allowed'
                            : isAdding
                            ? 'bg-primary/80 text-white cursor-wait'
                            : 'bg-primary text-white hover:bg-blue-900'
                        }`}
                     >
                        {isAdding && <SpinnerIcon />}
                        {isAdding ? 'Adding...' : isAdded ? 'Added!' : 'Add to Cart'}
                    </button>
                </div>
                <a href="#" onClick={handleNavigateToDeveloper} className="block text-center mt-4 text-sm text-primary hover:underline">View Full Details &rarr;</a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceQuickViewModal;