import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedServices from '../components/FeaturedServices';
import Categories from '../components/Categories';
import Testimonials from '../components/Testimonials';
import type { Service, ToastType } from '../types';

interface HomePageProps {
  onAddToCart: (service: Service) => void;
  onNavigate: (page: string, params?: any) => void;
  showToast: (message: string, type?: ToastType) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onAddToCart, onNavigate, showToast }) => {
  return (
    <div>
      <HeroSection onNavigate={onNavigate} />
      <Categories onNavigate={onNavigate} />
      <FeaturedServices onAddToCart={onAddToCart} onNavigate={onNavigate} showToast={showToast} />
      <Testimonials />
    </div>
  );
};

export default HomePage;