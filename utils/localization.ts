import { Language } from '../types';

const translations = {
  en: {
    welcome_guest: 'Welcome, Guest!',
    welcome_user: 'Welcome back, {username}!',
    what_to_do: 'What would you like to do today?',
    apply_for_loan: 'Apply for Loan',
    apply_for_loan_desc: 'Get funds to grow your business.',
    explore_schemes: 'Explore Schemes',
    explore_schemes_desc: 'View government support programs.',
    financial_wisdom: 'Financial Wisdom',
    financial_wisdom_desc: 'Actionable tips to manage finances.',
    loan_history: 'Loan History',
    loan_history_desc: 'Track all your past applications.',
    track_external_loans: 'Track External Loans',
    track_external_loans_desc: 'Manage all your loans in one place.',
    how_it_works: 'How It Works',
    how_it_works_desc: 'A quick guide to our process.',
  },
  hi: {
    welcome_guest: 'नमस्ते, अतिथि!',
    welcome_user: 'वापस स्वागत है, {username}!',
    what_to_do: 'आज आप क्या करना चाहेंगे?',
    apply_for_loan: 'ऋण के लिए आवेदन करें',
    apply_for_loan_desc: 'अपना व्यवसाय बढ़ाने के लिए धन प्राप्त करें।',
    explore_schemes: 'योजनाएं देखें',
    explore_schemes_desc: 'सरकारी सहायता कार्यक्रम देखें।',
    financial_wisdom: 'वित्तीय ज्ञान',
    financial_wisdom_desc: 'वित्त प्रबंधन के लिए व्यावहारिक सुझाव।',
    loan_history: 'ऋण इतिहास',
    loan_history_desc: 'अपने सभी पिछले आवेदन ट्रैक करें।',
    track_external_loans: 'बाहरी ऋण ट्रैक करें',
    track_external_loans_desc: 'अपने सभी ऋण एक ही स्थान पर प्रबंधित करें।',
    how_it_works: 'यह कैसे काम करता है',
    how_it_works_desc: 'हमारी प्रक्रिया के लिए एक त्वरित गाइड।',
  },
};

export type TranslationKey = keyof typeof translations.en;

export const t = (key: TranslationKey, lang: Language, options?: { [key: string]: string }) => {
  let text = translations[lang][key] || translations['en'][key];
  if (options) {
    Object.keys(options).forEach(optionKey => {
      text = text.replace(`{${optionKey}}`, options[optionKey]);
    });
  }
  return text;
};