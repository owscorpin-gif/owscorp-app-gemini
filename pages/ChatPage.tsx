import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenerativeAI as GoogleGenAI, Chat } from "@google/generative-ai";
import type { ChatMessage } from '../types';

interface ChatPageProps {
  onNavigate: (page: string, params?: any) => void;
}

const ModelIcon = () => (
    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    </div>
);

const UserIcon = () => (
    <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    </div>
);

const ChatPage: React.FC<ChatPageProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const initializeChat = useCallback(async () => {
    try {
      if (!process.env.API_KEY) {
        setError("API_KEY is not configured. Please see the developer console for instructions.");
        console.error("Gemini API key is missing. Please set it in your environment variables.");
        return;
      }
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      chatRef.current = ai.chats.create({ 
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: "You are an expert consultant for a digital marketplace called OWSCORP. Your role is to be a friendly and helpful AI assistant. You will answer questions about services, pricing, and general inquiries related to the platform. Be concise and professional.",
          maxOutputTokens: 500,
        }
      });

      // Send initial greeting from the model
      setMessages([{ role: 'model', parts: [{ text: "Hello! I am the OWSCORP AI consultant. How can I help you find the perfect digital solution today?" }] }]);

    } catch (e: any) {
      setError("Failed to initialize the AI model. " + e.message);
      console.error(e);
    }
  }, []);

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading || !chatRef.current) return;
    
    const userMessage: ChatMessage = { role: 'user', parts: [{ text: userInput }] };
    setMessages(prev => [...prev, userMessage]);
    const messageToSend = userInput;
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: messageToSend });
      const modelResponseText = response.text;
      const modelMessage: ChatMessage = { role: 'model', parts: [{ text: modelResponseText }] };
      setMessages(prev => [...prev, modelMessage]);
    } catch (e: any) {
      setError("Sorry, I encountered an error. Please try again. " + e.message);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-secondary">
       <header className="bg-white shadow-md p-4 flex items-center">
         <button onClick={() => onNavigate('home')} className="text-gray-600 hover:text-primary">&larr; Back</button>
         <h1 className="text-xl font-bold text-gray-800 mx-auto">AI Assistant</h1>
       </header>
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'model' && <ModelIcon />}
              <div className={`max-w-lg p-4 rounded-2xl shadow ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'}`}>
                 <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>
              </div>
               {msg.role === 'user' && <UserIcon />}
            </div>
          ))}
          {isLoading && (
             <div className="flex items-start gap-4">
                <ModelIcon />
                <div className="max-w-lg p-4 rounded-2xl shadow bg-white text-gray-800 rounded-bl-none">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                    </div>
                </div>
            </div>
          )}
          {error && (
            <div className="bg-red-100 text-red-800 p-4 rounded-lg text-center">
                {error}
            </div>
          )}
           <div ref={messagesEndRef} />
        </div>
      </div>
      <footer className="bg-white p-4 border-t">
        <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex items-center gap-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask about AI agents, website templates..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading || error !== null}
          />
          <button
            type="submit"
            disabled={isLoading || !userInput.trim() || error !== null}
            className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 hover:bg-blue-900 disabled:bg-gray-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatPage;