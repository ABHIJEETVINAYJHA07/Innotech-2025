import React, { useState } from 'react';
import { UserIcon, LockClosedIcon } from './Icons';
import { View } from '../types';
import Alert from './Alert';
import Logo from './Logo';

interface SignInProps {
  onSignInSuccess: (credential: string) => void;
  onNavigate: (view: View) => void;
  onGuestSignIn: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignInSuccess, onNavigate, onGuestSignIn }) => {
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!credential || !password) {
        setError('Please enter your credentials and password.');
        return;
    }

    // Validation for email or mobile
    const isNumeric = /^\d{10}$/.test(credential); // Check for 10-digit mobile number
    const containsAt = credential.includes('@');

    if (!isNumeric && !containsAt) {
        setError('Please enter a valid 10-digit mobile number or an email address containing "@".');
        return;
    }
    
    setIsSubmitting(true);

    // Simulate API call and potential error
    setTimeout(() => {
        if (password === 'fail') {
            setError('Invalid credentials. Please check your details and try again.');
            setIsSubmitting(false);
            return;
        }
        setIsSubmitting(false);
        onSignInSuccess(credential);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12 animate-fade-in">
        <div className="w-full max-w-md space-y-8 bg-white/60 backdrop-blur-lg p-8 rounded-2xl border border-black/10 shadow-2xl">
            <div>
                <div className="flex flex-col justify-center items-center space-y-3">
                    <Logo className="w-16 h-16"/>
                    <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
                        Sign in to UDHAAR SETU
                    </h2>
                </div>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
                <div className="rounded-md shadow-sm -space-y-px">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <UserIcon className="h-5 w-5 text-gray-500" />
                        </span>
                        <input
                            id="credential"
                            name="credential"
                            type="text"
                            autoComplete="username"
                            required
                            className="relative block w-full appearance-none rounded-t-md border-slate-300 bg-white/50 px-3 py-3 pl-10 text-slate-900 placeholder-slate-500 focus:z-10 focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
                            placeholder="Registered Email or Mobile"
                            value={credential}
                            onChange={(e) => setCredential(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <LockClosedIcon className="h-5 w-5 text-gray-500" />
                        </span>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="relative block w-full appearance-none rounded-b-md border-slate-300 bg-white/50 px-3 py-3 pl-10 text-slate-900 placeholder-slate-500 focus:z-10 focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                {error && <Alert type="error" message={error} />}
                
                <div className="text-sm text-right">
                    <a href="#" className="font-medium text-rose-600 hover:text-rose-500">
                        Forgot password?
                    </a>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-rose-500 to-orange-500 py-3 px-4 text-sm font-medium text-white hover:from-rose-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-stone-100 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                    >
                        {isSubmitting ? 'Signing In...' : 'Sign In'}
                    </button>
                     <button
                        type="button"
                        onClick={onGuestSignIn}
                        className="mt-4 group relative flex w-full justify-center rounded-md border border-slate-300 bg-slate-200/50 py-3 px-4 text-sm font-medium text-slate-700 hover:bg-slate-300/50 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-stone-100 transition-all"
                    >
                        Continue as Guest
                    </button>
                </div>
                 <div className="text-center text-sm text-slate-500">
                     Don't have an account?{' '}
                     <button type="button" onClick={() => onNavigate('signup')} className="font-medium text-rose-600 hover:text-rose-500">
                        Sign up now
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default SignIn;