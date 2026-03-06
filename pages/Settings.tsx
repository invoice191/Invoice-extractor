import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings as SettingsIcon,
  Users,
  Building2,
  ChevronRight,
  ArrowLeft,
  Mail,
  Phone,
  Plus,
  UserPlus,
  FileText,
  Zap,
  ChevronDown,
  X,
  Share2,
  Palette,
  BadgePercent,
  Printer,
  BellRing,
  HelpCircle,
  LogOut,
  User as UserIcon,
  Ticket,
  MessageCircle,
  Keyboard,
  ShieldCheck,
  Smartphone,
  Scan,
  Store,
  Monitor,
  CheckCircle2,
  Lock,
  Globe,
  Trash2,
  CreditCard,
  Calendar,
  Search,
  Sparkles
} from 'lucide-react';
import { InvoiceSettings } from '../types';

import { useLanguage } from '../context/LanguageContext';

type SettingsSection =
  | 'Account'
  | 'Manage Business'
  | 'Invoice Settings'
  | 'Print Settings'
  | 'Manage Users'
  | 'Reminders'
  | 'CA Reports Sharing'
  | 'Pricing'
  | 'Refer & Earn'
  | 'Help And Support'
  | 'Logout';

interface SettingsProps {
  onBack?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState<SettingsSection>('Manage Business');

