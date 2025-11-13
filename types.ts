export interface Service {
  id: string;
  title: string;
  category: string;
  developer: string;
  developerId: string;
  developerVerified: boolean;
  rating: number;
  price: number;
  imageUrl: string;
  description: string;
}

export interface CartItem extends Service {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  quote: string;
}

export interface Review {
  id: string;
  developerId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
}

export type ToastType = 'success' | 'error';

export interface ToastState {
  message: string;
  type: ToastType;
}
