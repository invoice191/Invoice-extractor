
import React, { useState } from 'react';
import {
    X,
    ChevronRight,
    CheckCircle2,
    Store,
    Users,
    FileText,
    LayoutDashboard,
    Zap,
    ArrowRight
} from 'lucide-react';

interface OnboardingWizardProps {
    onClose: () => void;
    onLaunch: () => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onClose, onLaunch }) => {
    const [step, setStep] = useState(1);
    const totalSteps = 4;

    const steps = [
        {
            title: "Welcome to VyaparMitra",
            desc: "Your all-in-one GST Billing and Business Intelligence platform. Built specifically for Indian Retailers.",
            icon: LayoutDashboard,
            color: "blue",
            features: ["GST Compliant Billing", "AI-Powered Insights", "Inventory Optimization"]
        },
        {
            title: "Smart POS & Inventory",
            desc: "Fast billing with barcode scanning, automated low-stock alerts, and batch/expiry tracking for your products.",
            icon: Zap,
            color: "amber",
            features: ["Barcode Scanning", "Low-Stock Alerts", "Expiry Tracking"]
        },
        {
            title: "Customer Khata Book",
            desc: "Manage customer credit, payments, and send professional WhatsApp reminders with a single click.",
            icon: Users,
            color: "emerald",
            features: ["Credit/Debit Tracking", "WhatsApp Reminders", "Statement Downloads"]
        },
        {
            title: "Digital Online Store",
            desc: "Create a stunning digital catalog for your shop and share it on WhatsApp to receive orders directly.",
            icon: Store,
            color: "indigo",
            features: ["Shareable Product Catalog", "WhatsApp Integration", "Local Network Presence"]
        }
    ];

    const currentStep = steps[step - 1];

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-fade-in" onClick={onClose}></div>

            <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row animate-slide-up h-[600px] sm:h-[500px]">
                {/* Sidebar Graphics */}
                <div className={`hidden sm:flex w-2/5 p-10 flex-col justify-between transition-colors duration-700 bg-${currentStep.color}-600`}>
                    <div className="bg-white/20 p-4 rounded-3xl w-fit shadow-inner">
                        <currentStep.icon className="h-10 w-10 text-white" />
                    </div>
                    <div>
                        <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Step 0{step}</p>
                        <h3 className="text-2xl font-black text-white leading-tight">{currentStep.title}</h3>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-8 sm:p-12 flex flex-col">
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 h-10 w-10 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all z-10">
                        <X className="h-6 w-6" />
                    </button>

                    <div className="sm:hidden mb-8">
                        <div className={`p-4 rounded-2xl w-fit bg-${currentStep.color}-100 dark:bg-${currentStep.color}-500/10 mb-6`}>
                            <currentStep.icon className={`h-8 w-8 text-${currentStep.color}-600 dark:text-${currentStep.color}-400`} />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">{currentStep.title}</h3>
                    </div>

                    <div className="flex-1">
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed mb-8">
                            {currentStep.desc}
                        </p>

                        <div className="grid grid-cols-1 gap-3">
                            {currentStep.features.map((f, i) => (
                                <div key={i} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                                    <CheckCircle2 className={`h-5 w-5 text-${currentStep.color}-500`} />
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-10 mt-auto border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex gap-1.5">
                            {[1, 2, 3, 4].map(s => (
                                <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${s === step ? `w-8 bg-${currentStep.color}-600` : 'w-2 bg-slate-200 dark:bg-slate-800'}`}></div>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            {step < totalSteps ? (
                                <button
                                    onClick={() => setStep(step + 1)}
                                    className={`bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2`}
                                >
                                    Next Step <ChevronRight className="h-4 w-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={onLaunch}
                                    className={`bg-${currentStep.color}-600 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-xl`}
                                >
                                    Launch App <ArrowRight className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingWizard;
