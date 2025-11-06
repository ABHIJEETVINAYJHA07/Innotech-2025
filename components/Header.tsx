import React, { useState } from 'react';
import { LoginIcon, GlobeAltIcon, BellIcon, XIcon } from './Icons';
import { View, Language } from '../types';
import Logo from './Logo';

interface HeaderProps {
  title: string;
  isGuest: boolean;
  isAuthenticated: boolean;
  onNavigate: (view: View) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  notification: string | null;
  onDismissNotification: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, isGuest, isAuthenticated, onNavigate, language, onLanguageChange, notification, onDismissNotification }) => {
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-stone-100/50 backdrop-blur-lg border-b border-black/10">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Logo className="w-8 h-8"/>
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        </div>
        <div className="flex items-center space-x-4">
          {isGuest && !isAuthenticated && (
            <button
              onClick={() => onNavigate('signin')}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm font-semibold bg-black/5 border border-black/10 text-slate-700 hover:bg-black/10 rounded-lg transition-colors"
            >
              <LoginIcon className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}

          {/* Language Switcher */}
          <div className="relative">
            <button 
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              onBlur={() => setTimeout(() => setIsLangDropdownOpen(false), 150)}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm font-semibold bg-black/5 border border-black/10 text-slate-700 hover:bg-black/10 rounded-lg transition-colors"
            >
              <GlobeAltIcon className="w-5 h-5" />
              <span>{language === 'en' ? 'EN' : 'HI'}</span>
            </button>
            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white/80 backdrop-blur-lg border border-black/10 rounded-md shadow-lg py-1 z-20 animate-fade-in-fast">
                <button 
                  onClick={() => { onLanguageChange('en'); setIsLangDropdownOpen(false); }}
                  className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-rose-500/10"
                >
                  English
                </button>
                <button 
                  onClick={() => { onLanguageChange('hi'); setIsLangDropdownOpen(false); }}
                  className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-rose-500/10"
                >
                  हिन्दी (Hindi)
                </button>
              </div>
            )}
          </div>

          {/* Notification Button */}
          {!isGuest && isAuthenticated && (
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                onBlur={() => setTimeout(() => setIsNotificationOpen(false), 150)}
                className="relative p-2 text-slate-700 bg-black/5 rounded-full hover:bg-black/10 transition-colors"
                aria-label="Notifications"
              >
                <BellIcon className="w-5 h-5" />
                {notification && (
                  <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-stone-100"></span>
                )}
              </button>

              {isNotificationOpen && notification && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white/80 backdrop-blur-lg border border-black/10 rounded-md shadow-lg z-20 animate-fade-in-fast">
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        <BellIcon className="w-6 h-6 text-rose-500" />
                      </div>
                      <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900">Payment Reminder</p>
                        <p className="mt-1 text-sm text-slate-600">{notification}</p>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); 
                            onDismissNotification();
                            setIsNotificationOpen(false);
                          }}
                          className="bg-transparent rounded-md inline-flex text-slate-500 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-rose-500"
                        >
                          <span className="sr-only">Close</span>
                          <XIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;