import React from 'react';
import { LoanApplicationData, View } from '../types';
import StatusBadge from './StatusBadge';
import { ArrowLeftIcon, CollectionIcon } from './Icons';

interface LoanHistoryProps {
  applications: LoanApplicationData[];
  onNavigate: (view: View) => void;
  onSelectLoan: (id: string) => void;
}

const LoanHistory: React.FC<LoanHistoryProps> = ({ applications, onNavigate, onSelectLoan }) => {
  const reversedApplications = [...applications].reverse();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-slate-900">Loan History</h2>
         <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-200/50 rounded-md hover:bg-slate-300/50 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Dashboard</span>
        </button>
      </div>

      {reversedApplications.length === 0 ? (
        <div className="text-center bg-white/60 backdrop-blur-lg border border-black/10 p-8 rounded-2xl shadow-lg">
            <CollectionIcon className="w-12 h-12 mx-auto text-slate-500 mb-4"/>
            <h3 className="text-xl font-semibold text-slate-800">No Applications Yet</h3>
            <p className="text-slate-500 mt-2">Your loan application history will appear here once you apply.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reversedApplications.map((app) => (
            <button 
              key={app.id} 
              onClick={() => onSelectLoan(app.id)}
              className="w-full text-left bg-white/60 backdrop-blur-lg p-4 rounded-2xl shadow-lg border border-black/10 hover:shadow-xl hover:border-rose-500/50 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50 transition-all duration-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-800">{app.businessName}</h3>
                  <p className="text-sm text-slate-500">
                    Applied on {new Date(app.applicationDate).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">Amount Requested</span>
                <span className="font-bold text-lg text-rose-600">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(app.loanAmount)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LoanHistory;