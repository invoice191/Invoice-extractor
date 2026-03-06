
import React, { useState, useEffect, useCallback } from 'react';
import { Search, FileText, LayoutDashboard, ShoppingCart, Users, Package, BarChart3, Wallet, Settings, Receipt, BookOpen, Database, Truck, Store, ExternalLink } from 'lucide-react';

interface CommandPaletteProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onNavigate: (page: string) => void;
}

const PAGES = [
    { id: 'executive', name: 'Executive Summary', icon: LayoutDashboard, category: 'Main' },
    { id: 'pos', name: 'POS Terminal', icon: ShoppingCart, category: 'Operations' },
    { id: 'gst-invoice', name: 'GST Billing', icon: Receipt, category: 'Operations' },
    { id: 'invoices', name: 'Invoice History', icon: BookOpen, category: 'Records' },
    { id: 'customers', name: 'Parties & Customers', icon: Users, category: 'Main' },
    { id: 'products', name: 'Items & Inventory', icon: Package, category: 'Stock' },
    { id: 'inventory', name: 'Inventory Logistics', icon: Truck, category: 'Stock' },
    { id: 'sales', name: 'Sales Analytics', icon: BarChart3, category: 'Main' },
    { id: 'financial', name: 'Financial Health', icon: Wallet, category: 'Main' },
    { id: 'expenses', name: 'Expense Tracker', icon: ExternalLink, category: 'Operations' },
    { id: 'ledger', name: 'Customer Ledger', icon: BookOpen, category: 'Records' },
    { id: 'online-store', name: 'Digital Store', icon: Store, category: 'Operations' },
    { id: 'b2b', name: 'B2B Marketplace', icon: ShoppingCart, category: 'Operations' },
    { id: 'reports', name: 'Report Library', icon: BarChart3, category: 'Records' },
    { id: 'data-mgmt', name: 'Data Management', icon: Database, category: 'System' },
    { id: 'settings', name: 'Account Settings', icon: Settings, category: 'System' },
];

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, setIsOpen, onNavigate }) => {
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);

    const filteredPages = PAGES.filter(page =>
        page.name.toLowerCase().includes(search.toLowerCase()) ||
        page.category.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        setSelectedIndex(0);
    }, [search]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            setIsOpen(!isOpen);
        }

        if (!isOpen) return;

        if (e.key === 'Escape') {
            setIsOpen(false);
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filteredPages.length);
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filteredPages.length) % filteredPages.length);
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredPages[selectedIndex]) {
                onNavigate(filteredPages[selectedIndex].id);
                setIsOpen(false);
                setSearch('');
            }
        }
    }, [isOpen, setIsOpen, filteredPages, selectedIndex, onNavigate]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 pointer-events-none">
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm pointer-events-auto" onClick={() => setIsOpen(false)}></div>

            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden pointer-events-auto animate-slide-up">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
                    <Search className="h-6 w-6 text-slate-400" />
                    <input
                        autoFocus
                        placeholder="Search for pages, reports, or tools... (Esc to close)"
                        className="flex-1 bg-transparent border-none outline-none text-lg font-bold text-slate-800 dark:text-white placeholder:text-slate-400"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <div className="flex gap-1.5">
                        <kbd className="px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg text-[10px] font-black text-slate-400 border border-slate-100 dark:border-slate-700">ESC</kbd>
                    </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                    {filteredPages.length === 0 ? (
                        <div className="py-12 text-center text-slate-400">
                            <Search className="h-12 w-12 mx-auto mb-3 opacity-20" />
                            <p className="font-bold">No results found for "{search}"</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {['Main', 'Operations', 'Stock', 'Records', 'System'].map(category => {
                                const categoryPages = filteredPages.filter(p => p.category === category);
                                if (categoryPages.length === 0) return null;

                                return (
                                    <div key={category} className="space-y-2">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4 mb-2">{category}</h4>
                                        <div className="space-y-1">
                                            {categoryPages.map(page => {
                                                const globalIndex = filteredPages.indexOf(page);
                                                const isActive = globalIndex === selectedIndex;
                                                const Icon = page.icon;

                                                return (
                                                    <button
                                                        key={page.id}
                                                        onClick={() => {
                                                            onNavigate(page.id);
                                                            setIsOpen(false);
                                                            setSearch('');
                                                        }}
                                                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all text-left ${isActive
                                                                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-none translate-x-1'
                                                                : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                                                            }`}
                                                    >
                                                        <div className={`p-2 rounded-xl ${isActive ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                                            <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-black text-sm">{page.name}</p>
                                                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>
                                                                {page.category}
                                                            </p>
                                                        </div>
                                                        {isActive && <div className="text-[10px] font-black uppercase tracking-widest opacity-80">Enter</div>}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-[9px] font-black text-slate-500">↑</kbd>
                                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-[9px] font-black text-slate-500">↓</kbd>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">Navigate</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-[9px] font-black text-slate-500">Enter</kbd>
                            <span className="text-[10px] font-bold text-slate-400">Select</span>
                        </div>
                    </div>
                    <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
                        Unified Search
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
