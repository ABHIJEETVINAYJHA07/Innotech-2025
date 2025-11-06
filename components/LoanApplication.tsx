import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LoanApplicationData, Scheme, User, View } from '../types';
import { CheckCircleIcon, ExclamationCircleIcon, ChevronDownIcon, CloudUploadIcon, DocumentTextIcon, ArrowRightIcon, BuildingLibraryIcon, BanknotesIcon } from './Icons';
import Alert from './Alert';

interface LoanApplicationProps {
  onSubmit: (data: Omit<LoanApplicationData, 'id' | 'status' | 'applicationDate'>) => void;
  onSuccess: () => void;
  schemes: Scheme[];
  currentUser: User | null;
  onNavigate: (view: View | 'tutorial') => void;
}

interface ValidationErrors {
  fullName?: string;
  businessName?: string;
  address?: string;
  governmentIdType?: string;
  governmentIdProof?: string;
  loanAmount?: string;
  loanPurpose?: string;
  otherPurpose?: string;
  scheme?: string;
  accountHolderName?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  bankProof?: string;
}

// Consistent currency formatter
const formatRupees = (value: number | string) => {
    const numberValue = typeof value === 'string' ? parseInt(value.replace(/[^0-9]/g, ''), 10) : value;
    if (isNaN(numberValue)) return '';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(numberValue);
};

// Helper components moved outside of the main component to prevent re-rendering issues
const FormRow: React.FC<{children: React.ReactNode}> = ({children}) => <div className="mb-6">{children}</div>;
const Label: React.FC<{htmlFor: string; children: React.ReactNode}> = ({htmlFor, children}) => <label htmlFor={htmlFor} className="block text-slate-600 text-sm font-bold mb-2">{children}</label>;
const ErrorMessage: React.FC<{children: React.ReactNode}> = ({children}) => <p className="text-red-600 text-xs italic mt-2">{children}</p>;
const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
    <div className="w-full bg-slate-300 rounded-full h-2.5 mb-8">
        <div className="bg-gradient-to-r from-rose-500 to-orange-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
    </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    hasError?: boolean;
}
const Input: React.FC<InputProps> = (props) => {
  const baseClasses = "shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-slate-900 leading-tight focus:outline-none focus:ring-2 transition duration-300 bg-white/50";
  const errorClasses = "border-red-500 focus:ring-red-500 pr-10";
  const neutralClasses = "border-slate-300 focus:ring-rose-500 focus:border-transparent";

  return (
    <div className="relative">
      <input 
        {...props} 
        className={`${baseClasses} ${props.hasError ? errorClasses : neutralClasses}`} 
      />
      {props.hasError && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
        </div>
      )}
    </div>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    hasError?: boolean;
}
const TextArea: React.FC<TextAreaProps> = (props) => {
    const baseClasses = "shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-slate-900 leading-tight focus:outline-none focus:ring-2 transition duration-300 h-24 resize-none bg-white/50";
    const errorClasses = "border-red-500 focus:ring-red-500";
    const neutralClasses = "border-slate-300 focus:ring-rose-500 focus:border-transparent";

    return (
        <textarea
            {...props}
            className={`${baseClasses} ${props.hasError ? errorClasses : neutralClasses}`}
        />
    );
};

const governmentIdTypes = [
    "Aadhar Card",
    "PAN Card",
    "Voter ID Card",
    "Driving License",
    "Passport"
];
const loanPurposes = [
  "Working Capital",
  "Purchase Equipment",
  "Inventory Purchase",
  "Business Expansion",
  "Marketing and Sales",
  "Other"
];

