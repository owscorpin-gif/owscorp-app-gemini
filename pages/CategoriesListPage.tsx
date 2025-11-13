import React from 'react';
import Categories from '../components/Categories';

interface CategoriesListPageProps {
  onNavigate: (page: string, params?: any) => void;
}

const CategoriesListPage: React.FC<CategoriesListPageProps> = ({ onNavigate }) => {
  return <Categories onNavigate={onNavigate} />;
};

export default CategoriesListPage;
