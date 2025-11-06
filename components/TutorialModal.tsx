import React, { useState } from 'react';
import {
    XIcon,
    ArrowRightIcon,
    ArrowLeftIcon,
    HomeIcon,
    CalculatorIcon,
    BuildingLibraryIcon,
    ScaleIcon,
    BellIcon,
    UserIcon,
    SparklesIcon
} from './Icons';

interface TutorialModalProps {
  onClose: () => void;
}

const tutorialSteps = [
    {
        icon: <HomeIcon className="w-12 h-12 text-rose-500" />,
        title: "Welcome to UDHAAR SETU!",
        text: "Your dashboard gives you quick access to everything. This guide will walk you through the key features to help you get started."
    },
    {
        icon: <CalculatorIcon className="w-12 h-12 text-green-500" />,
        title: "Estimate & Apply Directly",
        text: "Use our calculator to estimate payments for a Direct Loan. Then, fill in your details, address, and bank info to apply. Save your address in your profile to pre-fill it next time!"
    },
    {
        icon: <BuildingLibraryIcon className="w-12 h-12 text-indigo-500" />,
        title: "Explore Government Schemes",
        text: "You can also explore various government schemes. Select a scheme to see its details and get a direct link to apply on the official government portal."
    },
    {
        icon: <ScaleIcon className="w-12 h-12 text-pink-500" />,
        title: "Track ALL Your Loans",
        text: "After approval, track your UDHAAR SETU loan on the dashboard. Use the 'External Loan Tracker' to manage loans from other places, keeping all your finances in one view."
    },
    {
        icon: <BellIcon className="w-12 h-12 text-red-500" />,
        title: "Stay Informed & Grow",
        text: "Check the bell icon for payment reminders. Review all past applications in 'Loan History' and gain knowledge from 'Financial Wisdom' tips."
    },
    {
        icon: <UserIcon className="w-12 h-12 text-teal-500" />,
        title: "Personalize Your Experience",
        text: "Complete your profile with a photo, address, and more. You can switch between English and Hindi using the globe icon in the header anytime."
    },
    {
        icon: <SparklesIcon className="w-12 h-12 text-amber-500" />,
        title: "You're All Set!",
        text: "You're ready to take control of your financial journey. We're here to support you as you grow your business!"
    }
];

const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const totalSteps = tutorialSteps.length;

    const nextStep = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onClose(); // Last step button closes modal
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep + 1);
        }
    };

    const stepData = tutorialSteps[currentStep];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white/80 backdrop-blur-xl border border-black/10 rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-300" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 text-center">
                    <div className="flex justify-center items-center w-20 h-20 rounded-full bg-slate-200/50 mx-auto mb-4">
                        {stepData.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{stepData.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{stepData.text}</p>
                </div>

                <div className="px-6 py-4 bg-slate-100/50 rounded-b-2xl">
                     <div className="flex items-center justify-center mb-4">
                        {Array.from({ length: totalSteps }).map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full mx-1 transition-colors duration-300 ${currentStep === index ? 'bg-rose-500' : 'bg-slate-400'}`}
                            ></div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 0}
                            className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-200/50 rounded-md hover:bg-slate-300/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ArrowLeftIcon className="w-4 h-4" />
                            <span>Prev</span>
                        </button>
                        
                        <button onClick={nextStep} className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-orange-500 rounded-md hover:from-rose-600 hover:to-orange-600 transition-all">
                            <span>{currentStep === totalSteps - 1 ? 'Get Started' : 'Next'}</span>
                            {currentStep < totalSteps - 1 && <ArrowRightIcon className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
                
                 <button onClick={onClose} className="absolute top-2 right-2 text-slate-500 p-2 rounded-full hover:bg-slate-200/50 transition-colors" aria-label="Close tutorial">
                    <XIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default TutorialModal;