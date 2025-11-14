

import React, { useState } from 'react';

interface HeroSectionProps {
  onNavigate: (page: string, params?: any) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('search', { query: searchQuery });
    }
  };

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold font-heading text-gray-900 leading-tight">
              The Digital Marketplace for <span className="text-primary">AI & Software</span> Solutions
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto md:mx-0">
              OWSCORP connects you with top-tier developers and cutting-edge digital products. Find, buy, and deploy agentic AI, automation tools, and applications with confidence.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button onClick={() => onNavigate('categories-list')} className="inline-block bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-900 transition-transform transform hover:scale-105 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary">
                Explore Services
              </button>
              <button onClick={() => onNavigate('auth', { initialForm: 'signup' })} className="inline-block bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-lg hover:bg-gray-300 transition-transform transform hover:scale-105 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400">
                Become a Seller
              </button>
            </div>
            <div className="mt-10 relative">
               <form onSubmit={handleSearchSubmit}>
                 <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search for AI agents, web templates, etc..."
                    className="w-full pl-5 pr-12 py-4 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="absolute right-0 top-0 mt-2 mr-2 p-2 bg-primary text-white rounded-full hover:bg-blue-900 focus:outline-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                  </button>
                 </div>
               </form>
            </div>
          </div>
          <div className="hidden md:block">
            <img src="https://picsum.photos/seed/owscorp-hero/800/600" alt="Digital Marketplace" className="rounded-2xl shadow-2xl object-cover w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;