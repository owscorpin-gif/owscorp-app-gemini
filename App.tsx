import React, { useState, useEffect, useCallback } from 'react';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatbotWidget from './components/ChatbotWidget';
import type { CartItem, Service, ToastState, ToastType } from './types';
import DeveloperProfilePage from './pages/DeveloperProfilePage';
import Toast from './components/Toast';
import AuthPage from './pages/AuthPage';
import type { Session } from '@supabase/supabase-js';
import SearchResultsPage from './pages/SearchResultsPage';
import CartPage from './pages/CartPage';
import CategoryPage from './pages/CategoryPage';
import BottomNavBar from './components/BottomNavBar';
import CategoriesListPage from './pages/CategoriesListPage';
import ContactPage from './pages/ContactPage';
import ErrorBoundary from './components/ErrorBoundary';
import AboutPage from './pages/AboutPage';
import DeveloperDashboardPage from './pages/DeveloperDashboardPage';
import DeveloperSettingsPage from './pages/DeveloperSettingsPage';
import ServiceManagementPage from './pages/ServiceManagementPage';
import CustomerDashboardPage from './pages/CustomerDashboardPage';

const App: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [purchasedItems, setPurchasedItems] = useState<Service[]>([]);
  const [currentView, setCurrentView] = useState<{ page: string; params: any }>({ page: 'home', params: {} });
  const [toast, setToast] = useState<ToastState | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500); // Simulate loading
    return () => clearTimeout(timer);
  }, []);
  
  const handleNavigate = useCallback((page: string, params = {}) => {
    setCurrentView({ page, params });
    window.scrollTo(0, 0);
  }, []);
  
  const handleLoginSuccess = useCallback((mockSession: Session) => {
    setSession(mockSession);
    const isDeveloper = mockSession.user?.user_metadata?.user_type === 'developer';
    handleNavigate(isDeveloper ? 'developer-dashboard' : 'customer-dashboard');
    showToast('Successfully signed in!', 'success');
  }, [handleNavigate, showToast]);

  const handleLogout = useCallback(() => {
    setSession(null);
    handleNavigate('home');
    showToast('You have been signed out.', 'success');
  }, [handleNavigate, showToast]);


  // Handles navigation side-effect safely after render.
  useEffect(() => {
    if (session && currentView.page === 'auth') {
      const isDeveloper = session.user?.user_metadata?.user_type === 'developer';
      handleNavigate(isDeveloper ? 'developer-dashboard' : 'customer-dashboard');
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
    showToast(`'${service.title}' added to cart!`, 'success');
  }, [showToast]);
  
  const handleRemoveFromCart = useCallback((itemId: string) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === itemId);
      if (itemToRemove) {
        showToast(`'${itemToRemove.title}' removed from cart.`, 'success');
      }
      return prevItems.filter(item => item.id !== itemId);
    });
  }, [showToast]);

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

  const handlePurchase = useCallback(() => {
    setPurchasedItems(prev => {
        const purchasedIds = new Set(prev.map(item => item.id));
        const newItems = cartItems.filter(cartItem => !purchasedIds.has(cartItem.id));
        return [...prev, ...newItems];
    });
    setCartItems([]);
    showToast('Thank you for your purchase! Your items are in your dashboard.', 'success');
    handleNavigate('customer-dashboard');
  }, [cartItems, showToast, handleNavigate]);

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
                  showToast={showToast}
                />;
      case 'auth':
        return <AuthPage onNavigate={handleNavigate} initialForm={currentView.params.initialForm} showToast={showToast} onLoginSuccess={handleLoginSuccess} />;
      case 'search':
        return <SearchResultsPage query={currentView.params.query} onNavigate={handleNavigate} onAddToCart={handleAddToCart} />;
      case 'cart':
        return <CartPage 
                  cartItems={cartItems} 
                  onNavigate={handleNavigate} 
                  onRemoveFromCart={handleRemoveFromCart}
                  onUpdateQuantity={handleUpdateQuantity}
                  onPurchase={handlePurchase}
                />;
       case 'category':
        return <CategoryPage 
                  categoryName={currentView.params.categoryName} 
                  onNavigate={handleNavigate} 
                  onAddToCart={handleAddToCart}
                />;
       case 'categories-list':
        return <CategoriesListPage onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage
                  developerId={currentView.params.developerId}
                  developerName={currentView.params.developerName}
                  onNavigate={handleNavigate}
                  session={session}
                  showToast={showToast}
                />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      case 'customer-dashboard':
        return <CustomerDashboardPage
                  purchasedItems={purchasedItems}
                  onNavigate={handleNavigate}
                  showToast={showToast}
                />;
      case 'developer-dashboard':
        return <DeveloperDashboardPage onNavigate={handleNavigate} session={session} showToast={showToast} />;
      case 'developer-settings':
        return <DeveloperSettingsPage onNavigate={handleNavigate} session={session} showToast={showToast} />;
      case 'service-management':
        return <ServiceManagementPage 
                  onNavigate={handleNavigate} 
                  session={session} 
                  showToast={showToast}
                  serviceId={currentView.params.serviceId} 
                />;
      case 'home':
      default:
        return <HomePage onAddToCart={handleAddToCart} onNavigate={handleNavigate} />;
    }
  }
  
  const showHeaderFooter = currentView.page !== 'auth' && !loading;

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      {showHeaderFooter && <Header cartItemCount={cartItemCount} onNavigate={handleNavigate} session={session} onLogout={handleLogout} showToast={showToast} />}
      <main className="flex-grow pb-16 md:pb-0">
        <ErrorBoundary>
          {renderPage()}
        </ErrorBoundary>
      </main>
      {showHeaderFooter && <Footer onNavigate={handleNavigate} showToast={showToast} />}
      {showHeaderFooter && <ChatbotWidget showToast={showToast} />}
      {showHeaderFooter && <BottomNavBar onNavigate={handleNavigate} session={session} currentPage={currentView.page} showToast={showToast} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default App;