const LoanApplication: React.FC<LoanApplicationProps> = ({ onSubmit, onSuccess, schemes, currentUser, onNavigate }) => {
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [governmentIdType, setGovernmentIdType] = useState('');
  const [governmentIdProof, setGovernmentIdProof] = useState<File | null>(null);
  const [loanAmount, setLoanAmount] = useState(10000);
  const [loanTerm, setLoanTerm] = useState(12);
  const [loanPurpose, setLoanPurpose] = useState('');
  const [otherPurpose, setOtherPurpose] = useState('');
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(schemes[0]?.id || '');

  // Bank Details State
  const [accountHolderName, setAccountHolderName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankProof, setBankProof] = useState<File | null>(null);


  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [formShake, setFormShake] = useState(false);
  
  const selectedScheme = schemes.find(s => s.id === selectedSchemeId);
  const isGovernmentScheme = selectedScheme?.type === 'government';
  
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalRepayment, setTotalRepayment] = useState(0);

  const internalSchemes = schemes.filter(s => s.type === 'internal');
  const governmentSchemes = schemes.filter(s => s.type === 'government');

  useEffect(() => {
    if (currentUser?.address) {
      setAddress(currentUser.address);
    }
  }, [currentUser]);

  const calculateLoan = useCallback(() => {
    if (!selectedScheme) return;
    
    const principal = loanAmount;
    const monthlyRate = selectedScheme.interestRate / 100 / 12;
    const numberOfPayments = loanTerm;

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
  }, [loanAmount, loanTerm, selectedScheme]);
    
  useEffect(() => {
    calculateLoan();
  }, [calculateLoan]);

  useEffect(() => {
    if (selectedScheme && loanAmount > selectedScheme.maxLoanAmount && !isGovernmentScheme) {
      // For internal schemes, cap the loan amount to the scheme's max when the scheme changes.
      setLoanAmount(selectedScheme.maxLoanAmount);
    }
    // NOTE: `loanAmount` is deliberately omitted from the dependency array.
    // This effect should only run when the scheme changes, to avoid resetting the slider value while the user is actively changing it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSchemeId]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'id' | 'bank') => {
    const newErrors = { ...errors };
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        const errorKey = fileType === 'id' ? 'governmentIdProof' : 'bankProof';
        const setFile = fileType === 'id' ? setGovernmentIdProof : setBankProof;

        if (!allowedTypes.includes(file.type)) {
            newErrors[errorKey] = 'Invalid file type. Please upload a PDF, JPG, or PNG.';
            setFile(null);
        } else if (file.size > maxSize) {
            newErrors[errorKey] = 'File is too large. Maximum size is 5MB.';
            setFile(null);
        } else {
            delete newErrors[errorKey];
            setFile(file);
        }
    } else {
        const errorKey = fileType === 'id' ? 'governmentIdProof' : 'bankProof';
        const setFile = fileType === 'id' ? setGovernmentIdProof : setBankProof;
        newErrors[errorKey] = `${fileType === 'id' ? 'ID' : 'Bank'} proof is required.`;
        setFile(null);
    }
    setErrors(newErrors);
  };

  const validateField = useCallback((name: string, value: any): string | undefined => {
      if (isGovernmentScheme) return undefined;

      switch (name) {
          case 'fullName': return !value.trim() ? "Full name is required." : undefined;
          case 'businessName': return !value.trim() ? "Business name is required." : undefined;
          case 'address': return !value.trim() ? "Address is required." : undefined;
          case 'governmentIdType': return !value.trim() ? "Please select an ID type." : undefined;
          case 'governmentIdProof': return !value ? "ID proof is required." : undefined;
          case 'accountHolderName': return !value.trim() ? "Account holder's name is required." : undefined;
          case 'bankName': return !value.trim() ? "Bank name is required." : undefined;
          case 'accountNumber': return !/^\d{9,18}$/.test(value) ? "Enter a valid account number (9-18 digits)." : undefined;
          case 'ifscCode': return !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value) ? "Enter a valid IFSC code (e.g., SBIN0123456)." : undefined;
          case 'bankProof': return !value ? "Bank proof is required." : undefined;
          case 'loanAmount':
              const amount = Number(value);
              if (!value) return "Loan amount is required.";
              if (isNaN(amount) || amount <= 0) return "Please enter a valid positive number.";
              if (selectedScheme && amount > selectedScheme.maxLoanAmount) return `Amount cannot exceed ${formatRupees(selectedScheme.maxLoanAmount)} for this scheme.`;
              return undefined;
          case 'loanPurpose': return !value.trim() ? "Please select a purpose for the loan." : undefined;
          case 'otherPurpose': return loanPurpose === 'Other' && !value.trim() ? "Please specify the purpose." : undefined;
          case 'scheme': return !value.trim() ? "Please select a loan scheme." : undefined;
          default: return undefined;
      }
  }, [isGovernmentScheme, loanPurpose, selectedScheme]);

  // Single source of truth for which fields are required.
  const requiredFields = useMemo(() => {
    const baseFields = [
      'fullName', 'businessName', 'address', 'governmentIdType',
      'governmentIdProof', 'loanAmount', 'loanPurpose', 'scheme',
      'accountHolderName', 'bankName', 'accountNumber', 'ifscCode', 'bankProof'
    ];
    if (loanPurpose === 'Other') {
        return [...baseFields, 'otherPurpose'];
    }
    return baseFields;
  }, [loanPurpose]);
  
  const formData = useMemo(() => ({
    fullName, businessName, address, governmentIdType, governmentIdProof,
    loanAmount: loanAmount.toString(), loanPurpose, otherPurpose, scheme: selectedSchemeId,
    accountHolderName, bankName, accountNumber, ifscCode, bankProof
  }), [
    fullName, businessName, address, governmentIdType, governmentIdProof, loanAmount,
    loanPurpose, otherPurpose, selectedSchemeId, accountHolderName, bankName,
    accountNumber, ifscCode, bankProof
  ]);

  useEffect(() => {
    if (isGovernmentScheme) {
      setProgress(100);
      return;
    }

    const validFieldsCount = requiredFields.reduce((count, fieldName) => {
      const value = formData[fieldName as keyof typeof formData];
      const isValid = validateField(fieldName, value) === undefined;
      return isValid ? count + 1 : count;
    }, 0);

    const totalFields = requiredFields.length;

    if (totalFields > 0) {
      setProgress(Math.round((validFieldsCount / totalFields) * 100));
    } else {
      setProgress(0);
    }
  }, [formData, isGovernmentScheme, requiredFields, validateField]);

  const validateForm = useCallback((): boolean => {
    if (isGovernmentScheme) return true;

    const newErrors: ValidationErrors = {};

    for (const fieldName of requiredFields) {
        const value = formData[fieldName as keyof typeof formData];
        const error = validateField(fieldName, value);
        if (error) {
            newErrors[fieldName as keyof ValidationErrors] = error;
        }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [isGovernmentScheme, requiredFields, formData, validateField]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);
    if (!validateForm() || !selectedScheme) {
      setFormShake(true);
      setTimeout(() => setFormShake(false), 600);
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
        // Simulate a potential failure. To test, enter "fail" in the business name.
        if (businessName.toLowerCase().includes('fail')) {
            setSubmissionError("We couldn't process your application at this time. Please check your details or try again later.");
            setIsSubmitting(false);
            return;
        }
        
        const finalPurpose = loanPurpose === 'Other' ? `Other: ${otherPurpose}` : loanPurpose;
        onSubmit({
          fullName,
          businessName,
          address,
          governmentIdType,
          governmentIdProof: governmentIdProof!.name,
          loanAmount,
          loanTerm,
          loanPurpose: finalPurpose,
          interestRate: selectedScheme.interestRate,
          scheme: selectedScheme.name,
          accountHolderName,
          bankName,
          accountNumber,
          ifscCode,
          bankProof: bankProof!.name,
        });
        
        setIsSuccess(true);
        
        setTimeout(() => {
          onSuccess();
        }, 3000);

    }, 1500);
  };
  
  if (isSuccess) {
    return (
      <div className="text-center p-8 bg-white/60 backdrop-blur-lg border border-black/10 rounded-2xl shadow-2xl animate-fade-in">
        <CheckCircleIcon className="w-16 h-16 mx-auto text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900">Application Submitted!</h2>
        <p className="text-slate-600 mt-2">
          Your application has been received. We will notify you of the decision soon.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-8 animate-fade-in ${formShake ? 'form-shake' : ''}`}>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">Loan Application</h2>
        <p className="text-slate-500 mt-1">Fill in the details below to apply for your micro-loan.</p>
      </div>
      
      {!isGovernmentScheme && <ProgressBar progress={progress} />}

      <form onSubmit={handleSubmit} noValidate>
        {/* Scheme Selector */}
        <div className="bg-white/60 backdrop-blur-lg border border-black/10 rounded-2xl p-6 mb-8">
            <FormRow>
              <Label htmlFor="scheme">Select Loan Type</Label>
              <div className="relative">
                  <select 
                      id="scheme" 
                      value={selectedSchemeId} 
                      onChange={e => setSelectedSchemeId(e.target.value)}
                      className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-slate-900 leading-tight focus:outline-none focus:ring-2 focus:ring-rose-500 border-slate-300 bg-white/50"
                  >
                      <optgroup label="Direct Loan">
                        {internalSchemes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </optgroup>
                      <optgroup label="Government Schemes">
                        {governmentSchemes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </optgroup>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                      <ChevronDownIcon className="w-5 h-5" />
                  </div>
              </div>
              {errors.scheme && <ErrorMessage>{errors.scheme}</ErrorMessage>}
            </FormRow>
        </div>


        {/* Loan Estimator */}
        <div className="bg-white/60 backdrop-blur-lg border border-black/10 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Loan Estimator</h3>
          <FormRow>
            <Label htmlFor="loanAmountSlider">Loan Amount: {formatRupees(loanAmount)}</Label>
            <input
              id="loanAmountSlider"
              type="range"
              min="5000"
              max="50000000"
              step="10000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </FormRow>
          <FormRow>
            <Label htmlFor="loanTermSlider">Loan Term: {loanTerm} months</Label>
            <input
              id="loanTermSlider"
              type="range"
              min="6"
              max="60"
              step="1"
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </FormRow>
          {selectedScheme && (
            <div className="mt-4 space-y-4">
              <div className="flex justify-between items-center text-base bg-slate-200/50 p-3 rounded-lg">
                <span className="flex items-center font-medium text-slate-600"><BanknotesIcon className="w-5 h-5 mr-2 text-rose-500" />Est. Monthly Payment</span>
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
              <div className="text-center text-xs text-slate-500 pt-2">
                Calculated at an annual interest rate of <span className="font-bold">{selectedScheme.interestRate.toFixed(1)}%</span>.
              </div>
            </div>
          )}
        </div>

        {isGovernmentScheme ? (
            <div className="bg-white/60 backdrop-blur-lg border-2 border-dashed border-indigo-500 rounded-2xl text-center p-6">
                <BuildingLibraryIcon className="w-12 h-12 mx-auto text-indigo-500 mb-4" />
                <h3 className="text-xl font-bold text-indigo-800">Proceed to Government Portal</h3>
                <p className="text-slate-600 my-3">You have selected the <strong>{selectedScheme.name}</strong>. To apply for this scheme, you must register on their official government website.</p>
                <a 
                    href={selectedScheme.link}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center space-x-2 w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-sm hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
                >
                    <span>Register on Official Portal</span>
                    <ArrowRightIcon className="w-4 h-4" />
                </a>
            </div>
        ) : (
          <>
            <div className="bg-white/60 backdrop-blur-lg border border-black/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-300 pb-2 mb-4">Application Details</h3>
              <FormRow>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="As per your ID proof" hasError={!!errors.fullName} />
                {errors.fullName && <ErrorMessage>{errors.fullName}</ErrorMessage>}
              </FormRow>
              <FormRow>
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g., Radhika's Kirana Store" hasError={!!errors.businessName} />
                {errors.businessName && <ErrorMessage>{errors.businessName}</ErrorMessage>}
              </FormRow>
              <FormRow>
                <Label htmlFor="address">Full Address</Label>
                <TextArea id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Your full business or residential address" hasError={!!errors.address} />
                {errors.address && <ErrorMessage>{errors.address}</ErrorMessage>}
              </FormRow>
              <FormRow>
                <Label htmlFor="governmentIdType">Government ID Type</Label>
                <div className="relative">
                  <select id="governmentIdType" value={governmentIdType} onChange={(e) => setGovernmentIdType(e.target.value)} className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-slate-900 leading-tight focus:outline-none focus:ring-2 focus:ring-rose-500 border-slate-300 bg-white/50">
                    <option value="">-- Select ID Type --</option>
                    {governmentIdTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                      <ChevronDownIcon className="w-5 h-5" />
                  </div>
                </div>
                {errors.governmentIdType && <ErrorMessage>{errors.governmentIdType}</ErrorMessage>}
              </FormRow>
              <FormRow>
                <Label htmlFor="governmentIdProof">Upload ID Proof</Label>
                <label htmlFor="governmentIdProof" className="cursor-pointer flex items-center justify-center w-full px-6 py-4 border-2 border-slate-400 border-dashed rounded-md bg-slate-100/50 hover:bg-slate-200/50 transition-colors">
                    <div className="text-center">
                        <CloudUploadIcon className="mx-auto h-10 w-10 text-slate-500" />
                        <span className="mt-2 block text-sm font-medium text-slate-600">
                            {governmentIdProof ? governmentIdProof.name : 'Click to upload a file'}
                        </span>
                        <span className="block text-xs text-slate-500">PDF, PNG, JPG up to 5MB</span>
                    </div>
                    <input id="governmentIdProof" type="file" className="sr-only" onChange={e => handleFileChange(e, 'id')} accept="application/pdf,image/jpeg,image/png" />
                </label>
                {governmentIdProof && <p className="text-green-600 text-xs italic mt-2 flex items-center"><DocumentTextIcon className="w-4 h-4 mr-1"/>{governmentIdProof.name} ready for upload.</p>}
                {errors.governmentIdProof && <ErrorMessage>{errors.governmentIdProof}</ErrorMessage>}
              </FormRow>
            </div>

            <div className="bg-white/60 backdrop-blur-lg border border-black/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-300 pb-2 mb-4">Bank Account Details</h3>
              <FormRow>
                  <Label htmlFor="accountHolderName">Account Holder Name</Label>
                  <Input id="accountHolderName" type="text" value={accountHolderName} onChange={e => setAccountHolderName(e.target.value)} placeholder="As per bank records" hasError={!!errors.accountHolderName} />
                  {errors.accountHolderName && <ErrorMessage>{errors.accountHolderName}</ErrorMessage>}
              </FormRow>
              <FormRow>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input id="bankName" type="text" value={bankName} onChange={e => setBankName(e.target.value)} placeholder="e.g., State Bank of India" hasError={!!errors.bankName} />
                  {errors.bankName && <ErrorMessage>{errors.bankName}</ErrorMessage>}
              </FormRow>
              <FormRow>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input id="accountNumber" type="text" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} placeholder="Enter your bank account number" hasError={!!errors.accountNumber} />
                  {errors.accountNumber && <ErrorMessage>{errors.accountNumber}</ErrorMessage>}
              </FormRow>
              <FormRow>
                  <Label htmlFor="ifscCode">IFSC Code</Label>
                  <Input id="ifscCode" type="text" value={ifscCode} onChange={e => setIfscCode(e.target.value.toUpperCase())} placeholder="e.g., SBIN0001234" hasError={!!errors.ifscCode} />
                  {errors.ifscCode && <ErrorMessage>{errors.ifscCode}</ErrorMessage>}
              </FormRow>
               <FormRow>
                <Label htmlFor="bankProof">Upload Bank Proof</Label>
                <label htmlFor="bankProof" className="cursor-pointer flex items-center justify-center w-full px-6 py-4 border-2 border-slate-400 border-dashed rounded-md bg-slate-100/50 hover:bg-slate-200/50 transition-colors">
                    <div className="text-center">
                        <CloudUploadIcon className="mx-auto h-10 w-10 text-slate-500" />
                        <span className="mt-2 block text-sm font-medium text-slate-600">
                            {bankProof ? bankProof.name : 'Upload passbook or cheque photo'}
                        </span>
                        <span className="block text-xs text-slate-500">PDF, PNG, JPG up to 5MB</span>
                    </div>
                    <input id="bankProof" type="file" className="sr-only" onChange={e => handleFileChange(e, 'bank')} accept="application/pdf,image/jpeg,image/png" />
                </label>
                {bankProof && <p className="text-green-600 text-xs italic mt-2 flex items-center"><DocumentTextIcon className="w-4 h-4 mr-1"/>{bankProof.name} ready for upload.</p>}
                {errors.bankProof && <ErrorMessage>{errors.bankProof}</ErrorMessage>}
              </FormRow>
            </div>
            
            <div className="bg-white/60 backdrop-blur-lg border border-black/10 rounded-2xl p-6 space-y-4">
               <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-300 pb-2 mb-4">Loan Purpose</h3>
              <FormRow>
                <Label htmlFor="loanPurpose">Purpose of Loan</Label>
                <div className="relative">
                  <select id="loanPurpose" value={loanPurpose} onChange={(e) => setLoanPurpose(e.target.value)} className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-slate-900 leading-tight focus:outline-none focus:ring-2 focus:ring-rose-500 border-slate-300 bg-white/50">
                    <option value="">-- Select a Purpose --</option>
                    {loanPurposes.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                      <ChevronDownIcon className="w-5 h-5" />
                  </div>
                </div>
                {errors.loanPurpose && <ErrorMessage>{errors.loanPurpose}</ErrorMessage>}
              </FormRow>

              {loanPurpose === 'Other' && (
                <FormRow>
                  <Label htmlFor="otherPurpose">Please Specify Purpose</Label>
                  <TextArea id="otherPurpose" value={otherPurpose} onChange={(e) => setOtherPurpose(e.target.value)} placeholder="Describe how you will use the loan funds" hasError={!!errors.otherPurpose} />
                  {errors.otherPurpose && <ErrorMessage>{errors.otherPurpose}</ErrorMessage>}
                </FormRow>
              )}
            </div>
            
            <div className="mt-8">
                <button
                    type="submit"
                    disabled={isSubmitting || progress < 100}
                    className="w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-rose-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
            </div>
             {submissionError && 
                <div className="mt-4">
                  <Alert type="error" message={submissionError} />
                </div>
              }
          </>
        )}
      </form>
    </div>
  );
};

export default LoanApplication;