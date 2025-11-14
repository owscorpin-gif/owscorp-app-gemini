

import React from 'react';
import type { Category } from '../types';

const WebIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9m-9 9a9 9 0 00-9-9" /></svg>;
const MobileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
const DesktopIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const AIIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;


const categories: Category[] = [
    { id: '1', name: 'Web Application', icon: <WebIcon/>, description: 'Templates and complete solutions for the web.' },
    { id: '2', name: 'Mobile App', icon: <MobileIcon />, description: 'Fully functional apps for iOS and Android.' },
    { id: '3', name: 'Desktop Software', icon: <DesktopIcon/>, description: 'Powerful software for Mac, Windows, and Linux.' },
    { id: '4', name: 'Agentic AI', icon: <AIIcon/>, description: 'Intelligent agents to automate any task.' },
];

interface CategoryCardProps {
  category: Category;
  onNavigate: (page: string, params?: any) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onNavigate }) => (
    <div
        onClick={() => onNavigate('category', { categoryName: category.name })}
        className="group relative p-8 bg-white rounded-lg shadow-md hover:shadow-2xl hover:bg-primary transition-all duration-300 ease-in-out cursor-pointer"
    >
        <div className="text-primary group-hover:text-white transition-colors duration-300 mb-4">
            {category.icon}
        </div>
        <h3 className="text-xl font-bold font-heading text-gray-900 group-hover:text-white transition-colors duration-300">{category.name}</h3>
        <p className="mt-2 text-gray-500 group-hover:text-gray-200 transition-colors duration-300">{category.description}</p>
         <span className="absolute top-4 right-4 text-gray-300 group-hover:text-white group-hover:rotate-45 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
        </span>
    </div>
);

interface CategoriesProps {
  onNavigate: (page: string, params?: any) => void;
}

const Categories: React.FC<CategoriesProps> = ({ onNavigate }) => {
  return (
    <section id="categories-section" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 font-heading">Explore by Category</h2>
            <p className="mt-4 text-lg text-gray-600">Find the perfect solution tailored to your platform needs.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map(category => (
                <CategoryCard key={category.id} category={category} onNavigate={onNavigate} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;