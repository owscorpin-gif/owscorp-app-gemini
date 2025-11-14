export interface CategorySale {
  developerId: string;
  category: string;
  revenue: number;
}

export const categorySalesData: CategorySale[] = [
  // Data for AI Genix
  { developerId: 'ai-genix', category: 'Agentic AI', revenue: 10480 },
  { developerId: 'ai-genix', category: 'Web Application', revenue: 4500 },
  { developerId: 'ai-genix', category: 'Mobile App', revenue: 2500 },
  
  // Data for DevCraft
  { developerId: 'dev-craft', category: 'Web Application', revenue: 8900 },
  { developerId: 'dev-craft', category: 'Desktop Software', revenue: 3200 },
  
  // Data for PixelPerfect
  { developerId: 'pixel-perfect', category: 'Desktop Software', revenue: 7500 },

  // Data for FitLife Apps
  { developerId: 'fitlife-apps', category: 'Mobile App', revenue: 12500 },
];
