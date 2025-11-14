export interface Sale {
  developerId: string;
  date: string; // e.g., 'Jan', 'Feb'
  revenue: number;
}

export const salesData: Sale[] = [
  { developerId: 'ai-genix', date: 'Jan', revenue: 2400 },
  { developerId: 'ai-genix', date: 'Feb', revenue: 1398 },
  { developerId: 'ai-genix', date: 'Mar', revenue: 9800 },
  { developerId: 'ai-genix', date: 'Apr', revenue: 3908 },
  { developerId: 'ai-genix', date: 'May', revenue: 4800 },
  { developerId: 'ai-genix', date: 'Jun', revenue: 3800 },
  { developerId: 'ai-genix', date: 'Jul', revenue: 4300 },
  { developerId: 'dev-craft', date: 'Jan', revenue: 1200 },
  { developerId: 'dev-craft', date: 'Feb', revenue: 3400 },
  { developerId: 'dev-craft', date: 'Mar', revenue: 2100 },
  { developerId: 'dev-craft', date: 'Apr', revenue: 5300 },
  { developerId: 'dev-craft', date: 'May', revenue: 2900 },
  { developerId: 'dev-craft', date: 'Jun', revenue: 4100 },
  { developerId: 'dev-craft', date: 'Jul', revenue: 3800 },
];
