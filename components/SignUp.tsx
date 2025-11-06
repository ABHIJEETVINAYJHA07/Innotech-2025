import React, { useState, useEffect } from 'react';
import { UserIcon, LockClosedIcon, DeviceMobileIcon, KeyIcon } from './Icons';
import { View, User } from '../types';
import Alert from './Alert';
import Logo from './Logo';

interface SignUpProps {
  onSignUpSuccess: (user: User) => void;
  onNavigate: (view: View) => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUpSuccess, onNavigate }) => {
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Fix: Replaced NodeJS.Timeout with inferred type from setInterval and improved useEffect structure.
  useEffect(() => {
    if (step === 'otp' && cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, cooldown]);


  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName || !username || !mobileNumber || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (mobileNumber.length < 10) {
        setError('Please enter a valid 10-digit mobile number.');
        return;
    }
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }
    
    setIsSubmitting(true);
    // Simulate checking if user exists and sending OTP
    setTimeout(() => {
        if(mobileNumber === '9876543210') {
            setError('This mobile number is already registered. Please sign in.');
            setIsSubmitting(false);
            return;
        }
        setIsSubmitting(false);
        setStep('otp');
        setCooldown(60); // Start 60-second cooldown
    }, 1000);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (otp !== '987654') { // Hardcoded OTP for demo purposes
        setError('The OTP entered is incorrect. Please check the code and try again.');
        return;
    }
    
    setIsSubmitting(true);
    // Simulate account creation
    setTimeout(() => {
        setIsSubmitting(false);
        onSignUpSuccess({ fullName, mobileNumber, username });
    }, 1000);
  };
  
  const handleResendOtp = () => {
    if (cooldown > 0) return;
    
    setIsResending(true);
    setError('');

    // Simulate resending OTP
    setTimeout(() => {
      setIsResending(false);
      setCooldown(60); // Restart cooldown
    }, 1000);
  };

  const renderDetailsForm = () => (
    <>
      <div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
            Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <button type="button" onClick={() => onNavigate('signin')} className="font-medium text-rose-600 hover:text-rose-500">
                Sign in here
            </button>
        </p>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleDetailsSubmit} noValidate>
        
        {error && <Alert type="error" message={error} />}

        <div className="rounded-md shadow-sm -space-y-px">
          {renderInput('fullName', 'Full Name', fullName, setFullName, 'text', 'name', true, <UserIcon />)}
          {renderInput('username', 'Username', username, setUsername, 'text', 'username', false, <UserIcon />)}
          {renderInput('mobileNumber', 'Mobile Number', mobileNumber, setMobileNumber, 'tel', 'tel', false, <DeviceMobileIcon />)}
          {renderInput('password', 'Password', password, setPassword, 'password', 'new-password', false, <LockClosedIcon />, true)}
        </div>
        
        <div>
            <button type="submit" disabled={isSubmitting} className="group relative flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-rose-500 to-orange-500 py-3 px-4 text-sm font-medium text-white hover:from-rose-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-stone-100 disabled:opacity-60">
                {isSubmitting ? 'Sending OTP...' : 'Get OTP'}
            </button>
        </div>
      </form>
    </>
  );

  const renderOtpForm = () => (
    <>
      <div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
            Verify your number
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
            Enter the 6-digit OTP sent to {mobileNumber}.
        </p>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleOtpSubmit} noValidate>
        {error && <Alert type="error" message={error} />}

        <div className="rounded-md shadow-sm">
          {renderInput('otp', '6-Digit OTP', otp, setOtp, 'text', 'one-time-code', true, <KeyIcon />, true)}
        </div>
        
        <div>
            <button type="submit" disabled={isSubmitting} className="group relative flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-rose-500 to-orange-500 py-3 px-4 text-sm font-medium text-white hover:from-rose-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-stone-100 disabled:opacity-60">
                {isSubmitting ? 'Verifying...' : 'Verify & Create Account'}
            </button>
        </div>
        <div className="text-sm text-center">
            <button 
              type="button" 
              onClick={handleResendOtp}
              disabled={cooldown > 0 || isResending}
              className="font-medium text-rose-600 hover:text-rose-500 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
                {isResending ? 'Sending...' : (cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP')}
            </button>
        </div>
         <div className="text-sm text-center">
            <button type="button" onClick={() => { setStep('details'); setError(''); }} className="font-medium text-rose-600 hover:text-rose-500">
                Change mobile number?
            </button>
        </div>
      </form>
    </>
  );

  const renderInput = (id: string, placeholder: string, value: string, setValue: (val: string) => void, type: string, autocomplete: string, isTop: boolean, icon: React.ReactElement<{ className?: string }>, isBottom: boolean = false) => {
      let roundedClass = '';
      if (isTop && !isBottom) roundedClass = 'rounded-t-md';
      else if (!isTop && isBottom) roundedClass = 'rounded-b-md';
      else if (!isTop && !isBottom) roundedClass = 'rounded-none';
      else roundedClass = 'rounded-md';
      
      return (
          <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  {React.cloneElement(icon, { className: 'h-5 w-5 text-gray-500' })}
              </span>
              <input
                  id={id}
                  name={id}
                  type={type}
                  autoComplete={autocomplete}
                  required
                  className={`relative block w-full appearance-none border border-slate-300 bg-white/50 px-3 py-3 pl-10 text-slate-900 placeholder-slate-500 focus:z-10 focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm ${roundedClass}`}
                  placeholder={placeholder}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
              />
          </div>
      );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md space-y-8 bg-white/60 backdrop-blur-lg p-8 rounded-2xl border border-black/10 shadow-2xl">
        <div className="flex justify-center items-center space-x-3">
          <Logo className="w-16 h-16"/>
        </div>
        
        {step === 'details' ? renderDetailsForm() : renderOtpForm()}
        
      </div>
    </div>
  );
};

export default SignUp;