import React from 'react';
import { LoanApplicationData, View, User, Language } from '../types';
import { DocumentAddIcon, LightBulbIcon, CollectionIcon, BuildingLibraryIcon, ScaleIcon, QuestionMarkCircleIcon } from './Icons';
import StatusBadge from './StatusBadge';
import { t } from '../utils/localization';

type TranslationKey = 'apply_for_loan' | 'explore_schemes' | 'financial_wisdom' | 'loan_history' | 'track_external_loans' | 'how_it_works';

interface DashboardProps {
  loanApplication: LoanApplicationData | null;
  onNavigate: (view: View | 'tutorial') => void;
  isGuest: boolean;
  currentUser: User | null;
  language: Language;
}

const dashboardItems: {
    key: TranslationKey,
    descriptionKey: `${TranslationKey}_desc`,
    icon: React.ReactElement,
    view: View | 'tutorial',
    color: string,
}[] = [
    {
        key: "apply_for_loan",
        descriptionKey: "apply_for_loan_desc",
        icon: <DocumentAddIcon className="w-8 h-8" />,
        view: 'apply',
        color: "text-green-600",
    },
    {
        key: "explore_schemes",
        descriptionKey: "explore_schemes_desc",
        icon: <BuildingLibraryIcon className="w-8 h-8" />,
        view: 'schemes',
        color: "text-indigo-600",
    },
    {
        key: "financial_wisdom",
        descriptionKey: "financial_wisdom_desc",
        icon: <LightBulbIcon className="w-8 h-8" />,
        view: 'literacy',
        color: "text-sky-600",
    },
    {
        key: "loan_history",
        descriptionKey: "loan_history_desc",
        icon: <CollectionIcon className="w-8 h-8" />,
        view: 'history',
        color: "text-purple-600",
    },
    {
        key: "track_external_loans",
        descriptionKey: "track_external_loans_desc",
        icon: <ScaleIcon className="w-8 h-8" />,
        view: 'externalTracker',
        color: "text-pink-600",
    },
    {
        key: "how_it_works",
        descriptionKey: "how_it_works_desc",
        icon: <QuestionMarkCircleIcon className="w-8 h-8" />,
        view: 'tutorial',
        color: "text-slate-600",
    }
];

const Dashboard: React.FC<DashboardProps> = ({ loanApplication, onNavigate, isGuest, currentUser, language }) => {
  const welcomeMessage = isGuest 
    ? t('welcome_guest', language) 
    : currentUser 
    ? t('welcome_user', language, { username: currentUser.fullName.split(' ')[0] })
    : "Welcome back!";

  return (
    <div className="space-y-8 animate-fade-in">
      
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-400 py-2">{welcomeMessage}</h2>
        <p className="text-slate-500 mt-1">{t('what_to_do', language)}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {dashboardItems.map((item, index) => (
          <button 
            key={item.key}
            onClick={() => onNavigate(item.view)}
            className="animate-grid-item-in bg-white/50 backdrop-blur-lg p-4 sm:p-6 rounded-2xl shadow-lg border border-black/10 text-center flex flex-col items-center justify-center space-y-3 transition-all duration-300 hover:border-rose-500/50 hover:shadow-rose-500/10 hover:-translate-y-1"
            style={{ animationDelay: `${index * 75}ms` }}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-black/5 ${item.color}`}>
              {item.icon}
            </div>
            <div>
              <h3 className={`font-bold text-slate-800`}>{t(item.key, language)}</h3>
              <p className="text-xs text-slate-500 hidden sm:block">{t(item.descriptionKey, language)}</p>
            </div>
          </button>
        ))}
      </div>

      {loanApplication && !isGuest && (
        <div className="bg-white/50 backdrop-blur-lg border border-black/10 p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">Most Recent Application</h3>
            <div className="flex justify-center">
                <StatusBadge status={loanApplication.status} />
            </div>
            {loanApplication.status === 'Pending' && <p className="text-center text-sm text-slate-500 mt-4">Your application is being reviewed. We will notify you of the decision soon.</p>}
            {loanApplication.status === 'Rejected' && <p className="text-center text-sm text-slate-500 mt-4">We're sorry, but your application could not be approved at this time.</p>}
        </div>
      )}

    </div>
  );
};

export default Dashboard;