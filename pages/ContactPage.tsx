import React, { useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { ToastType } from '../types';
import { supabase } from '../supabaseClient';

interface ContactPageProps {
  developerId?: string;
  developerName?: string;
  onNavigate: (page: string, params?: any) => void;
  session: Session | null;
  showToast: (message: string, type: ToastType) => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ developerId, developerName, onNavigate, session, showToast }) => {
  const [email, setEmail] = useState(session?.user?.email || '');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const isSupportInquiry = !developerName;
  const targetName = developerName || 'OWSCORP Support';


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !email.trim()) {
      showToast('Please fill in both your email and a message.', 'error');
      return;
    }
    setIsSending(true);
    
    const { error } = await supabase.from('messages').insert({
        sender_email: email,
        content: message,
        recipient_developer_id: developerId, // Can be null for general support
        sender_user_id: session?.user?.id,
    });

    setIsSending(false);

    if (error) {
        showToast(`Error: ${error.message}`, 'error');
    } else {
        setIsSent(true);
    }
  };

  const handleGoBack = () => {
     if (developerId && developerName) {
      onNavigate('developer', { developer_id: developerId, developerName });
    } else {
      onNavigate('home');
    }
  };

  return (
    <div className="bg-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <h1 className="text-4xl font-extrabold font-heading text-gray-900 text-center mb-4">
          Contact <span className="text-primary">{targetName}</span>
        </h1>
        <p className="text-lg text-gray-600 text-center mb-12">
          {isSupportInquiry 
            ? 'Have a question about our platform or policies? Let us know.'
            : 'Have a question or need a custom quote? Send a message directly to the developer.'
          }
        </p>

        {isSent ? (
          <div className="text-center bg-green-50 border border-green-200 text-green-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
            <p className="mb-6">{targetName} will get back to you shortly at {email}.</p>
            <button
              onClick={handleGoBack}
              className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-900"
            >
              &larr; Back to {isSupportInquiry ? 'Home' : 'Profile'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-secondary p-8 rounded-lg shadow-md space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
                Your Message
              </label>
              <textarea
                id="message"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={`Ask about customizations, support, or anything else...`}
              />
            </div>
            <div className="flex flex-col sm:flex-row-reverse items-center gap-4">
              <button
                type="submit"
                disabled={isSending}
                className="w-full sm:w-auto bg-accent text-white font-bold py-3 px-8 rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center disabled:opacity-70"
              >
                {isSending ? 'Sending...' : 'Send Message'}
              </button>
              <button
                type="button"
                onClick={handleGoBack}
                className="w-full sm:w-auto text-gray-600 font-medium hover:text-primary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactPage;