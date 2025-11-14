

import React from 'react';
import { ToastType } from '../types';

interface ChatbotWidgetProps {
  showToast: (message: string, type?: ToastType) => void;
}

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ showToast }) => {
  return (
    <button
      onClick={() => showToast('AI Chatbot feature is coming soon!', 'success')}
      className="fixed bottom-24 md:bottom-8 right-8 bg-primary text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transform hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      aria-label="Open AI Chat"
    >
      <svg xmlns="http://www.w.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    </button>
  );
};

export default ChatbotWidget;