import type { ReactNode } from 'react';

export interface Service {
  id: string;
  title: string;
  category: string;
  developer: string;
  developer_id: string; // Standardized to snake_case for DB consistency
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
  icon: ReactNode;
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
  developer_id: string;
  user_id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Profile {
    id: string;
    updated_at?: string;
    full_name?: string;
    company_name?: string;
    mobile_no?: string;
    address?: string;
    pan_no?: string;
    aadhar_no?: string;
    qualification?: string;
    description?: string;
}

export interface Message {
    id?: string;
    created_at?: string;
    sender_email: string;
    content: string;
    recipient_developer_id?: string;
    sender_user_id?: string;
}

export type ToastType = 'success' | 'error';

export interface ToastState {
  message: string;
  type: ToastType;
}