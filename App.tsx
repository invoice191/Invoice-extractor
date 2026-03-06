
import React, { useState, useRef, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import CommandPalette from './components/CommandPalette';
import DashboardExecutive from './pages/DashboardExecutive';
import DashboardInventory from './pages/DashboardInventory';
import DashboardCustomers from './pages/DashboardCustomers';
import DashboardProducts from './pages/DashboardProducts';
import DashboardSales from './pages/DashboardSales';
import DashboardFinancial from './pages/DashboardFinancial';
import DashboardPOS from './pages/DashboardPOS';
import B2BMarketplace from './pages/B2BMarketplace';
import PartnerDirectory from './pages/PartnerDirectory';
import Invoices from './pages/Invoices';
import ReportsLibrary from './pages/ReportsLibrary';
import DataManagement from './pages/DataManagement';
import Settings from './pages/Settings';
import LandingPage from './pages/LandingPage';
import GSTInvoicePage from './pages/GSTInvoice';
import CustomerLedger from './pages/CustomerLedger';
import ExpenseTracker from './pages/ExpenseTracker';
import OnlineStore from './pages/OnlineStore';
import {
  Bell,
  Menu,
  Moon,
  Sun,
  Scan,
  X,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { initialInvoices } from './data/mockData';
import { Invoice } from './types';
import { useLanguage } from './context/LanguageContext';
import { Language } from './i18n/translations';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState('landing');
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsScanning(true);
      setTimeout(() => {
        const newInvoice: Invoice = {
          id: `INV-SCAN-${Math.floor(1000 + Math.random() * 9000)}`,
          customerName: 'Scanned Customer',
          date: new Date().toISOString().split('T')[0],
          amount: Math.floor(500 + Math.random() * 5000),
          status: 'Unpaid',
          items: 1,
          taxAmount: 90
        };
        setInvoices([newInvoice, ...invoices]);
        setIsScanning(false);
        setIsScanModalOpen(false);
        setActivePage('invoices');
      }, 2000);
    }
  };

  const pageMeta = useMemo(() => {
    switch (activePage) {
      case 'executive': return { title: t('executiveSummary'), sub: 'Unified business performance and AI insights' };
      case 'pos': return { title: t('posTerminal'), sub: 'Active sales console and billing' };
      case 'b2b': return { title: t('b2bMarketplace'), sub: 'Bulk sourcing and partner catalog' };
      case 'customers': return { title: t('partiesCustomers'), sub: 'Manage customer segments and credit' };
      case 'products': return { title: t('itemsInventory'), sub: 'Track SKU levels and product health' };
      case 'inventory': return { title: t('inventoryLogistics'), sub: 'Warehouse tracking and supply chain' };
      case 'sales': return { title: t('salesAnalytics'), sub: 'Revenue trends and conversion monitoring' };
      case 'financial': return { title: t('financialHealth'), sub: 'P&L statements and tax provisions' };
      case 'invoices': return { title: t('invoiceHistory'), sub: 'Search and manage generated bills' };
      case 'reports': return { title: t('reportLibrary'), sub: 'Generate custom business audits' };
      case 'settings': return { title: t('accountSettings'), sub: 'Manage Your Account And Subscription' };
      case 'data-mgmt': return { title: t('dataManagement'), sub: 'Sync logs and manual record entry' };
      case 'gst-invoice': return { title: t('gstBilling'), sub: 'Create GST-compliant invoices and quotations' };
      case 'ledger': return { title: t('customerLedger'), sub: 'Track credit, payments and customer balances' };
      case 'expenses': return { title: t('expenseTracker'), sub: 'Manage business overheads and cash outflows' };
      case 'online-store': return { title: t('digitalStore'), sub: 'Manage your shareable online catalog' };
      default: return { title: t('dashboard'), sub: 'Business Intelligence Overview' };
    }
  }, [activePage]);

  const renderContent = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activePage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full"
        >
          {(() => {
            switch (activePage) {
              case 'landing': return <LandingPage onStart={() => setActivePage('executive')} onNavigateToDirectory={() => setActivePage('partner-directory')} />;
              case 'partner-directory': return <PartnerDirectory onBack={() => setActivePage('landing')} onSelectShop={() => setActivePage('b2b')} />;
              case 'pos': return <DashboardPOS />;
              case 'executive': return <DashboardExecutive onNavigate={(page: string) => setActivePage(page)} />;
              case 'b2b': return <B2BMarketplace />;
              case 'customers': return <DashboardCustomers />;
              case 'products': return <DashboardProducts />;
              case 'inventory': return <DashboardInventory />;
              case 'sales': return <DashboardSales />;
              case 'financial': return <DashboardFinancial />;
              case 'invoices': return <Invoices invoices={invoices} />;
              case 'reports': return <ReportsLibrary />;
              case 'settings': return <Settings onBack={() => setActivePage('executive')} />;
              case 'data-mgmt': return <DataManagement />;
              case 'gst-invoice': return <GSTInvoicePage />;
              case 'ledger': return <CustomerLedger />;
              case 'expenses': return <ExpenseTracker />;
              case 'online-store': return <OnlineStore />;
              default: return <DashboardExecutive />;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

  if (activePage === 'landing' || activePage === 'partner-directory' || activePage === 'settings') return renderContent();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-500">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-50`}>
        <Sidebar activePage={activePage} setActivePage={(page) => {
          setActivePage(page);
          setIsSidebarOpen(false);
        }} />
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        setIsOpen={setIsCommandPaletteOpen}
        onNavigate={(page) => setActivePage(page)}
      />

      {/* Main Content Container */}
      <div className="flex-1 lg:ml-[280px] min-w-0 flex flex-col">
        <header className="h-[90px] bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 px-8 flex items-center justify-between transition-colors">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
            >
              <Menu className="h-6 w-6 text-slate-600 dark:text-slate-300" />
            </button>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{pageMeta.title}</h2>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold mt-0.5 tracking-wide uppercase">{pageMeta.sub}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Language Toggle */}
            <div className="flex items-center bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-700">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-xl transition-all text-[10px] font-black tracking-tight ${language === 'en' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-400'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1.5 rounded-xl transition-all text-[10px] font-black tracking-tight ${language === 'hi' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-400'}`}
              >
                हिं
              </button>
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>

            {/* Theme Toggle */}
            <div className="flex items-center bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-700">
              <button
                onClick={() => setIsDarkMode(false)}
                className={`p-2 rounded-xl transition-all ${!isDarkMode ? 'bg-white text-amber-500 shadow-sm' : 'text-slate-400'}`}
              >
                <Sun className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsDarkMode(true)}
                className={`p-2 rounded-xl transition-all ${isDarkMode ? 'bg-slate-700 text-blue-400 shadow-sm' : 'text-slate-400'}`}
              >
                <Moon className="h-4 w-4" />
              </button>
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>

            <div className="flex items-center gap-3">
              <button className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all border border-slate-100 dark:border-slate-700">
                <Bell className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsScanModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 dark:shadow-none transition-all active:scale-95"
              >
                <Scan className="h-4 w-4" /> {t('smartScan')}
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 bg-[#fbfcfd] dark:bg-[#020617] min-h-[calc(100vh-90px)] overflow-x-hidden">
          <div className="max-w-[1400px] mx-auto animate-fade-in">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Intelligence Scan Modal */}
      {isScanModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isScanning && setIsScanModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up border border-slate-100 dark:border-slate-800">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Intelligence Scan</h3>
              </div>
              <button onClick={() => !isScanning && setIsScanModalOpen(false)} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full text-slate-400">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-10 space-y-8 text-center">
              {isScanning ? (
                <div className="py-10 space-y-4">
                  <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="font-bold text-slate-600 dark:text-slate-400">Processing Document...</p>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-12 hover:border-indigo-400 cursor-pointer transition-all"
                >
                  <Upload className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                  <p className="font-bold text-slate-500">Upload Receipt</p>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

