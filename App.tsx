import React, { useState, useEffect, useCallback } from 'react';
import { LoanApplicationData, View, User, Scheme, Language, ExternalLoan } from './types';

// Component Imports
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import LoanApplication from './components/LoanApplication';
import FinancialLiteracy from './components/FinancialLiteracy';
import LoanHistory from './components/LoanHistory';
import LoanDetailModal from './components/LoanDetailModal';
import TutorialModal from './components/TutorialModal';
import Profile from './components/Profile';
import GovernmentSchemes from './components/GovernmentSchemes';
import ExternalLoanTracker from './components/ExternalLoanTracker';
import DhanMitraModal from './components/DhanMitra';
import { SparklesIcon } from './components/Icons';


// Mock Data
const MOCK_SCHEMES: Scheme[] = [
  {
    id: 's1',
    name: 'UDHAAR SETU QuickLoan',
    description: 'A quick and easy loan for your immediate business needs, with flexible repayment options.',
    interestRate: 7,
    maxLoanAmount: 50000,
    type: 'internal',
    link: '#',
  },
  {
    id: 's2',
    name: 'Pradhan Mantri MUDRA Yojana (PMMY)',
    description: 'A flagship scheme to provide loans up to ₹10 lakh to non-corporate, non-farm small/micro enterprises.',
    interestRate: 9.75,
    maxLoanAmount: 1000000,
    type: 'government',
    link: 'https://www.mudra.org.in/',
  },
   {
    id: 's3',
    name: 'Stand-Up India Scheme',
    description: 'Facilitates bank loans between ₹10 lakh and ₹1 Crore to at least one Scheduled Caste (SC) or Scheduled Tribe (ST) borrower and at least one woman borrower per bank branch for setting up a greenfield enterprise.',
    interestRate: 8.5,
    maxLoanAmount: 10000000,
    type: 'government',
    link: 'https://www.standupmitra.in/',
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('signin');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loanApplications, setLoanApplications] = useState<LoanApplicationData[]>([]);
  const [externalLoans, setExternalLoans] = useState<ExternalLoan[]>([]);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [notification, setNotification] = useState<string | null>(null);
  const [isDhanMitraOpen, setIsDhanMitraOpen] = useState(false);


  useEffect(() => {
    // This effect can be used for notifications for signed-in users in the future
    // For now, it won't trigger as there are no mock loans with payment dates.
    if (isAuthenticated && !isGuest) {
      const approvedLoan = loanApplications.find(app => app.status === 'Approved' && app.nextPaymentDate);
      if (approvedLoan) {
        const nextPaymentDate = new Date(approvedLoan.nextPaymentDate!).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });
        setNotification(`Your next payment of ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(2200)} is due on ${nextPaymentDate}.`);
      }
    }
  }, [isAuthenticated, isGuest, loanApplications]);

  const handleNavigate = (view: View | 'tutorial') => {
    if (view === 'tutorial') {
      setShowTutorial(true);
    } else {
      setCurrentView(view);
    }
  };

  const handleSignInSuccess = (credential: string) => {
    setIsAuthenticated(true);
    setIsGuest(false);
    // Create a user on-the-fly since there's no backend.
    const isEmail = credential.includes('@');
    setCurrentUser({
      username: isEmail ? credential.split('@')[0] : credential,
      fullName: isEmail ? credential.split('@')[0] : `User ${credential.slice(-4)}`,
      mobileNumber: isEmail ? '9876543210' : credential, // Dummy number for email login
      email: isEmail ? credential : undefined,
    });
    setLoanApplications([]); // User starts with no loan history
    setCurrentView('dashboard');
  };
  
  const handleGuestSignIn = () => {
    setIsAuthenticated(false);
    setIsGuest(true);
    setCurrentUser(null);
    setLoanApplications([]);
    setCurrentView('dashboard');
  };
  
  const handleSignOut = () => {
    setIsAuthenticated(false);
    setIsGuest(false);
    setCurrentUser(null);
    setCurrentView('signin');
    setNotification(null);
  };
  
  const handleSignUpSuccess = (user: User) => {
    setIsAuthenticated(true);
    setIsGuest(false);
    setCurrentUser(user);
    setLoanApplications([]);
    setCurrentView('dashboard');
  };

  const handleLoanSubmit = (data: Omit<LoanApplicationData, 'id' | 'status' | 'applicationDate'>) => {
    const newApplication: LoanApplicationData = {
      ...data,
      id: `app${loanApplications.length + 3}`,
      status: 'Pending',
      applicationDate: new Date().toISOString(),
    };
    setLoanApplications(prev => [...prev, newApplication]);
  };
  
  const handleAddExternalLoan = (loan: Omit<ExternalLoan, 'id'>) => {
    const newLoan: ExternalLoan = {
      ...loan,
      id: `ext${externalLoans.length + 1}`
    };
    setExternalLoans(prev => [...prev, newLoan]);
  }

  const handleUpdateProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    // Here you would typically make an API call to save the user data
    console.log("Profile updated:", updatedUser);
  };


  const selectedLoan = loanApplications.find(app => app.id === selectedLoanId);
  const mostRecentApplication = loanApplications.length > 0 ? [...loanApplications].sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime())[0] : null;

  const renderContent = () => {
    switch (currentView) {
      case 'signin':
        return <SignIn onSignInSuccess={handleSignInSuccess} onNavigate={handleNavigate} onGuestSignIn={handleGuestSignIn} />;
      case 'signup':
        return <SignUp onSignUpSuccess={handleSignUpSuccess} onNavigate={handleNavigate} />;
      case 'dashboard':
        return <Dashboard loanApplication={mostRecentApplication} onNavigate={handleNavigate} isGuest={isGuest} currentUser={currentUser} language={language} />;
      case 'apply':
        return <LoanApplication onSubmit={handleLoanSubmit} onSuccess={() => handleNavigate('history')} schemes={MOCK_SCHEMES} currentUser={currentUser} onNavigate={handleNavigate} />;
      case 'literacy':
        return <FinancialLiteracy />;
      case 'history':
        return <LoanHistory applications={loanApplications} onNavigate={handleNavigate} onSelectLoan={setSelectedLoanId} />;
      case 'profile':
        return <Profile user={currentUser} onNavigate={handleNavigate} onSignOut={handleSignOut} onUpdateProfile={handleUpdateProfile} />;
      case 'schemes':
        return <GovernmentSchemes schemes={MOCK_SCHEMES} onNavigate={handleNavigate} />;
      case 'externalTracker':
        return <ExternalLoanTracker externalLoans={externalLoans} onAddLoan={handleAddExternalLoan} onNavigate={handleNavigate} />;
      default:
        return <Dashboard loanApplication={mostRecentApplication} onNavigate={handleNavigate} isGuest={isGuest} currentUser={currentUser} language={language} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {(currentView !== 'signin' && currentView !== 'signup') && (
        <Header 
          title="UDHAAR SETU" 
          isGuest={isGuest} 
          isAuthenticated={isAuthenticated} 
          onNavigate={handleNavigate}
          language={language}
          onLanguageChange={setLanguage}
          notification={notification}
          onDismissNotification={() => setNotification(null)}
        />
      )}
      
      <main className="flex-grow container mx-auto p-4 md:p-6 pt-24 pb-28">
        {renderContent()}
      </main>

      {(currentView !== 'signin' && currentView !== 'signup') && (
        <>
          <BottomNav currentView={currentView} onNavigate={handleNavigate} isGuest={isGuest} />
          <button
            onClick={() => setIsDhanMitraOpen(true)}
            className="fixed bottom-24 right-4 z-30 w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
            aria-label="Ask DhanMitra AI"
          >
            <SparklesIcon className="w-8 h-8"/>
          </button>
        </>
      )}
      
      {selectedLoan && (
        <LoanDetailModal loan={selectedLoan} onClose={() => setSelectedLoanId(null)} />
      )}
      
      {showTutorial && (
        <TutorialModal onClose={() => setShowTutorial(false)} />
      )}

      {isDhanMitraOpen && (
        <DhanMitraModal onClose={() => setIsDhanMitraOpen(false)} />
      )}
    </div>
  );
};

export default App;