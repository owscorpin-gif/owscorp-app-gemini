import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedServices from '../components/FeaturedServices';
import Categories from '../components/Categories';
import Testimonials from '../components/Testimonials';
import type { Service } from '../types';

interface HomePageProps {
  onAddToCart: (service: Service) => void;
  onNavigate: (page: string, params?: any) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onAddToCart, onNavigate }) => {
  return (
    <div>
      <HeroSection onNavigate={onNavigate} />
      <Categories onNavigate={onNavigate} />
      <FeaturedServices onAddToCart={onAddToCart} onNavigate={onNavigate} />
      <Testimonials />
    </div>
  );
};

export default HomePage;