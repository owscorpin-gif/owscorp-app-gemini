
import React from 'react';
import type { Testimonial } from '../types';

const testimonials: Testimonial[] = [
  { id: '1', name: 'Sarah Johnson', role: 'CEO, Innovate Inc.', avatarUrl: 'https://picsum.photos/seed/avatar1/100/100', quote: 'OWSCORP revolutionized how we acquire software. The AI consultant guided us to the perfect solution, saving us weeks of research.' },
  { id: '2', name: 'Michael Chen', role: 'Founder, TechStart', avatarUrl: 'https://picsum.photos/seed/avatar2/100/100', quote: 'The quality of developer tools available is unmatched. We found a SaaS template that accelerated our launch by three months.' },
  { id: '3', name: 'Emily Rodriguez', role: 'Freelance Designer', avatarUrl: 'https://picsum.photos/seed/avatar3/100/100', quote: 'As a developer, the platform is a dream. The upload process is seamless, and the analytics help me understand my customers better.' },
];

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
    <div className="bg-white p-8 rounded-lg shadow-lg">
        <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
        <div className="flex items-center">
            <img className="w-12 h-12 rounded-full object-cover mr-4" src={testimonial.avatarUrl} alt={testimonial.name} />
            <div>
                <p className="font-bold text-gray-900 font-heading">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
            </div>
        </div>
    </div>
);


const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 font-heading">Trusted by Businesses Worldwide</h2>
            <p className="mt-4 text-lg text-gray-600">See what our customers and developers are saying about OWSCORP.</p>
        </div>
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map(testimonial => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
