import React from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string, params?: any) => void;
  session: Session | null;
  cartItemCount: number;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose, onNavigate, session, cartItemCount }) => {
  const isDeveloper = session?.user?.user_metadata?.user_type === 'developer';
  
  const handleNavigation = (page: string, params = {}) => {
    onNavigate(page, params);
    onClose();
  };

  const handleDashboardNav = () => {
    if (isDeveloper) {
      handleNavigation('developer-dashboard');
    } else {
      handleNavigation('customer-dashboard');
    }
  };

  const handleSettingsNav = () => {
    if (isDeveloper) {
      handleNavigation('developer-settings');
    } else {
      alert("Customer settings coming soon!");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    handleNavigation('home');
  };
  
  const welcomeName = session?.user?.user_metadata?.full_name?.split(' ')[0] || session?.user?.email || 'User';

  const NavButton: React.FC<{onClick: () => void, children: React.ReactNode, disabled?: boolean}> = ({ onClick, children, disabled }) => (
     <button
      onClick={onClick}
      disabled={disabled}
      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <button onClick={() => handleNavigation('home')} className="text-2xl font-bold font-heading text-primary">
              OWSCORP
            </button>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-grow p-4 space-y-2">
            {session && <NavButton onClick={handleDashboardNav}>My Dashboard</NavButton>}
            <NavButton onClick={() => handleNavigation('categories-list')}>Services</NavButton>
            <NavButton onClick={() => handleNavigation('about')}>About Us</NavButton>
            {session && <NavButton onClick={handleSettingsNav}>Settings</NavButton>}
            <NavButton onClick={() => handleNavigation('contact', { developerId: 'ai-genix', developerName: 'AI Genix' })}>Contact</NavButton>
            <NavButton onClick={() => {}} disabled={true}>Support Center</NavButton>
            
            <button onClick={() => handleNavigation('cart')} className="relative flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left rounded-md">
              <span>Shopping Cart</span>
              {cartItemCount > 0 && (
                <span className="ml-auto bg-primary text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </nav>
          
          {/* Footer/Auth Section */}
          <div className="p-4 border-t">
            {session ? (
              <div className="space-y-3">
                 <p className="px-3 text-sm text-gray-600">Signed in as {welcomeName}</p>
                 <button onClick={handleLogout} className="w-full text-center bg-gray-100 text-gray-800 px-4 py-3 rounded-md hover:bg-gray-200 font-medium">Logout</button>
              </div>
            ) : (
              <div className="space-y-3">
                <button onClick={() => handleNavigation('auth', { initialForm: 'login' })} className="w-full text-center bg-gray-100 text-gray-800 px-4 py-3 rounded-md hover:bg-gray-200 font-medium">Login</button>
                <button onClick={() => handleNavigation('auth', { initialForm: 'signup' })} className="w-full text-center bg-accent text-white px-4 py-3 rounded-md hover:bg-emerald-600 font-medium">Sign Up</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;