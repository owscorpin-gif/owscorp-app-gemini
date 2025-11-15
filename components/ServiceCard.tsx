import React from 'react';
import type { Service } from '../types';

const StarIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

interface ServiceCardProps {
    service: Service;
    onOpenModal?: (service: Service) => void;
    onAddToCart?: (service: Service) => void;
    onNavigate?: (page: string, params?: any) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onOpenModal, onAddToCart, onNavigate }) => {
    const handleAddToCartClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onAddToCart) {
            onAddToCart(service);
        }
    };
    
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group flex flex-col">
            <div className="relative">
                <img className="w-full h-56 object-cover" src={service.imageUrl} alt={service.title} />
                <div className="absolute top-0 right-0 bg-accent text-white px-3 py-1 m-2 rounded-full text-sm font-bold">{service.category}</div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <h3
                    className="text-xl font-bold font-heading text-gray-900 mb-2 group-hover:text-primary transition-colors"
                >
                    {service.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4 flex items-center">
                  by&nbsp;
                  <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onNavigate?.('developer', { developerId: service.developer_id, developerName: service.developer });
                    }}
                    disabled={!onNavigate}
                    className="font-medium text-primary hover:underline focus:outline-none disabled:no-underline disabled:text-gray-500 disabled:cursor-default"
                  >
                    {service.developer}
                  </button>
                  {service.developerVerified && (
                    <span title="Verified Developer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </p>
                <div className="flex-grow"></div>
                <div className="flex justify-between items-center mt-auto">
                    <div className="flex items-center">
                        <StarIcon className="w-5 h-5 text-yellow-400" />
                        <span className="ml-1 text-gray-600 font-bold">{service.rating}</span>
                    </div>
                    <div className="text-2xl font-extrabold text-primary">${service.price.toFixed(2)}</div>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    {onOpenModal && (
                        <button
                            onClick={() => onOpenModal(service)}
                            className="flex-1 bg-primary/90 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary transition-colors duration-200"
                        >
                            Quick View
                        </button>
                    )}
                    {onAddToCart && (
                        <button
                            onClick={handleAddToCartClick}
                            className="flex-1 bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors duration-200"
                            aria-label={`Add ${service.title} to cart`}
                        >
                            Add to Cart
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;