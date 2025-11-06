import React from 'react';
import { ClockIcon, CheckCircleIcon, ExclamationCircleIcon, BanIcon } from './Icons';

interface StatusBadgeProps {
    status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const baseClasses = "px-3 py-1 text-sm font-semibold rounded-full inline-flex items-center space-x-2";
  switch (status) {
    case 'Approved':
      return <div className={`${baseClasses} bg-green-100 text-green-800`}><CheckCircleIcon className="w-4 h-4"/><span>Approved</span></div>;
    case 'Pending':
      return <div className={`${baseClasses} bg-yellow-100 text-yellow-800`}><ClockIcon className="w-4 h-4"/><span>Pending Review</span></div>;
    case 'Rejected':
      return <div className={`${baseClasses} bg-red-100 text-red-800`}><BanIcon className="w-4 h-4"/><span>Rejected</span></div>;
    default:
      return <div className={`${baseClasses} bg-slate-200 text-slate-700`}><ExclamationCircleIcon className="w-4 h-4"/><span>Not Applied</span></div>;
  }
};

export default StatusBadge;