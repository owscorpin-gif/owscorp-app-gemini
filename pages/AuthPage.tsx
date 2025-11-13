import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import type { Provider } from '@supabase/supabase-js';
import type { ToastType } from '../types';

interface AuthPageProps {
  onNavigate: (page: string, params?: any) => void;
  initialForm?: 'login' | 'signup';
  showToast: (message: string, type: ToastType) => void;
}

const SpinnerIcon: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


const AuthPage: React.FC<AuthPageProps> = ({ onNavigate, initialForm = 'login', showToast }) => {
  const [formType, setFormType] = useState<'login' | 'signup' | 'reset'>(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<'customer' | 'developer'>('customer');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const handleToggleFormType = (type: 'login' | 'signup') => {
    setFormType(type);
  };

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (formType === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: userType,
          },
        },
      });
      if (error) showToast(error.message, 'error');
      else showToast('Registration successful! Please check your email to confirm your account.', 'success');
    } else if (formType === 'login') {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) showToast(error.message, 'error');
      else onNavigate('home');
    } else if (formType === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin,
        });
        if (error) showToast(error.message, 'error');
        else showToast('Password reset link has been sent to your email.', 'success');
    }
    setLoading(false);
  };

  const handleOAuthLogin = async (provider: Provider) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
      showToast(error.message, 'error');
      setLoading(false);
    }
  };

  const SocialButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} disabled={loading} className="flex items-center justify-center w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50">
      {icon}
      <span className="ml-3 font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex bg-secondary">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex w-1/2 bg-primary p-12 flex-col justify-between text-white relative">
        <div>
          <h1 className="text-4xl font-bold font-heading cursor-pointer" onClick={() => onNavigate('home')}>OWSCORP</h1>
          <p className="mt-2 text-blue-200">Online Web Solution & Corporation</p>
        </div>
        <div className="max-w-md">
          <h2 className="text-4xl font-bold leading-tight">Welcome to the Future of Digital Solutions.</h2>
          <p className="mt-4 text-lg text-blue-100 opacity-80">
            Join a thriving marketplace of innovators and entrepreneurs. Whether you're buying or selling, you're in the right place.
          </p>
        </div>
        <div className="text-sm text-blue-200">&copy; 2025 OWSCORP. All Rights Reserved.</div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md animate-slide-in-from-right">
          <div className="text-right lg:hidden mb-4">
             <h1 className="text-2xl font-bold font-heading text-primary cursor-pointer" onClick={() => onNavigate('home')}>OWSCORP</h1>
          </div>
          
          {formType === 'reset' ? (
             <div>
                <h2 className="text-3xl font-bold font-heading text-gray-900 mb-2">Reset Password</h2>
                <p className="text-gray-600 mb-6">Enter your email to receive a password reset link.</p>
                <form onSubmit={handleAuthAction}>
                    <div className="mb-4">
                        <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="email-reset">Email Address</label>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" id="email-reset" type="email" placeholder="you@example.com" required />
                    </div>
                    <button disabled={loading} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-900 transition-colors flex items-center justify-center disabled:opacity-50" type="submit">
                        {loading && <SpinnerIcon />}
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                    <button type="button" onClick={() => setFormType('login')} className="w-full mt-4 text-center text-sm font-medium text-primary hover:underline">
                        Back to Sign In
                    </button>
                </form>
            </div>
          ) : (
            <>
            <div className="flex border border-gray-300 rounded-lg p-1 mb-8 bg-gray-200">
                <button
                onClick={() => handleToggleFormType('login')}
                className={`w-1/2 py-2 rounded-md font-bold transition-colors ${formType === 'login' ? 'bg-white text-primary shadow' : 'bg-transparent text-gray-500'}`}
                >
                Sign In
                </button>
                <button
                onClick={() => handleToggleFormType('signup')}
                className={`w-1/2 py-2 rounded-md font-bold transition-colors ${formType === 'signup' ? 'bg-white text-primary shadow' : 'bg-transparent text-gray-500'}`}
                >
                Sign Up
                </button>
            </div>
            
            <div>
                <h2 className="text-3xl font-bold font-heading text-gray-900 mb-2">{formType === 'login' ? 'Welcome Back!' : 'Create Your Account'}</h2>
                <p className="text-gray-600 mb-6">{formType === 'login' ? 'Sign in to continue to your dashboard.' : 'Get started with the best digital marketplace.'}</p>
                <form onSubmit={handleAuthAction}>
                {formType === 'signup' && (
                    <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="full-name">Full Name</label>
                    <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" id="full-name" type="text" placeholder="John Doe" required />
                    </div>
                )}
                <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="email">Email Address</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" id="email" type="email" placeholder="you@example.com" required />
                </div>
                <div className="mb-4">
                    <div className="flex justify-between items-center">
                        <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="password">Password</label>
                        {formType === 'login' && <button type="button" onClick={() => setFormType('reset')} className="text-sm font-medium text-primary hover:underline">Forgot?</button>}
                    </div>
                    <div className="relative">
                        <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-500">
                        {showPassword ? 
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg> :
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074L3.707 2.293zM10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /><path d="M2 10s.54-1.241 1.5-2.5C4.54 6.241 7.025 5 10 5c.65 0 1.28.084 1.886.238l-8.24 8.24A.997.997 0 012 10z" /></svg>
                        }
                        </button>
                    </div>
                </div>
                {formType === 'signup' && (
                    <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-3">I am a...</label>
                    <div className="flex gap-4">
                        <label className={`flex-1 p-4 border rounded-lg cursor-pointer transition-all ${userType === 'customer' ? 'border-primary bg-blue-50 ring-2 ring-primary' : 'border-gray-300'}`}>
                        <input type="radio" name="userType" value="customer" checked={userType === 'customer'} onChange={() => setUserType('customer')} className="hidden" />
                        <span className="font-bold text-gray-800">Customer</span>
                        <p className="text-sm text-gray-500">Looking to buy solutions.</p>
                        </label>
                        <label className={`flex-1 p-4 border rounded-lg cursor-pointer transition-all ${userType === 'developer' ? 'border-primary bg-blue-50 ring-2 ring-primary' : 'border-gray-300'}`}>
                        <input type="radio" name="userType" value="developer" checked={userType === 'developer'} onChange={() => setUserType('developer')} className="hidden" />
                        <span className="font-bold text-gray-800">Developer</span>
                        <p className="text-sm text-gray-500">Looking to sell solutions.</p>
                        </label>
                    </div>
                    </div>
                )}
                <button disabled={loading} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-900 transition-colors flex items-center justify-center disabled:opacity-50" type="submit">
                    {loading && <SpinnerIcon />}
                    {loading ? 'Processing...' : (formType === 'login' ? 'Sign In' : 'Create Account')}
                </button>
                </form>
                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-4 text-sm font-medium text-gray-500">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <SocialButton
                        onClick={() => handleOAuthLogin('google')}
                        icon={<svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /></svg>}
                        label="Continue with Google"
                    />
                    <SocialButton
                        onClick={() => handleOAuthLogin('github')}
                        icon={<svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>}
                        label="Continue with GitHub"
                    />
                </div>
            </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
