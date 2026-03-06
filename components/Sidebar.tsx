import React from 'react';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  FileText,
  Settings,
  Wallet,
  LogOut,
  ChevronRight,
  Store,
  Receipt,
  BookOpen,
  CircleDollarSign
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { TranslationKey } from '../i18n/translations';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const { t } = useLanguage();

  const menuGroups = [
    {
      label: t('overview'),
      items: [
        { id: 'executive', label: t('dashboard'), icon: LayoutDashboard },
        { id: 'reports', label: t('reportLibrary'), icon: BarChart3 },
      ]
    },
    {
      label: t('business'),
      items: [
        { id: 'gst-invoice', label: t('gstBilling'), icon: Receipt },
        { id: 'pos', label: t('posTerminal'), icon: ShoppingCart },
        { id: 'b2b', label: t('b2bMarketplace'), icon: Store },
      ]
    },
    {
      label: t('records'),
      items: [
        { id: 'ledger', label: t('customerLedger'), icon: BookOpen },
        { id: 'products', label: t('inventory'), icon: Package },
        { id: 'expenses', label: t('expenses'), icon: Wallet },
      ]
    },
    {
      label: t('channels'),
      items: [
        { id: 'online-store', label: t('digitalStore'), icon: Store },
        { id: 'sales', label: t('analytics'), icon: BarChart3 },
      ]
    },
  ];

  return (
    <div className="w-[280px] bg-white dark:bg-slate-900 h-screen flex flex-col border-r border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="p-8 flex items-center gap-3">
        <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
          <BarChart3 className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">Vyaparmitra</h1>
      </div>

      <nav className="flex-1 px-4 overflow-y-auto no-scrollbar pt-2">
        {menuGroups.map((group, groupIdx) => (
          <div key={group.label} className={groupIdx > 0 ? 'mt-6' : ''}>
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-300 dark:text-slate-600 px-4 mb-2">{group.label}</p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all group ${activePage === item.id
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-indigo-500/10'
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                >
                  <item.icon className={`h-[18px] w-[18px] ${activePage === item.id ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`} />
                  <span className={`text-[13px] font-bold ${activePage === item.id ? 'text-white' : ''}`}>{item.label}</span>
                  {activePage === item.id && <ChevronRight className="h-4 w-4 ml-auto" />}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 space-y-1 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => setActivePage('settings')}
          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all ${activePage === 'settings' ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'} text-[13px] font-bold`}
        >
          <Settings className="h-[18px] w-[18px]" />
          <span>{t('settings')}</span>
        </button>
        <button
          onClick={() => setActivePage('logout')}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all font-bold text-[13px]"
        >
          <LogOut className="h-[18px] w-[18px]" />
          <span>{t('signOut')}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;