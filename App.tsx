import React, { useState, useEffect, useCallback } from 'react';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatbotWidget from './components/ChatbotWidget';
import type { CartItem, Service } from './types';
import DeveloperProfilePage from './pages/DeveloperProfilePage';
import Toast from './components/Toast';
import AuthPage from './pages/AuthPage';
import { supabase } from './supabaseClient';
import type { Session, Subscription } from '@supabase/supabase-js';
import SearchResultsPage from './pages/SearchResultsPage';
import CartPage from './pages/CartPage';
import CategoryPage from './pages/CategoryPage';
import BottomNavBar from './components/BottomNavBar';
import CategoriesListPage from './pages/CategoriesListPage';

const App: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentView, setCurrentView] = useState<{ page: string; params: any }>({ page: 'home', params: {} });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let authSubscription: Subscription | null = null;

    const setupAuth = async () => {
      try {
        // First, get the initial session. This is an async call that might fail.
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);

        // Then, set up the listener for auth state changes (login, logout, etc.)
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
        });
        authSubscription = data.subscription;
      } catch (error) {
        console.error("Error during authentication setup:", error);
      } finally {
        // No matter what happens, we are done with the initial auth check.
        setLoading(false);
      }
    };

    setupAuth();

    // The cleanup function runs when the component unmounts.
    return () => {
      authSubscription?.unsubscribe();
    };
  }, []);
  
  const handleNavigate = useCallback((page: string, params = {}) => {
    setCurrentView({ page, params });
    window.scrollTo(0, 0);
  }, []);

  // Handles navigation side-effect safely after render.
  useEffect(() => {
    if (session && currentView.page === 'auth') {
      handleNavigate('home');
    }
  }, [session, currentView.page, handleNavigate]);


  const handleAddToCart = useCallback((service: Service) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === service.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === service.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...service, quantity: 1 }];
    });
    setToastMessage(`'${service.title}' added to cart!`);
  }, []);
  
  const handleRemoveFromCart = useCallback((itemId: string) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === itemId);
      if (itemToRemove) {
        setToastMessage(`'${itemToRemove.title}' removed from cart.`);
      }
      return prevItems.filter(item => item.id !== itemId);
    });
  }, []);

  const handleUpdateQuantity = useCallback((itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(itemId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  }, [handleRemoveFromCart]);

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const renderPage = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    switch (currentView.page) {
      case 'developer':
        return <DeveloperProfilePage 
                  developerId={currentView.params.developerId} 
                  developerName={currentView.params.developerName} 
                  onNavigate={handleNavigate} 
                  onAddToCart={handleAddToCart}
                  session={session}
                />;
      case 'auth':
        return <AuthPage onNavigate={handleNavigate} initialForm={currentView.params.initialForm} />;
      case 'search':
        return <SearchResultsPage query={currentView.params.query} onNavigate={handleNavigate} onAddToCart={handleAddToCart} />;
      case 'cart':
        return <CartPage 
                  cartItems={cartItems} 
                  onNavigate={handleNavigate} 
                  onRemoveFromCart={handleRemoveFromCart}
                  onUpdateQuantity={handleUpdateQuantity}
                />;
       case 'category':
        return <CategoryPage 
                  categoryName={currentView.params.categoryName} 
                  onNavigate={handleNavigate} 
                  onAddToCart={handleAddToCart}
                />;
       case 'categories-list':
        return <CategoriesListPage onNavigate={handleNavigate} />;
      case 'home':
      default:
        return <HomePage onAddToCart={handleAddToCart} onNavigate={handleNavigate} />;
    }
  }
  
  const showHeaderFooter = currentView.page !== 'auth' && !loading;

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      {showHeaderFooter && <Header cartItemCount={cartItemCount} onNavigate={handleNavigate} session={session} />}
      <main className="flex-grow pb-16 md:pb-0">
        {renderPage()}
      </main>
      {showHeaderFooter && <Footer />}
      {showHeaderFooter && <ChatbotWidget />}
      {showHeaderFooter && <BottomNavBar onNavigate={handleNavigate} session={session} currentPage={currentView.page} />}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
};

export default App;