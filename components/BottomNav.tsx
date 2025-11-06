import React from 'react';
import { View } from '../types';
import { HomeIcon, DocumentAddIcon, LightBulbIcon, UserIcon } from './Icons';

interface BottomNavProps {
  currentView: View;
  onNavigate: (view: View) => void;
  isGuest: boolean;
}

const NavButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const activeClasses = 'text-rose-600';
  const inactiveClasses = 'text-slate-500 hover:text-slate-900';
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
    >
      {icon}
      <span className="text-xs font-medium tracking-wide">{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate, isGuest }) => {
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-sm z-20 bg-white/70 backdrop-blur-lg border border-black/10 rounded-2xl shadow-lg">
      <div className="flex h-16">
        <NavButton
          label="Dashboard"
          icon={<HomeIcon className="w-6 h-6 mb-1" />}
          isActive={currentView === 'dashboard'}
          onClick={() => onNavigate('dashboard')}
        />
        <NavButton
          label="Apply"
          icon={<DocumentAddIcon className="w-6 h-6 mb-1" />}
          isActive={currentView === 'apply'}
          onClick={() => onNavigate('apply')}
        />
        <NavButton
          label="Learn"
          icon={<LightBulbIcon className="w-6 h-6 mb-1" />}
          isActive={currentView === 'literacy'}
          onClick={() => onNavigate('literacy')}
        />
        {!isGuest && (
          <NavButton
            label="Profile"
            icon={<UserIcon className="w-6 h-6 mb-1" />}
            isActive={currentView === 'profile'}
            onClick={() => onNavigate('profile')}
          />
        )}
      </div>
    </nav>
  );
};

export default BottomNav;