  const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettings>(() => {
    const saved = localStorage.getItem('vm_invoice_settings');
    return saved ? JSON.parse(saved) : {
      businessName: 'PS_infoTech',
      gstin: '',
      address: '',
      phone: '9359850496',
      email: '',
      upiId: 'vyaparmitra@upi',
      invoicePrefix: 'VM/',
      startingNumber: 1,
      terms: '2. All disputes are subject to jurisdiction only',
      showSignatureBox: true,
      theme: 'Advanced GST (Tally)',
      primaryColor: '#4f46e5',
      showPhoneNumber: true,
      showEmail: false,
      showTime: false,
      showPartyBalance: false,
      showItemDescription: true
    };
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleGlobalSave = () => {
    setIsSaving(true);
    localStorage.setItem('vm_invoice_settings', JSON.stringify(invoiceSettings));
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 800);
  };

  const navigationItems: { id: SettingsSection; label: string; icon: any }[] = [
    { id: 'Account', label: t('accountSettings'), icon: UserIcon },
    { id: 'Manage Business', label: t('manageBusiness'), icon: Building2 },
    { id: 'Invoice Settings', label: t('invoiceSettings'), icon: Palette },
    { id: 'Print Settings', label: t('printSettings'), icon: Printer },
    { id: 'Manage Users', label: t('manageUsers'), icon: Users },
    { id: 'Reminders', label: t('reminders'), icon: BellRing },
    { id: 'CA Reports Sharing', label: t('caReportsSharing'), icon: Share2 },
    { id: 'Pricing', label: t('pricing'), icon: BadgePercent },
    { id: 'Refer & Earn', label: t('referAndEarn'), icon: Ticket },
    { id: 'Help And Support', label: t('helpSupport'), icon: HelpCircle },
    { id: 'Logout', label: t('logout'), icon: LogOut },
  ];

  const AccountSettingsView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-10"
    >
      {/* Top Header Controls */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 -mx-6 md:-mx-8 border-b border-slate-200 dark:border-slate-800 -mt-8 sticky top-0 z-20">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t('accountSettings')}</h2>
          <p className="text-xs text-slate-400 font-medium">Manage Your Account And Subscription</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
            <Keyboard className="h-5 w-5" />
          </button>
          <button className="flex items-center gap-2 border border-blue-200 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-bold">
            <MessageCircle className="h-4 w-4" /> Chat Support
          </button>
          <button className="px-6 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-500">
            Cancel
          </button>
          <button className="px-8 py-2 bg-indigo-100 text-indigo-400 rounded-lg text-sm font-bold cursor-not-allowed">
            Save Changes
          </button>
        </div>
      </div>

      {/* Suggestion Banner */}
      <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/30 rounded-lg p-4 flex items-center justify-center gap-4">
        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Help us make myBillBook better</span>
        <button className="flex items-center gap-2 bg-[#e65c00] hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all active:scale-95">
          <Smartphone className="h-4 w-4" /> Share Suggestion
        </button>
      </div>

      {/* General Information */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <h3 className="text-sm font-bold text-slate-500">{t('generalInfo')}</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Name *</label>
            <input type="text" placeholder="Enter name" className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-500 dark:bg-slate-800" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile Number</label>
            <input type="text" defaultValue="9359850496" className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-500 dark:bg-slate-800" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</label>
            <input type="text" placeholder="Enter email" className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-500 dark:bg-slate-800" />
          </div>
        </div>
      </div>

      {/* Referral Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <h3 className="text-sm font-bold text-slate-500">Referral code for subscription discount</h3>
        </div>
        <div className="p-6 flex items-center gap-4">
          <input type="text" placeholder="Referral Code" className="w-64 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-500 dark:bg-slate-800" />
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-2.5 rounded-lg text-sm font-bold shadow-md transition-all active:scale-95">
            Apply
          </button>
        </div>
      </div>

      {/* Subscription Plan */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <h3 className="text-sm font-bold text-slate-500">Subscription Plan</h3>
        </div>
        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Plan</p>
              <h4 className="text-4xl font-black text-slate-800 dark:text-white">Trial</h4>
            </div>

            <div className="space-y-4">
              <button className="bg-[#e65c00] hover:bg-orange-700 text-white px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-orange-100 dark:shadow-none transition-all active:scale-95">
                Buy Subscription Plan
              </button>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/150?u=${i}`} className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-900 object-cover" alt="User" />
                  ))}
                </div>
                <p className="text-[11px] font-bold text-slate-400 leading-tight">
                  <span className="text-slate-600 dark:text-slate-300">10,00,000+ Vyaparis</span> running their<br />business on myBillBook premium
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-sm font-bold text-slate-500">Upgrade your plan today and get access to premium features:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              {[
                { icon: Users, label: 'Multi User and Staff Access' },
                { icon: Building2, label: 'Multiple Businesses' },
                { icon: FileText, label: 'EWay Bill Generation' },
                { icon: Monitor, label: 'Desktop App' },
                { icon: MessageCircle, label: 'SMS Marketing' },
                { icon: Scan, label: 'Scan & Print Barcode' }
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-100 dark:border-slate-700">
                    <feature.icon className="h-5 w-5 text-indigo-500" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const ManageBusinessView = () => (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 -mx-6 md:-mx-8 border-b border-slate-200 dark:border-slate-800 -mt-8 sticky top-0 z-20">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t('manageBusiness')}</h2>
          <p className="text-xs text-slate-400 font-medium">Edit Your Company Settings And Information</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-[#e65c00] hover:bg-orange-700 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm transition-all active:scale-95">
            Create new business
          </button>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>
          <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
            <Keyboard className="h-5 w-5" />
          </button>
          <button className="flex items-center gap-2 border border-blue-200 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-bold">
            <MessageCircle className="h-4 w-4" /> Chat Support
          </button>
          <button className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300">
            <Calendar className="h-4 w-4" /> Close Financial Year
          </button>
          <button className="px-6 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-500">
            Cancel
          </button>
          <button
            onClick={handleGlobalSave}
            disabled={isSaving}
            className={`px-8 py-2 rounded-lg text-sm font-bold shadow-lg transition-all flex items-center gap-2 ${saveSuccess
              ? 'bg-emerald-500 text-white'
              : isSaving
                ? 'bg-indigo-400 text-white cursor-wait'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
          >
            {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : t('saveChanges')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="flex gap-8">
            <div className="w-32 h-32 border-2 border-dashed border-blue-400 rounded-lg flex flex-col items-center justify-center bg-blue-50/30 text-blue-500 cursor-pointer hover:bg-blue-50 transition-colors text-center p-2">
              <Plus className="h-6 w-6 mb-2" />
              <span className="text-xs font-bold">Upload Logo</span>
              <span className="text-[10px] opacity-60">PNG/JPG, max 5 MB.</span>
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Business Name *</label>
                <input
                  type="text"
                  value={invoiceSettings.businessName}
                  onChange={(e) => setInvoiceSettings({ ...invoiceSettings, businessName: e.target.value })}
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-500 dark:bg-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500">Company Phone Number</label>
              <input
                type="text"
                value={invoiceSettings.phone}
                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, phone: e.target.value })}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-500 dark:bg-slate-800"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500">Company E-Mail</label>
              <input
                type="text"
                value={invoiceSettings.email}
                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, email: e.target.value })}
                placeholder="Enter company e-mail"
                className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-500 dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500">Billing Address</label>
            <textarea
              value={invoiceSettings.address}
              onChange={(e) => setInvoiceSettings({ ...invoiceSettings, address: e.target.value })}
              placeholder="Enter Billing Address"
              className="w-full h-24 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium outline-none focus:border-indigo-500 dark:bg-slate-800 resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500">State</label>
              <div className="relative">
                <input type="text" placeholder="Enter State" className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-500 dark:bg-slate-800" />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500">Pincode</label>
              <input type="text" placeholder="Enter Pincode" className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-500 dark:bg-slate-800" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500">City</label>
            <input type="text" placeholder="Enter City" className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-500 dark:bg-slate-800" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500">Are you GST Registered?</label>
            <div className="flex gap-4">
              <button
                onClick={() => setInvoiceSettings({ ...invoiceSettings, gstin: invoiceSettings.gstin || 'TEMP_GST' })}
                className={`flex-1 flex items-center justify-between border rounded-lg px-4 py-3 transition-all ${invoiceSettings.gstin ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-200'}`}
              >
                <span className={`text-sm ${invoiceSettings.gstin ? 'font-bold text-indigo-600' : 'font-medium'}`}>Yes</span>
                <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${invoiceSettings.gstin ? 'border-indigo-600' : 'border-slate-300'}`}>
                  {invoiceSettings.gstin && <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>}
                </div>
              </button>
              <button
                onClick={() => setInvoiceSettings({ ...invoiceSettings, gstin: '' })}
                className={`flex-1 flex items-center justify-between border rounded-lg px-4 py-3 transition-all ${!invoiceSettings.gstin ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-200'}`}
              >
                <span className={`text-sm ${!invoiceSettings.gstin ? 'font-bold text-indigo-600' : 'font-medium'}`}>No</span>
                <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${!invoiceSettings.gstin ? 'border-indigo-600' : 'border-slate-300'}`}>
                  {!invoiceSettings.gstin && <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>}
                </div>
              </button>
            </div>
          </div>

          {invoiceSettings.gstin !== '' && (
            <div className="space-y-1.5 animate-fade-in">
              <label className="text-xs font-bold text-slate-500">GSTIN *</label>
              <input
                type="text"
                value={invoiceSettings.gstin === 'TEMP_GST' ? '' : invoiceSettings.gstin}
                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, gstin: e.target.value })}
                placeholder="Enter GSTIN Number"
                className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-500 dark:bg-slate-800 font-mono"
              />
            </div>
          )}

          <div className="flex items-center justify-between border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-indigo-600">Enable e-Invoicing</span>
              <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded italic">New</span>
            </div>
            <div className="h-6 w-11 bg-slate-200 dark:bg-slate-700 rounded-full relative cursor-pointer">
              <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full"></div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500">PAN Number</label>
            <input type="text" placeholder="Enter your PAN Number" className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-500 dark:bg-slate-800" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Enable TDS</span>
              <div className="h-6 w-11 bg-slate-200 dark:bg-slate-700 rounded-full relative">
                <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Enable TCS</span>
              <div className="h-6 w-11 bg-slate-200 dark:bg-slate-700 rounded-full relative">
                <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500">Business Type (Select multiple, if applicable)</label>
              <div className="relative">
                <select className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-500 dark:bg-slate-800 appearance-none">
                  <option>Select</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500">Industry Type</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type="text" placeholder="Select Industry Type" className="w-full border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-500 dark:bg-slate-800" />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500">Business Registration Type</label>
            <div className="relative">
              <select className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-500 dark:bg-slate-800 appearance-none">
                <option>Private Limited Company</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="bg-orange-50/50 p-3 rounded-lg border border-orange-100 flex items-center justify-center gap-2">
            <span className="text-[11px] font-bold text-slate-700 italic">Note: <span className="font-normal text-slate-600 not-italic">Terms & Conditions and Signature added below will be shown on your Invoices</span></span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500">Signature</label>
            <div className="h-32 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50/30 flex items-center justify-center">
              <span className="text-slate-300">Signature Box</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">You have enabled to show 'Empty Signature box' on invoices</p>
            <button className="text-xs font-bold text-rose-500 uppercase tracking-widest">Remove</button>
          </div>

          {/* Add Business Details Card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-indigo-600">Add Business Details</h4>
              <p className="text-[11px] text-slate-400">Add additional business information such as MSME number, Website etc.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-40">
                <select className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm font-medium outline-none dark:bg-slate-800 appearance-none">
                  <option>Website</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
              <span className="text-slate-400">=</span>
              <input type="text" placeholder="www.website.com" className="flex-1 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm font-medium outline-none dark:bg-slate-800" />
              <button className="bg-indigo-600 text-white px-8 py-2 rounded-lg text-sm font-bold shadow-md">Add</button>
            </div>
          </div>
        </div>
      </div>

      {/* Company Settings Table-like Section */}
      <div className="space-y-4 pt-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-slate-500">Company Settings</h3>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 flex items-center gap-6 max-w-sm">
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Tally_Prime_logo.svg" className="h-6 opacity-60" alt="Tally" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-indigo-600">Data Export to Tally</span>
              <span className="bg-blue-500 text-white text-[9px] font-bold px-1 py-0.5 rounded italic">New</span>
            </div>
            <p className="text-[11px] text-slate-400">Transfer vouchers, items and parties to Tally</p>
          </div>
        </div>
      </div>

      {/* Bottom Illustration Section */}
      <div className="space-y-4 pt-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-slate-500">Add New Business</h3>
        </div>
        <div className="bg-slate-50 dark:bg-slate-950 p-10 rounded-lg flex flex-col items-center justify-center text-center space-y-6">
          <div className="relative w-full max-w-lg h-48 flex items-center justify-center gap-12">
            <div className="w-40 h-32 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 flex flex-col items-center justify-center relative">
              <span className="absolute -top-3 -right-3 bg-orange-400 text-white px-2 py-0.5 rounded-md text-[8px] font-black uppercase">Store 1</span>
              <div className="w-16 h-8 bg-rose-100 rounded mb-2"></div>
              <span className="text-[10px] font-bold text-slate-400">SALE</span>
            </div>
            <div className="w-20 h-20 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center">
              <Monitor className="h-8 w-8 text-indigo-400" />
            </div>
            <div className="w-40 h-32 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 flex flex-col items-center justify-center relative">
              <span className="absolute -top-3 -right-3 bg-orange-400 text-white px-2 py-0.5 rounded-md text-[8px] font-black uppercase">Store 2</span>
              <div className="w-20 h-10 border-2 border-slate-100 rounded-t-lg"></div>
              <div className="w-12 h-6 bg-amber-50 rounded"></div>
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Easily Manage all your businesses in one place on myBillBook app</p>
          </div>
          <button className="bg-indigo-600 text-white px-8 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-indigo-100">
            Create New Business
          </button>
        </div>
      </div>
    </div>
  );

  const InvoiceSettingsView = () => {
    const [expandedSections, setExpandedSections] = useState<string[]>(['Theme Settings', 'Invoice Details', 'Item Table Columns', 'Miscellaneous Details']);

    const toggleSetting = (key: keyof InvoiceSettings) => {
      setInvoiceSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const updateSetting = (key: keyof InvoiceSettings, value: any) => {
      setInvoiceSettings(prev => ({ ...prev, [key]: value }));
    };

    const toggleSection = (section: string) => {
      setExpandedSections(prev =>
        prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
      );
    };

    const AccordionSection = ({ title, children, isNew = false }: { title: string, children: React.ReactNode, isNew?: boolean }) => (
      <div className="border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={() => toggleSection(title)}
          className="w-full flex items-center justify-between py-4 px-1 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{title}</span>
            {isNew && <span className="bg-blue-500 text-white text-[8px] font-black px-1 py-0.5 rounded uppercase">New</span>}
          </div>
          <motion.div
            animate={{ rotate: expandedSections.includes(title) ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </motion.div>
        </button>
        <AnimatePresence>
          {expandedSections.includes(title) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="pb-6 pt-2 px-1 space-y-4">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col h-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t('invoiceSettings')}</h2>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGlobalSave}
            disabled={isSaving}
            className={`px-8 py-2 rounded-lg text-sm font-bold shadow-lg transition-all flex items-center gap-2 ${saveSuccess
              ? 'bg-emerald-500 text-white shadow-emerald-100'
              : isSaving
                ? 'bg-indigo-400 text-white cursor-wait'
                : 'bg-indigo-600 text-white shadow-indigo-100 dark:shadow-none hover:bg-indigo-700'
              }`}
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Saved!
              </>
            ) : (
              'Save Changes'
            )}
          </motion.button>
        </div>

        <div className="flex flex-1 gap-8 min-h-0">
          {/* Left: Invoice Preview */}
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tax Invoice</span>
                <span className="px-2 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-[9px] font-bold text-slate-500">ORIGINAL FOR RECIPIENT</span>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-8 bg-slate-100/30 dark:bg-slate-950/30 custom-scrollbar">
              {/* Actual Invoice Mockup */}
              <motion.div
                layout
                className={`bg-white dark:bg-slate-900 w-full max-w-3xl mx-auto shadow-2xl border border-slate-200 dark:border-slate-800 min-h-[1000px] relative overflow-hidden transition-all duration-500 ${invoiceSettings.theme === 'Luxury' ? 'ring-4 ring-amber-100 dark:ring-amber-900/20' : ''}`}
              >
                {/* Ramadan Background Pattern */}
                <AnimatePresence>
                  {invoiceSettings.showRamadan && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.05 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 pointer-events-none flex items-end justify-center"
                    >
                      <div className="w-full h-1/2 bg-gradient-to-t from-emerald-500 to-transparent"></div>
                      <div className="absolute bottom-10 text-emerald-600 opacity-20">
                        <Store className="h-64 w-64" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="p-8 space-y-0 relative z-10">
                  {/* Business Info Header */}
                  <div className="grid grid-cols-2 border border-slate-900">
                    <div className="p-4 border-r border-slate-900 space-y-1">
                      <h3 className="text-lg font-black text-slate-900">{invoiceSettings.businessName}</h3>
                      {invoiceSettings.showPhoneNumber && <p className="text-xs font-bold text-slate-600">Mobile: {invoiceSettings.phone}</p>}
                    </div>
                    <div className="grid grid-cols-3">
                      <div className="p-3 border-r border-slate-900 flex flex-col items-center justify-center text-center">
                        <span className="text-[9px] font-bold text-slate-500 uppercase">Invoice No.</span>
                        <span className="text-[10px] font-black">{invoiceSettings.invoicePrefix}{String(invoiceSettings.startingNumber).padStart(3, '0')}</span>
                      </div>
                      <div className="p-3 border-r border-slate-900 flex flex-col items-center justify-center text-center">
                        <span className="text-[9px] font-bold text-slate-500 uppercase">Invoice Date</span>
                        <span className="text-[10px] font-black">17/01/2023</span>
                        {invoiceSettings.showTime && <span className="text-[8px] text-slate-400">14:30 PM</span>}
                      </div>
                      <div className="p-3 flex flex-col items-center justify-center text-center">
                        <span className="text-[9px] font-bold text-slate-500 uppercase">Due Date</span>
                        <span className="text-[10px] font-black">16/02/2023</span>
                      </div>
                    </div>
                  </div>

                  {/* Bill To Section */}
                  <div className="grid grid-cols-2 border-x border-b border-slate-900">
                    <div className="p-4 border-r border-slate-900 space-y-2">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Bill To</span>
                      <div className="space-y-1">
                        <p className="text-xs font-black">SAMPLE PARTY</p>
                        <p className="text-[10px] text-slate-600 leading-tight">Address: No F2, Outer Circle, Connaught Circus, New Delhi, DELHI, 110001</p>
                        <p className="text-[10px] font-bold">GSTIN: 07ABCCH2702H4ZZ</p>
                        <p className="text-[10px] font-bold">Mobile: 7400417400</p>
                        {invoiceSettings.showPartyBalance && <p className="text-[9px] text-rose-500 font-bold">Balance: ₹ 4,500.00</p>}
                      </div>
                    </div>
                    <div className="p-4 space-y-1">
                      {(invoiceSettings as any).poNumber && <p className="text-[10px] font-bold">PO No: PO-98765</p>}
                      {(invoiceSettings as any).ewayBill && <p className="text-[10px] font-bold">E-way Bill: 123456789012</p>}
                      {(invoiceSettings as any).vehicleNumber && <p className="text-[10px] font-bold">Vehicle: KA-01-AB-1234</p>}
                      <p className="text-[10px] text-slate-600">Address: {invoiceSettings.address.substring(0, 30)}...</p>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="border-x border-b border-slate-900">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-900 bg-slate-50">
                          <th className="p-2 text-[9px] font-black uppercase border-r border-slate-900 w-12 text-center">S.No.</th>
                          <th className="p-2 text-[9px] font-black uppercase border-r border-slate-900">Items</th>
                          <th className="p-2 text-[9px] font-black uppercase border-r border-slate-900 w-16 text-center">HSN</th>
                          {invoiceSettings.quantity && <th className="p-2 text-[9px] font-black uppercase border-r border-slate-900 w-16 text-center">Qty.</th>}
                          {invoiceSettings.pricePerItem && <th className="p-2 text-[9px] font-black uppercase border-r border-slate-900 w-20 text-right">Rate</th>}
                          {invoiceSettings.batchNo && <th className="p-2 text-[9px] font-black uppercase border-r border-slate-900 w-16 text-center">Batch</th>}
                          <th className="p-2 text-[9px] font-black uppercase w-24 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="text-[10px]">
                        <tr className="border-b border-slate-100">
                          <td className="p-2 border-r border-slate-900 text-center">1</td>
                          <td className="p-2 border-r border-slate-900">
                            <p className="font-bold">Samsung A30</p>
                            {invoiceSettings.showItemDescription && <p className="text-[9px] text-slate-400">samsung phone</p>}
                          </td>
                          <td className="p-2 border-r border-slate-900 text-center">1234</td>
                          {invoiceSettings.quantity && <td className="p-2 border-r border-slate-900 text-center">1 PCS</td>}
                          {invoiceSettings.pricePerItem && <td className="p-2 border-r border-slate-900 text-right">10,000</td>}
                          {invoiceSettings.batchNo && <td className="p-2 border-r border-slate-900 text-center">B-101</td>}
                          <td className="p-2 text-right font-bold">10,000</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="p-2 border-r border-slate-900 text-center">2</td>
                          <td className="p-2 border-r border-slate-900">
                            <p className="font-bold">Parle-G 200g</p>
                            {invoiceSettings.showItemDescription && <p className="text-[9px] text-slate-400">best biscuit</p>}
                          </td>
                          <td className="p-2 border-r border-slate-900 text-center">40511209</td>
                          {invoiceSettings.quantity && <td className="p-2 border-r border-slate-900 text-center">1 BOX</td>}
                          {invoiceSettings.pricePerItem && <td className="p-2 border-r border-slate-900 text-right">342.86</td>}
                          {invoiceSettings.batchNo && <td className="p-2 border-r border-slate-900 text-center">B-202</td>}
                          <td className="p-2 text-right font-bold">342.86</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Totals Section */}
                  <div className="flex border-x border-b border-slate-900">
                    <div className="flex-1 p-4 border-r border-slate-900">
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Total Amount (in words)</p>
                      <p className="text-[10px] font-black">Ten Thousand Three Hundred Forty Two Rupees</p>
                      {invoiceSettings.bankAccount !== 'Select Account' && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <p className="text-[8px] font-bold text-slate-400 uppercase">Bank Details</p>
                          <p className="text-[9px] font-bold">{invoiceSettings.bankAccount}</p>
                        </div>
                      )}
                    </div>
                    <div className="w-64">
                      <div className="grid grid-cols-2 border-b border-slate-900">
                        <div className="p-2 text-[9px] font-bold text-right border-r border-slate-900 italic">CGST @2.5%</div>
                        <div className="p-2 text-[10px] text-right font-bold">₹ 258.57</div>
                      </div>
                      <div className="grid grid-cols-2 border-b border-slate-900">
                        <div className="p-2 text-[9px] font-bold text-right border-r border-slate-900 italic">SGST @2.5%</div>
                        <div className="p-2 text-[10px] text-right font-bold">₹ 258.57</div>
                      </div>
                      <div className="grid grid-cols-2 border-b border-slate-900 bg-slate-50">
                        <div className="p-2 text-[10px] font-black text-right border-r border-slate-900">TOTAL</div>
                        <div className="p-2 text-[10px] text-right font-black">₹ 10,342.86</div>
                      </div>
                    </div>
                  </div>

                  {/* Notes & Terms */}
                  <div className="grid grid-cols-3 border-x border-b border-slate-900 min-h-[120px]">
                    <div className="p-4 border-r border-slate-900 space-y-1">
                      <p className="text-[9px] font-black text-indigo-600 uppercase">Notes</p>
                      <p className="text-[10px]">Sample Note</p>
                    </div>
                    <div className="p-4 border-r border-slate-900 space-y-1">
                      <p className="text-[9px] font-black text-slate-900 uppercase">Terms and Conditions</p>
                      <p className="text-[9px] leading-tight whitespace-pre-line">{invoiceSettings.terms}</p>
                    </div>
                    <div className="p-4 flex flex-col items-center justify-end text-center">
                      <div className="w-full border-t border-slate-200 pt-2">
                        {invoiceSettings.signature === 'Leave Empty Space' ? (
                          <div className="h-12 border-2 border-dashed border-slate-100 rounded mb-2"></div>
                        ) : (
                          <div className="h-12 flex items-center justify-center italic font-serif text-slate-400 mb-2">Signature</div>
                        )}
                        <p className="text-[9px] font-bold">Authorised Signatory For</p>
                        <p className="text-[10px] font-black">PS_infoTech</p>
                      </div>
                    </div>
                  </div>

                  {invoiceSettings.enableReceiverSignature && (
                    <div className="mt-8 flex justify-end">
                      <div className="w-48 border-t border-slate-900 pt-2 text-center">
                        <p className="text-[9px] font-bold uppercase">Receiver's Signature</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right: Settings Panel */}
          <div className="w-[400px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar">
              {/* Themes Section */}
              <div className="space-y-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-indigo-600 flex items-center justify-center">
                    <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-white">Themes</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'Advanced GST (Tally)', img: 'https://picsum.photos/seed/gst/100/140' },
                    { id: 'Luxury', img: 'https://picsum.photos/seed/luxury/100/140', isNew: true },
                    { id: 'Stylish', img: 'https://picsum.photos/seed/stylish/100/140' }
                  ].map((theme) => (
                    <motion.div
                      key={theme.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateSetting('theme', theme.id)}
                      className="space-y-2 group cursor-pointer"
                    >
                      <div className={`aspect-[3/4] rounded-lg border-2 overflow-hidden transition-all relative ${invoiceSettings.theme === theme.id ? 'border-indigo-600 shadow-md' : 'border-slate-100 group-hover:border-slate-200'}`}>
                        <img src={theme.img} className="w-full h-full object-cover" alt={theme.id} referrerPolicy="no-referrer" />
                        {theme.isNew && <span className="absolute top-1 left-1 bg-rose-500 text-white text-[7px] font-black px-1 py-0.5 rounded uppercase">New</span>}
                        {invoiceSettings.theme === theme.id && (
                          <div className="absolute inset-0 bg-indigo-600/10 flex items-center justify-center">
                            <CheckCircle2 className="h-8 w-8 text-indigo-600" />
                          </div>
                        )}
                      </div>
                      <p className={`text-[10px] text-center font-bold ${invoiceSettings.theme === theme.id ? 'text-indigo-600' : 'text-slate-400'}`}>{theme.id}</p>
                    </motion.div>
                  ))}
                  <div className="aspect-[3/4] rounded-lg border-2 border-slate-100 flex items-center justify-center text-blue-500 font-bold text-xs cursor-pointer hover:bg-slate-50">
                    See All
                  </div>
                </div>
              </div>

              {/* Theme Styling Section */}
              <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl space-y-4 border border-blue-100/50 dark:border-blue-800/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800 dark:text-white">Theme Styling</span>
                    <span className="bg-rose-500 text-white text-[8px] font-black px-1 py-0.5 rounded uppercase">New</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                  <Zap className="h-3 w-3 text-amber-500" />
                  Exclusive theme styling, available till 23-02-2026
                </div>
                <div className="flex flex-wrap gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSetting('showRamadan')}
                    className={`flex items-center gap-2 px-3 py-1.5 border-2 rounded-full text-[10px] font-bold transition-all ${invoiceSettings.showRamadan ? 'bg-white dark:bg-slate-800 border-indigo-600 text-slate-700 dark:text-slate-200' : 'bg-slate-100 border-transparent text-slate-400'}`}
                  >
                    <span className="text-emerald-500">🌙</span> Ramadan {invoiceSettings.showRamadan && <X className="h-3 w-3 ml-1" />}
                  </motion.button>
                  <button className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-bold text-slate-500">
                    Uttar Pradesh
                  </button>
                  <button className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-bold text-slate-500">
                    Maharashtra
                  </button>
                </div>
              </div>

              {/* Create Custom Theme */}
              <div className="py-4 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800">
                <div className="h-4 w-4 rounded-full border-2 border-slate-300"></div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Create Custom Theme</span>
                <HelpCircle className="h-3.5 w-3.5 text-slate-300" />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 dark:shadow-none transition-all mt-2"
              >
                Create your own theme
              </motion.button>

              {/* Accordion Sections */}
              <div className="pt-4">
                <AccordionSection title="Theme Settings" isNew>
                  {[
                    { label: 'Show party balance in invoice', key: 'showPartyBalance' },
                    { label: 'Enable free item quantity', key: 'enableFreeItemQty' },
                    { label: 'Show item description in invoice', key: 'showItemDescription' },
                    { label: 'Show Alternate Unit in Invoice', key: 'showAlternateUnit' },
                    { label: 'Show phone number on Invoice', key: 'showPhoneNumber' },
                    { label: 'Show time on Invoices', key: 'showTime', hasInfo: true },
                    { label: 'Price History', key: 'priceHistory', hasInfo: true },
                    { label: 'Auto-apply luxury theme for sharing', key: 'autoApplyLuxury' }
                  ].map((item) => (
                    <label key={item.label} className="flex items-center gap-3 cursor-pointer group">
                      <div
                        onClick={() => toggleSetting(item.key as any)}
                        className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-all ${invoiceSettings[item.key as keyof InvoiceSettings] ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200 group-hover:border-slate-300'}`}
                      >
                        {invoiceSettings[item.key as keyof InvoiceSettings] && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                      </div>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{item.label}</span>
                      {item.hasInfo && <HelpCircle className="h-3 w-3 text-slate-300" />}
                    </label>
                  ))}
                </AccordionSection>

                <AccordionSection title="Invoice Details">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice Prefix</label>
                        <input
                          type="text"
                          value={invoiceSettings.invoicePrefix}
                          onChange={(e) => updateSetting('invoicePrefix', e.target.value)}
                          className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-medium outline-none dark:bg-slate-800"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Starting Number</label>
                        <input
                          type="number"
                          value={invoiceSettings.startingNumber}
                          onChange={(e) => updateSetting('startingNumber', parseInt(e.target.value) || 1)}
                          className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-medium outline-none dark:bg-slate-800"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Industry Type</label>
                      <div className="relative">
                        <select
                          value={invoiceSettings.selectedIndustry}
                          onChange={(e) => updateSetting('selectedIndustry', e.target.value)}
                          className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium outline-none dark:bg-slate-800 appearance-none"
                        >
                          <option>Select</option>
                          <option>Retail</option>
                          <option>Wholesale</option>
                          <option>Services</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: 'PO Number', key: 'poNumber' },
                        { label: 'E-way Bill Number', key: 'ewayBill' },
                        { label: 'Vehicle Number', key: 'vehicleNumber' }
                      ].map(item => (
                        <label key={item.label} className="flex items-center gap-3 cursor-pointer group">
                          <div
                            onClick={() => toggleSetting(item.key as any)}
                            className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-all ${invoiceSettings[item.key as keyof InvoiceSettings] ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200 group-hover:border-slate-300'}`}
                          >
                            {invoiceSettings[item.key as keyof InvoiceSettings] && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                          </div>
                          <span className="text-xs font-medium text-slate-600">{item.label}</span>
                        </label>
                      ))}
                    </div>
                    <button className="text-xs font-bold text-blue-500">+ Add Custom Field</button>
                  </div>
                </AccordionSection>

                <AccordionSection title="Item Table Columns">
                  <div className="space-y-3">
                    {[
                      { label: 'Price/Item (₹)', key: 'pricePerItem' },
                      { label: 'Quantity', key: 'quantity' },
                      { label: 'Batch No.', key: 'batchNo' },
                      { label: 'Exp. Date', key: 'expDate' },
                      { label: 'Mfg Date', key: 'mfgDate' }
                    ].map((item) => (
                      <label key={item.label} className="flex items-center gap-3 cursor-pointer group">
                        <div
                          onClick={() => toggleSetting(item.key as any)}
                          className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-all ${invoiceSettings[item.key as keyof InvoiceSettings] ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200 group-hover:border-slate-300'}`}
                        >
                          {invoiceSettings[item.key as keyof InvoiceSettings] && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                        </div>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{item.label}</span>
                      </label>
                    ))}
                    <button className="text-xs font-bold text-blue-500 pt-2">+ Add Custom Column</button>
                  </div>
                </AccordionSection>

                <AccordionSection title="Miscellaneous Details" isNew>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bank Account</label>
                      <div className="relative">
                        <select
                          value={invoiceSettings.bankAccount}
                          onChange={(e) => updateSetting('bankAccount', e.target.value)}
                          className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium outline-none dark:bg-slate-800 appearance-none"
                        >
                          <option>Select Account</option>
                          <option>HDFC Bank - 50100234...</option>
                          <option>ICICI Bank - 00020156...</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Terms and Conditions</label>
                      <div className="relative">
                        <select className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm font-medium outline-none dark:bg-slate-800 appearance-none mb-2">
                          <option>Sales Invoices</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      </div>
                      <textarea
                        value={invoiceSettings.terms}
                        onChange={(e) => updateSetting('terms', e.target.value)}
                        className="w-full h-24 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-[10px] font-medium outline-none focus:border-indigo-500 dark:bg-slate-800 resize-none"
                      ></textarea>
                      <button className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-lg text-[10px] font-bold">Save</button>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Signature</label>
                      <div className="relative">
                        <select
                          value={invoiceSettings.signature}
                          onChange={(e) => updateSetting('signature', e.target.value)}
                          className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium outline-none dark:bg-slate-800 appearance-none"
                        >
                          <option>Leave Empty Space</option>
                          <option>Digital Signature</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div
                        onClick={() => toggleSetting('enableReceiverSignature')}
                        className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-all ${invoiceSettings.enableReceiverSignature ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200 group-hover:border-slate-300'}`}
                      >
                        {invoiceSettings.enableReceiverSignature && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                      </div>
                      <span className="text-xs font-medium text-slate-600">Enable receiver's signature field on invoice</span>
                    </label>
                  </div>
                </AccordionSection>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex">
      {/* Settings Left Sidebar */}
      <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className="h-10 w-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-black">
            P
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-white">PS_infoTech</p>
            <p className="text-[10px] text-slate-400 font-bold">9359850496</p>
          </div>
        </div>

        <div className="p-4">
          <button
            onClick={onBack}
            className="w-full flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </button>
        </div>

        <nav className="flex-1 px-2 space-y-1">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-lg transition-all ${activeSection === item.id
                ? 'bg-indigo-500/80 text-white font-bold shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
            >
              <item.icon className={`h-4 w-4 ${activeSection === item.id ? 'text-white' : 'text-slate-400'}`} />
              <span className="text-xs font-medium">{item.id}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <p className="text-[10px] font-bold text-slate-400">App Version : 8.96.1</p>
          <div className="flex items-center gap-4 opacity-60">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              <span className="text-[8px] font-black uppercase">100% Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-500" />
              <span className="text-[8px] font-black uppercase">ISO Certified</span>
            </div>
          </div>
          <div className="pt-4 flex items-center gap-2 grayscale opacity-40">
            <span className="text-[10px] font-black italic">myBillBook</span>
            <span className="text-[8px] text-slate-400">by</span>
            <span className="text-[10px] font-black text-indigo-600">flobiz</span>
          </div>
        </div>
      </div>

      {/* Settings Main Content Area */}
      <div className="flex-1 bg-slate-50 dark:bg-slate-950 overflow-y-auto custom-scrollbar p-8">
        {activeSection === 'Account' ? (
          <AccountSettingsView />
        ) : activeSection === 'Manage Business' ? (
          <ManageBusinessView />
        ) : activeSection === 'Invoice Settings' ? (
          <InvoiceSettingsView />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="p-8 bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800">
              <SettingsIcon className="h-16 w-16 text-slate-200 dark:text-slate-800 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{activeSection}</h3>
              <p className="text-slate-500 max-w-sm mx-auto">This sub-module is being standardized for the unified BI interface.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;