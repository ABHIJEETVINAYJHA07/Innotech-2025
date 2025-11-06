import { ReactElement } from "react";

// Fix: Added missing type definitions to resolve import errors across the application.
export type View =
  | 'dashboard'
  | 'apply'
  | 'literacy'
  | 'history'
  | 'profile'
  | 'signin'
  | 'signup'
  | 'schemes'
  | 'externalTracker';

export type Language = 'en' | 'hi';

export interface LoanApplicationData {
  id: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Not Applied';
  applicationDate: string; // ISO string
  fullName: string;
  businessName: string;
  address: string;
  governmentIdType: string;
  governmentIdProof: string; // File name
  loanAmount: number;
  loanPurpose: string;
  loanTerm: number; // in months
  interestRate: number; // annual percentage
  scheme: string; // name of the scheme
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  bankProof: string; // File name
  loanBalance?: number;
  nextPaymentDate?: string; // ISO string
}

export interface User {
  username: string;
  fullName:string;
  mobileNumber: string;
  address?: string;
  addressProof?: string; // filename
  email?: string;
  alternateMobileNumber?: string;
  age?: number;
  gender?: string;
  profilePhoto?: string; // filename or URL
}

export interface Scheme {
  id: string;
  name: string;
  description: string;
  link: string;
  interestRate: number; // annual percentage
  maxLoanAmount: number;
  type: 'internal' | 'government';
}

export interface ExternalLoan {
  id: string;
  lenderName: string;
  loanAmount: number;
  interestRate: number; // annual percentage
  loanTerm: number; // in months
  startDate: string; // ISO string
}