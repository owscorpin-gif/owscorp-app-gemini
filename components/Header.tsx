

import React, { useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import MobileSidebar from './MobileSidebar';

interface HeaderProps {
  cartItemCount: number;
  onNavigate: (page: string, params?: any) => void;
  session: Session | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItemCount, onNavigate, session, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isDeveloper = session?.user?.user_metadata?.user_type === 'developer';

  // Fix: Explicitly type navLinks to allow for optional 'disabled' and 'page' properties.
  const navLinks: { name: string; page?: string; params?: any; disabled?: boolean }[] = [
    { name: 'Services', page: 'categories-list' },
    { name: 'Developers', page: 'developer', params: { developerId: 'ai-genix', developerName: 'AI Genix' } },
    { name: 'About', page: 'about' },
    { name: 'Support', page: 'contact', params: { developerId: 'ai-genix', developerName: 'AI Genix' } },
  ];

  const handleLogout = () => {
    onLogout();
  };
  
  const welcomeName = session?.user?.user_metadata?.full_name?.split(' ')[0] || session?.user?.email || 'User';

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <button onClick={() => onNavigate('home')} className="text-2xl font-bold font-heading text-primary">
                OWSCORP
              </button>
            </div>
            <nav className="hidden md:flex md:space-x-8">
              <button
                onClick={() => onNavigate('home')}
                className="text-gray-600 hover:text-primary font-medium transition duration-150 ease-in-out"
              >
                Home
              </button>
              {navLinks.map((link) => {
                if (link.disabled) {
                  return <span key={link.name} className="text-gray-400 cursor-not-allowed font-medium flex items-center">{link.name}</span>
                }
                return (
                  <button key={link.name} onClick={() => onNavigate(link.page!, link.params)} className="text-gray-600 hover:text-primary font-medium transition duration-150 ease-in-out">
                    {link.name}
                  </button>
                )
              })}
            </nav>
            <div className="hidden md:flex items-center space-x-4">
               {session ? (
                <>
                  <span className="text-gray-600 hidden lg:inline">Welcome, {welcomeName}</span>
                   {isDeveloper && (
                      <button onClick={() => onNavigate('developer-dashboard')} className="text-gray-600 hover:text-primary font-medium">
                          Dashboard
                      </button>
                  )}
                  <button onClick={handleLogout} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-900 transition duration-150 ease-in-out font-medium">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => onNavigate('auth', { initialForm: 'login' })} className="text-gray-600 hover:text-primary font-medium">Login</button>
                  <button onClick={() => onNavigate('auth', { initialForm: 'signup' })} className="bg-accent text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition duration-150 ease-in-out font-medium">
                    Sign Up
                  </button>
                </>
              )}
              <button onClick={() => onNavigate('cart')} className="relative text-gray-600 hover:text-primary p-2" aria-label={`Shopping cart with ${cartItemCount} items`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                          {cartItemCount}
                      </span>
                  )}
              </button>
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              >
                <span className="sr-only">Open main menu</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      <MobileSidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={onNavigate}
        session={session}
        cartItemCount={cartItemCount}
        onLogout={onLogout}
      />
    </>
  );
};

export default Header;