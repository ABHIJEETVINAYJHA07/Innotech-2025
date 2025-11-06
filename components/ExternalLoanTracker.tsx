import React, { useState, useEffect, useCallback } from 'react';
import { ExternalLoan, View } from '../types';
import { ArrowLeftIcon, ScaleIcon, CalculatorIcon, BanknotesIcon } from './Icons';

interface ExternalLoanTrackerProps {
  externalLoans: ExternalLoan[];
  onAddLoan: (loan: Omit<ExternalLoan, 'id'>) => void;
  onNavigate: (view: View) => void;
}

const formatRupees = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(value);

const ExternalLoanTracker: React.FC<ExternalLoanTrackerProps> = ({ externalLoans, onAddLoan, onNavigate }) => {
  // State for the tracking form
  const [lenderName, setLenderName] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [showForm, setShowForm] = useState(false);

  // State for the calculator
  const [calcAmount, setCalcAmount] = useState(100000); // Default to 1 Lakh
  const [calcRate, setCalcRate] = useState(7); // Default to 7%
  const [calcTerm, setCalcTerm] = useState(24); // Default to 24 months
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalRepayment, setTotalRepayment] = useState(0);
  
  const calculateLoan = useCallback(() => {
    const principal = calcAmount;
    const monthlyRate = calcRate / 100 / 12;
    const numberOfPayments = calcTerm;

    if (principal > 0 && monthlyRate > 0 && numberOfPayments > 0) {
        const monthly = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        const total = monthly * numberOfPayments;
        const interest = total - principal;
        
        setMonthlyPayment(monthly);
        setTotalInterest(interest);
        setTotalRepayment(total);
    } else {
        setMonthlyPayment(0);
        setTotalInterest(0);
        setTotalRepayment(0);
    }
  }, [calcAmount, calcRate, calcTerm]);
    
  useEffect(() => {
    calculateLoan();
  }, [calculateLoan]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lenderName || !loanAmount || !interestRate || !loanTerm || !startDate) {
      alert("Please fill out all fields.");
      return;
    }
    onAddLoan({
      lenderName,
      loanAmount: parseFloat(loanAmount),
      interestRate: parseFloat(interestRate),
      loanTerm: parseInt(loanTerm),
      startDate,
    });
    // Reset form
    setLenderName('');
    setLoanAmount('');
    setInterestRate('');
    setLoanTerm('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setShowForm(false);
  };

  const calculateEndDate = (start: string, term: number) => {
    const date = new Date(start);
    date.setMonth(date.getMonth() + term);
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-slate-900">External Loan Tracker</h2>
         <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-200/50 rounded-md hover:bg-slate-300/50 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Dashboard</span>
        </button>
      </div>
      
      {/* Repayment Calculator Section */}
      <div className="bg-white/60 backdrop-blur-lg border border-black/10 p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <CalculatorIcon className="w-6 h-6 mr-2 text-purple-600" />
          Repayment Calculator
        </h3>
        <div className="space-y-4">
            <div>
                <label htmlFor="calcAmount" className="block text-sm font-medium text-slate-600">Loan Amount: {formatRupees(calcAmount)}</label>
                <input type="range" id="calcAmount" min="10000" max="50000000" step="10000" value={calcAmount} onChange={e => setCalcAmount(Number(e.target.value))} className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-purple-600" />
            </div>
            <div>
                <label htmlFor="calcRate" className="block text-sm font-medium text-slate-600">Annual Interest Rate: {calcRate.toFixed(1)}%</label>
                <input type="range" id="calcRate" min="5" max="25" step="0.1" value={calcRate} onChange={e => setCalcRate(Number(e.target.value))} className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-purple-600" />
            </div>
             <div>
                <label htmlFor="calcTerm" className="block text-sm font-medium text-slate-600">Loan Term: {calcTerm} months</label>
                <input type="range" id="calcTerm" min="6" max="72" step="1" value={calcTerm} onChange={e => setCalcTerm(Number(e.target.value))} className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-purple-600" />
            </div>
        </div>
        <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center text-base bg-slate-200/50 p-3 rounded-lg">
                <span className="flex items-center font-medium text-slate-600"><BanknotesIcon className="w-5 h-5 mr-2 text-purple-600" />Est. Monthly Payment</span>
                <span className="font-bold text-lg text-slate-900">{formatRupees(monthlyPayment)}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-200/50 p-4 rounded-lg text-center border border-slate-300">
                  <p className="text-sm font-medium text-amber-600">Total Interest Paid</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">{formatRupees(totalInterest)}</p>
                </div>
                <div className="bg-slate-200/50 p-4 rounded-lg text-center border border-slate-300">
                  <p className="text-sm font-medium text-green-600">Total Repayment Amount</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">{formatRupees(totalRepayment)}</p>
                </div>
            </div>
        </div>
      </div>


      <div className="bg-white/60 backdrop-blur-lg border border-black/10 p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800">My Tracked Loans</h3>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-rose-500 rounded-md hover:from-purple-600 hover:to-rose-600 transition-all"
            >
              {showForm ? 'Cancel' : '+ Add Loan'}
            </button>
        </div>

        {showForm && (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4 border-t border-slate-200 pt-6">
                 <div>
                    <label htmlFor="lenderName" className="block text-sm font-medium text-slate-600">Lender's Name</label>
                    <input type="text" id="lenderName" value={lenderName} onChange={e => setLenderName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-slate-100/50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-slate-800" placeholder="e.g., Local Bank, Friend's Name" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="loanAmount" className="block text-sm font-medium text-slate-600">Loan Amount (₹)</label>
                        <input type="number" id="loanAmount" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-slate-100/50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-slate-800" placeholder="e.g., 25000" />
                    </div>
                    <div>
                        <label htmlFor="interestRate" className="block text-sm font-medium text-slate-600">Annual Interest Rate (%)</label>
                        <input type="number" step="0.1" id="interestRate" value={interestRate} onChange={e => setInterestRate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-slate-100/50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-slate-800" placeholder="e.g., 12.5" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="loanTerm" className="block text-sm font-medium text-slate-600">Loan Term (Months)</label>
                        <input type="number" id="loanTerm" value={loanTerm} onChange={e => setLoanTerm(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-slate-100/50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-slate-800" placeholder="e.g., 24" />
                    </div>
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-slate-600">Start Date</label>
                        <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-slate-100/50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-slate-800" />
                    </div>
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-rose-500 text-white font-bold py-2 px-4 rounded-lg shadow-sm hover:from-purple-600 hover:to-rose-600 transition-all">Save Loan</button>
            </form>
        )}
      </div>

      {externalLoans.length === 0 && !showForm ? (
        <div className="text-center bg-white/60 backdrop-blur-lg border border-black/10 p-8 rounded-2xl shadow-lg">
            <ScaleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4"/>
            <h3 className="text-xl font-semibold text-slate-800">No External Loans Tracked</h3>
            <p className="text-slate-500 mt-2">Use the '+ Add Loan' button to start tracking your loans from other sources.</p>
        </div>
      ) : externalLoans.length > 0 ? (
        <div className="space-y-4">
          {externalLoans.map(loan => (
            <div key={loan.id} className="bg-white/60 backdrop-blur-lg border border-black/10 p-4 rounded-2xl shadow-lg">
              <h4 className="font-bold text-slate-800">{loan.lenderName}</h4>
              <div className="mt-2 pt-2 border-t border-slate-200 text-sm text-slate-600 space-y-2">
                <div className="flex justify-between"><span>Amount:</span> <span className="font-semibold text-slate-800">{formatRupees(loan.loanAmount)}</span></div>
                <div className="flex justify-between"><span>Interest Rate:</span> <span className="font-semibold text-slate-800">{loan.interestRate}%</span></div>
                <div className="flex justify-between"><span>Term:</span> <span className="font-semibold text-slate-800">{loan.loanTerm} months</span></div>
                <div className="flex justify-between"><span>End Date:</span> <span className="font-semibold text-slate-800">{calculateEndDate(loan.startDate, loan.loanTerm)}</span></div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ExternalLoanTracker;