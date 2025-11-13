
import React from 'react';
import type { Session } from '@supabase/supabase-js';

const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const CategoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const ProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;


interface BottomNavBarProps {
  onNavigate: (page: string, params?: any) => void;
  session: Session | null;
  currentPage: string;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ onNavigate, session, currentPage }) => {
  const navItems = [
    { page: 'home', label: 'Home', icon: HomeIcon },
    { page: 'categories', label: 'Categories', icon: CategoryIcon },
    { page: 'search', label: 'Search', icon: SearchIcon },
    { page: 'chat', label: 'Chat', icon: ChatIcon },
    { page: 'profile', label: 'Profile', icon: ProfileIcon },
  ];

  const handleNav = (page: string) => {
    if (page === 'profile') {
      // Navigate to a future dashboard/profile page if logged in, otherwise auth page
      onNavigate(session ? 'dashboard' : 'auth', { initialForm: 'login' }); 
    } else if (page === 'categories') {
      if (currentPage === 'home') {
        document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        onNavigate('categories-list');
      }
    } else if (page === 'chat') {
        // Placeholder for chat functionality
        alert('AI Chatbot feature is coming soon!');
    } else {
      onNavigate(page);
    }
  };
  
  // Normalize currentPage for comparison (e.g., developer page is a type of profile view)
  const getActivePage = () => {
      if (['auth', 'developer', 'dashboard'].includes(currentPage)) return 'profile';
      if (['category', 'categories-list'].includes(currentPage)) return 'categories';
      return currentPage;
  }
  const activePage = getActivePage();


  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-40">
      <div className="flex justify-around items-center h-16">
        {navItems.map(item => (
          <button
            key={item.page}
            onClick={() => handleNav(item.page)}
            className="flex flex-col items-center justify-center text-gray-500 hover:text-primary transition-colors w-1/5 pt-1"
            aria-label={item.label}
          >
            <item.icon />
            <span className={`text-xs mt-1 ${activePage === item.page ? 'text-primary font-bold' : ''}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavBar;