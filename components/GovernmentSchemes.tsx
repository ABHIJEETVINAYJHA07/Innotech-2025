import React from 'react';
import { Scheme, View } from '../types';
import { ArrowLeftIcon, ArrowRightIcon } from './Icons';

interface GovernmentSchemesProps {
  schemes: Scheme[];
  onNavigate: (view: View) => void;
}

const formatRupees = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(value);

const GovernmentSchemes: React.FC<GovernmentSchemesProps> = ({ schemes, onNavigate }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-slate-900">Government Schemes</h2>
         <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-200/50 rounded-md hover:bg-slate-300/50 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Dashboard</span>
        </button>
      </div>

      <p className="text-slate-500 text-center">Explore these government-backed schemes designed to support entrepreneurs and small businesses in India.</p>

      <div className="space-y-4">
        {schemes.filter(s => s.type === 'government').map((scheme) => (
          <div key={scheme.id} className="bg-white/60 backdrop-blur-lg border border-black/10 p-5 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-indigo-600">{scheme.name}</h3>
            <p className="text-slate-600 my-2">{scheme.description}</p>
            <div className="flex flex-wrap gap-4 text-sm my-4">
                <div className="bg-green-100 text-green-800 font-medium px-3 py-1 rounded-full">
                    Max Loan: {formatRupees(scheme.maxLoanAmount)}
                </div>
                <div className="bg-yellow-100 text-yellow-800 font-medium px-3 py-1 rounded-full">
                    Interest Rate: ~{scheme.interestRate}% p.a.
                </div>
            </div>
            <a 
              href={scheme.link}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-2 px-4 rounded-lg shadow-sm hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
            >
              <span>Learn More & Apply</span>
              <ArrowRightIcon className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GovernmentSchemes;