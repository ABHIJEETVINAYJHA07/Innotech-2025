import React from 'react';
import { LoanApplicationData } from '../types';
import { XIcon, InformationCircleIcon, BanknotesIcon, CalendarIcon, CashIcon, ReceiptPercentIcon, IdentificationIcon, HomeIcon, UserCircleIcon, OfficeBuildingIcon, HashtagIcon } from './Icons';
import StatusBadge from './StatusBadge';

interface LoanDetailModalProps {
  loan: LoanApplicationData;
  onClose: () => void;
}

const formatRupees = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(value);

const DetailRow: React.FC<{ label: string; value: string | React.ReactNode; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="flex items-start justify-between py-3 border-b border-slate-200 last:border-b-0">
        <div className="flex items-center space-x-3 text-slate-600">
            {icon}
            <span className="font-medium">{label}</span>
        </div>
        <div className="text-right font-semibold text-slate-800 max-w-[60%] break-words">
            {value}
        </div>
    </div>
);

const LoanDetailModal: React.FC<LoanDetailModalProps> = ({ loan, onClose }) => {
  const getRepaymentSchedule = () => {
    if (loan.status !== 'Approved' || !loan.loanTerm) return [];

    const principal = loan.loanAmount;
    const monthlyRate = (loan.interestRate || 0) / 100 / 12;
    const numberOfPayments = loan.loanTerm;
    
    if (principal <= 0 || monthlyRate <= 0) return [];
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    let balance = principal;
    const schedule = [];

    for (let i = 1; i <= numberOfPayments; i++) {
        const interestPaid = balance * monthlyRate;
        const principalPaid = monthlyPayment - interestPaid;
        balance -= principalPaid;
        schedule.push({
            month: i,
            payment: monthlyPayment,
            principal: principalPaid,
            interest: interestPaid,
            balance: balance > 0 ? balance : 0
        });
    }
    return schedule;
  };
  
  const repaymentSchedule = getRepaymentSchedule();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-40 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
        <div 
            className="bg-white/80 backdrop-blur-xl border border-black/10 rounded-2xl shadow-2xl w-full max-w-lg mx-auto transform transition-all duration-300 max-h-[90vh] flex flex-col" 
            onClick={(e) => e.stopPropagation()}
        >
            <div className="sticky top-0 bg-white/70 p-4 border-b border-slate-200 flex justify-between items-center z-10 flex-shrink-0">
                <h3 className="text-xl font-bold text-slate-900">Loan Application Details</h3>
                <button onClick={onClose} className="text-slate-500 p-2 rounded-full hover:bg-slate-200/50 transition-colors" aria-label="Close details">
                    <XIcon className="w-6 h-6" />
                </button>
            </div>
            
            <div className="overflow-y-auto p-6 space-y-6">
                {/* Application Summary */}
                <div className="bg-slate-200/50 p-4 rounded-lg">
                    <h4 className="font-bold text-slate-900 text-lg mb-2">{loan.businessName}</h4>
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-slate-600">
                            <p>Applicant: <span className="font-semibold text-slate-800">{loan.fullName}</span></p>
                            <p>Applied on: <span className="font-semibold text-slate-800">{new Date(loan.applicationDate).toLocaleDateString()}</span></p>
                        </div>
                        <StatusBadge status={loan.status} />
                    </div>
                </div>

                 {/* Personal Details */}
                <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Applicant Information</h4>
                    <DetailRow label="Address" value={<span className="whitespace-pre-wrap">{loan.address}</span>} icon={<HomeIcon className="w-5 h-5 text-slate-500" />} />
                    <DetailRow label="ID Type Submitted" value={loan.governmentIdType} icon={<IdentificationIcon className="w-5 h-5 text-slate-500" />} />
                </div>


                {/* Financial Details */}
                <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Financial Overview</h4>
                    <DetailRow label="Applied Under" value={loan.scheme} icon={<InformationCircleIcon className="w-5 h-5 text-indigo-500" />} />
                    <DetailRow label="Amount Requested" value={formatRupees(loan.loanAmount)} icon={<BanknotesIcon className="w-5 h-5 text-green-500" />} />
                    {loan.status === 'Approved' && (
                        <>
                            <DetailRow label="Current Balance" value={formatRupees(loan.loanBalance || 0)} icon={<CashIcon className="w-5 h-5 text-blue-500" />} />
                            <DetailRow label="Interest Rate (APR)" value={`${loan.interestRate}%`} icon={<ReceiptPercentIcon className="w-5 h-5 text-yellow-500" />} />
                            <DetailRow label="Loan Term" value={`${loan.loanTerm} months`} icon={<CalendarIcon className="w-5 h-5 text-purple-500" />} />
                        </>
                    )}
                </div>

                {/* Bank Details */}
                {loan.bankName && (
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Bank Details</h4>
                     <DetailRow label="Account Holder" value={loan.accountHolderName} icon={<UserCircleIcon className="w-5 h-5 text-slate-500" />} />
                    <DetailRow label="Bank Name" value={loan.bankName} icon={<OfficeBuildingIcon className="w-5 h-5 text-slate-500" />} />
                    <DetailRow label="Account Number" value={loan.accountNumber} icon={<HashtagIcon className="w-5 h-5 text-slate-500" />} />
                    <DetailRow label="IFSC Code" value={loan.ifscCode} icon={<HashtagIcon className="w-5 h-5 text-slate-500" />} />
                  </div>
                )}


                {/* Business Plan */}
                <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Purpose of Loan</h4>
                    <div className="bg-slate-100 p-4 rounded-lg text-slate-600 text-sm italic border-l-4 border-slate-400">
                        "{loan.loanPurpose}"
                    </div>
                </div>

                {/* Repayment Schedule */}
                {repaymentSchedule.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-slate-800 mb-2">Repayment Schedule</h4>
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left text-slate-600">
                                <thead className="text-xs text-slate-600 uppercase bg-slate-200/50">
                                    <tr>
                                        <th scope="col" className="px-4 py-2">Month</th>
                                        <th scope="col" className="px-4 py-2 text-right">Payment</th>
                                        <th scope="col" className="px-4 py-2 text-right">Principal</th>
                                        <th scope="col" className="px-4 py-2 text-right">Interest</th>
                                        <th scope="col" className="px-4 py-2 text-right">Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {repaymentSchedule.map(row => (
                                        <tr key={row.month} className="bg-white/50 border-b border-slate-200 last:border-b-0">
                                            <td className="px-4 py-2 font-medium">{row.month}</td>
                                            <td className="px-4 py-2 text-right">{formatRupees(row.payment)}</td>
                                            <td className="px-4 py-2 text-right text-green-600">{formatRupees(row.principal)}</td>
                                            <td className="px-4 py-2 text-right text-red-600">{formatRupees(row.interest)}</td>
                                            <td className="px-4 py-2 text-right font-semibold text-slate-800">{formatRupees(row.balance)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default LoanDetailModal;