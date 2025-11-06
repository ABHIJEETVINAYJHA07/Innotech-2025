import React from 'react';
import { ExclamationTriangleIcon } from './Icons';

interface AlertProps {
  type: 'error' | 'success' | 'warning';
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  }
}

const alertConfig = {
  error: {
    bg: 'bg-red-100',
    border: 'border-red-500',
    text: 'text-red-800',
    icon: <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
  },
  success: {
    bg: 'bg-green-100',
    border: 'border-green-500',
    text: 'text-green-800',
    icon: <div />
  },
  warning: {
    bg: 'bg-yellow-100',
    border: 'border-yellow-500',
    text: 'text-yellow-800',
    icon: <div />
  }
};

const Alert: React.FC<AlertProps> = ({ type, message, action }) => {
  const config = alertConfig[type];

  return (
    <div className={`${config.bg} border-l-4 ${config.border} ${config.text} p-4 rounded-md`} role="alert">
      <div className="flex">
        <div className="py-1 flex-shrink-0">
            {config.icon}
        </div>
        <div className="ml-3">
          <p className="text-sm font-semibold">{message}</p>
          {action && (
            <div className="mt-2 text-sm">
                <button 
                    onClick={action.onClick} 
                    className={`font-medium ${config.text} hover:opacity-80 underline`}
                >
                    {action.label}
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alert;