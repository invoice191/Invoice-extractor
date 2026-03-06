import React, { useState, useMemo } from 'react';
import {
    Users, Search, Plus, X, Phone, MapPin, CreditCard, TrendingUp, TrendingDown,
    ArrowUpRight, ArrowDownRight, CheckCircle2, AlertCircle, MessageCircle,
    IndianRupee, ChevronRight, Calendar, Filter, Eye, Download
} from 'lucide-react';
import { CustomerAccount, CustomerLedgerEntry } from '../types';
import { dbService } from '../services/database';
import { supabase } from '../lib/supabase';

const CustomerLedger: React.FC = () => {
    const [accounts, setAccounts] = useState<CustomerAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAccount, setSelectedAccount] = useState<CustomerAccount | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [showAddEntry, setShowAddEntry] = useState(false);
    const [showEditCustomer, setShowEditCustomer] = useState(false);
    const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

    React.useEffect(() => {
        fetchAccounts();

        const channels = [
            supabase.channel('ledger-customers').on('postgres_changes',
                { event: '*', schema: 'public', table: 'customers' },
                () => fetchAccounts()
            ),
            supabase.channel('ledger-entries').on('postgres_changes',
                { event: '*', schema: 'public', table: 'ledger_entries' },
                () => fetchAccounts()
            ),
        ];
        channels.forEach(ch => ch.subscribe());

        return () => {
            channels.forEach(ch => supabase.removeChannel(ch));
        };
    }, []);

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const data = await dbService.getCustomers();
            setAccounts(data as any);
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    // Add/Edit customer form state
    const [newName, setNewName] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [newCreditLimit, setNewCreditLimit] = useState(25000);

    // Add entry form state
    const [entryType, setEntryType] = useState<'credit' | 'payment'>('credit');
    const [entryDesc, setEntryDesc] = useState('');
    const [entryAmount, setEntryAmount] = useState(0);

    const filteredAccounts = useMemo(() => {
        return accounts.filter(a =>
            a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.phone.includes(searchQuery)
        ).sort((a, b) => b.currentBalance - a.currentBalance);
    }, [accounts, searchQuery]);

    const filteredEntries = useMemo(() => {
        if (!selectedAccount) return [];
        return selectedAccount.entries.filter(e => {
            if (!dateFilter.start && !dateFilter.end) return true;
            if (dateFilter.start && e.date < dateFilter.start) return false;
            if (dateFilter.end && e.date > dateFilter.end) return false;
            return true;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [selectedAccount, dateFilter]);

    const totalReceivable = useMemo(() => accounts.reduce((sum, a) => sum + a.currentBalance, 0), [accounts]);

    const handleAddCustomer = async () => {
        if (!newName || !newPhone) return;
        try {
            const newCustomer: Partial<CustomerAccount> = {
                name: newName,
                phone: newPhone,
                address: newAddress,
                creditLimit: newCreditLimit,
                currentBalance: 0,
                totalPurchases: 0,
                lastTransactionDate: new Date().toISOString().split('T')[0]
            };
            await dbService.addCustomer(newCustomer);
            await fetchAccounts();
            setNewName(''); setNewPhone(''); setNewAddress(''); setNewCreditLimit(25000);
            setShowAddForm(false);
        } catch (error) {
            console.error('Error adding customer:', error);
        }
    };

    const handleAddEntry = async () => {
        if (!selectedAccount || !entryDesc || entryAmount <= 0) return;
        try {
            const balanceChange = entryType === 'credit' ? entryAmount : -entryAmount;
            const newBalance = (selectedAccount.currentBalance || 0) + balanceChange;

            const newEntry = {
                customer_id: selectedAccount.id,
                date: new Date().toISOString().split('T')[0],
                type: entryType,
                description: entryDesc,
                amount: entryAmount,
                balance: Math.max(0, newBalance)
            };

            await dbService.addLedgerEntry(newEntry);
            await fetchAccounts();
            // Refresh selected account if needed
            const updated = accounts.find(a => a.id === selectedAccount.id);
            if (updated) setSelectedAccount(updated);

            setEntryDesc(''); setEntryAmount(0); setShowAddEntry(false);
        } catch (error) {
            console.error('Error adding entry:', error);
        }
    };

    const handleEditCustomer = () => {
        if (!selectedAccount || !newName || !newPhone) return;
        const updated = { ...selectedAccount, name: newName, phone: newPhone, address: newAddress, creditLimit: newCreditLimit };
        setAccounts(accounts.map(a => a.id === selectedAccount.id ? updated : a));
        setSelectedAccount(updated);
        setShowEditCustomer(false);
    };

    const handleDeleteCustomer = (id: string) => {
        if (window.confirm('Are you sure you want to delete this customer? All ledger entries will be lost.')) {
            setAccounts(accounts.filter(a => a.id !== id));
            setSelectedAccount(null);
        }
    };

    const handleDeleteEntry = (entryId: string) => {
        if (!selectedAccount) return;
        const entryToDelete = selectedAccount.entries.find(e => e.id === entryId);
        if (!entryToDelete) return;

        const balanceChange = entryToDelete.type === 'credit' ? -entryToDelete.amount : entryToDelete.amount;
        const updatedEntries = selectedAccount.entries.filter(e => e.id !== entryId);

        const updatedAccount = {
            ...selectedAccount,
            currentBalance: Math.max(0, selectedAccount.currentBalance + balanceChange),
            entries: updatedEntries,
            totalPurchases: entryToDelete.type === 'credit' ? selectedAccount.totalPurchases - entryToDelete.amount : selectedAccount.totalPurchases
        };

        setAccounts(accounts.map(a => a.id === selectedAccount.id ? updatedAccount : a));
        setSelectedAccount(updatedAccount);
    };

    const sendWhatsAppReminder = (account: CustomerAccount) => {
        const message = `Hi ${account.name}, this is a payment reminder from Vyaparmitra Store. Your current outstanding balance is ₹${account.currentBalance.toLocaleString('en-IN')}. Kindly clear the dues at your earliest convenience. Thank you!`;
        window.open(`https://wa.me/91${account.phone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    // Ledger Detail View
    if (selectedAccount) {
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSelectedAccount(null)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                            <ChevronRight className="h-5 w-5 text-slate-500 rotate-180" />
                        </button>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{selectedAccount.name}</h2>
                            <p className="text-slate-500 text-sm flex items-center gap-2">
                                <Phone className="h-3 w-3" /> {selectedAccount.phone}
                                {selectedAccount.address && <><span className="mx-1">•</span><MapPin className="h-3 w-3" /> {selectedAccount.address}</>}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => {
                            setNewName(selectedAccount.name);
                            setNewPhone(selectedAccount.phone);
                            setNewAddress(selectedAccount.address || '');
                            setNewCreditLimit(selectedAccount.creditLimit);
                            setShowEditCustomer(true);
                        }} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                            <Filter className="h-4 w-4 text-slate-500" />
                        </button>
                        {selectedAccount.currentBalance > 0 && (
                            <button onClick={() => sendWhatsAppReminder(selectedAccount)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95">
                                <MessageCircle className="h-4 w-4" /> Reminder
                            </button>
                        )}
                        <button onClick={() => setShowAddEntry(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95">
                            <Plus className="h-4 w-4" /> Add Entry
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className={`rounded-2xl border p-5 ${selectedAccount.currentBalance > 0 ? 'bg-amber-50 dark:bg-amber-500/5 border-amber-100 dark:border-amber-500/10' : 'bg-emerald-50 dark:bg-emerald-500/5 border-emerald-100 dark:border-emerald-500/10'}`}>
                        <p className="text-xs font-bold text-slate-400 uppercase">Current Balance</p>
                        <p className={`text-2xl font-black mt-1 ${selectedAccount.currentBalance > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                            ₹{selectedAccount.currentBalance.toLocaleString('en-IN')}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                        <p className="text-xs font-bold text-slate-400 uppercase">Credit Limit</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">₹{selectedAccount.creditLimit.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                        <p className="text-xs font-bold text-slate-400 uppercase">Total Purchases</p>
                        <p className="text-2xl font-black text-indigo-600 mt-1">₹{selectedAccount.totalPurchases.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                        <p className="text-xs font-bold text-slate-400 uppercase">Available Credit</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">₹{Math.max(0, selectedAccount.creditLimit - selectedAccount.currentBalance).toLocaleString('en-IN')}</p>
                    </div>
                </div>

                {/* Add Entry Modal */}
                {showAddEntry && (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-indigo-200 dark:border-indigo-500/20 p-6 shadow-xl">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-4">Add Ledger Entry</h3>
                        <div className="flex gap-3 mb-4">
                            <button onClick={() => setEntryType('credit')}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${entryType === 'credit' ? 'bg-rose-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                <ArrowUpRight className="h-4 w-4 inline mr-1" /> Sale (Credit)
                            </button>
                            <button onClick={() => setEntryType('payment')}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${entryType === 'payment' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                <ArrowDownRight className="h-4 w-4 inline mr-1" /> Payment Received
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input placeholder="Description" value={entryDesc} onChange={e => setEntryDesc(e.target.value)}
                                className="col-span-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500" />
                            <input type="number" placeholder="Amount ₹" value={entryAmount || ''} onChange={e => setEntryAmount(Number(e.target.value))}
                                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div className="flex gap-3 mt-4 justify-end">
                            <button onClick={() => setShowAddEntry(false)} className="px-5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm">Cancel</button>
                            <button onClick={handleAddEntry} disabled={!entryDesc || entryAmount <= 0}
                                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm disabled:opacity-50 transition-all">Save Entry</button>
                        </div>
                    </div>
                )}

                {/* Edit Customer Modal */}
                {showEditCustomer && (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-indigo-200 dark:border-indigo-500/20 p-6 shadow-xl mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-800 dark:text-white">Edit Customer Profile</h3>
                            <button onClick={() => handleDeleteCustomer(selectedAccount.id)} className="text-xs font-bold text-rose-600 hover:underline">Delete Customer</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input placeholder="Customer Name *" value={newName} onChange={e => setNewName(e.target.value)}
                                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                            <input placeholder="Phone *" value={newPhone} onChange={e => setNewPhone(e.target.value)}
                                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                            <input placeholder="Address" value={newAddress} onChange={e => setNewAddress(e.target.value)}
                                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                            <input type="number" placeholder="Credit Limit ₹" value={newCreditLimit} onChange={e => setNewCreditLimit(Number(e.target.value))}
                                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div className="flex gap-3 mt-4 justify-end">
                            <button onClick={() => setShowEditCustomer(false)} className="px-5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm">Cancel</button>
                            <button onClick={handleEditCustomer} className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm">Update Profile</button>
                        </div>
                    </div>
                )}

                {/* Date Filter & Table Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <input type="date" value={dateFilter.start} onChange={e => setDateFilter({ ...dateFilter, start: e.target.value })}
                            className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-slate-600 outline-none" />
                        <span className="text-slate-400 font-bold">to</span>
                        <input type="date" value={dateFilter.end} onChange={e => setDateFilter({ ...dateFilter, end: e.target.value })}
                            className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-slate-600 outline-none" />
                        {(dateFilter.start || dateFilter.end) && (
                            <button onClick={() => setDateFilter({ start: '', end: '' })} className="text-[10px] font-black text-rose-500 uppercase">Clear</button>
                        )}
                    </div>
                    <button onClick={() => window.print()} className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-1 hover:underline">
                        <Download className="h-3 w-3" /> Download Statement
                    </button>
                </div>

                {/* Ledger Table */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                                <th className="text-left p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="text-left p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                                <th className="text-left p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                <th className="text-right p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                <th className="text-right p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Balance</th>
                                <th className="text-right p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEntries.map(entry => (
                                <tr key={entry.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4 text-xs font-bold text-slate-500">{entry.date}</td>
                                    <td className="p-4 text-sm font-bold text-slate-800 dark:text-white">{entry.description}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${entry.type === 'credit' ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' :
                                            'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                                            }`}>
                                            {entry.type === 'credit' ? 'Sale' : 'Payment'}
                                        </span>
                                    </td>
                                    <td className={`p-4 text-right text-sm font-black ${entry.type === 'credit' ? 'text-rose-600' : 'text-emerald-600'}`}>
                                        {entry.type === 'credit' ? '+' : '-'}₹{entry.amount.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-4 text-right text-sm font-black text-slate-900 dark:text-white">₹{entry.balance.toLocaleString('en-IN')}</td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleDeleteEntry(entry.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredEntries.length === 0 && (
                                <tr><td colSpan={6} className="p-12 text-center text-slate-400 font-bold">No entries found for selected period</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // Customer List View
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Customer Ledger</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Khata Book — Track credit, payments & balances</p>
                </div>
                <button onClick={() => setShowAddForm(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95">
                    <Plus className="h-4 w-4" /> Add Customer
                </button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                    <p className="text-xs font-bold text-slate-400 uppercase">Total Customers</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{accounts.length}</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-500/5 rounded-2xl border border-amber-100 dark:border-amber-500/10 p-5">
                    <p className="text-xs font-bold text-amber-500 uppercase">Total Receivable</p>
                    <p className="text-2xl font-black text-amber-600 mt-1">₹{totalReceivable.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-rose-50 dark:bg-rose-500/5 rounded-2xl border border-rose-100 dark:border-rose-500/10 p-5">
                    <p className="text-xs font-bold text-rose-500 uppercase">Over Credit Limit</p>
                    <p className="text-2xl font-black text-rose-600 mt-1">{accounts.filter(a => a.currentBalance > a.creditLimit).length}</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input placeholder="Search by name or phone..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-700 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            {/* Add Customer Form */}
            {showAddForm && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-indigo-200 dark:border-indigo-500/20 p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-800 dark:text-white">Add New Customer</h3>
                        <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><X className="h-4 w-4 text-slate-400" /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input placeholder="Customer Name *" value={newName} onChange={e => setNewName(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500" />
                        <input placeholder="Phone *" value={newPhone} onChange={e => setNewPhone(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500" />
                        <input placeholder="Address" value={newAddress} onChange={e => setNewAddress(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500" />
                        <input type="number" placeholder="Credit Limit ₹" value={newCreditLimit} onChange={e => setNewCreditLimit(Number(e.target.value))}
                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="flex gap-3 mt-4 justify-end">
                        <button onClick={() => setShowAddForm(false)} className="px-5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm">Cancel</button>
                        <button onClick={handleAddCustomer} disabled={!newName || !newPhone}
                            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm disabled:opacity-50 transition-all">Add Customer</button>
                    </div>
                </div>
            )}

            {/* Customer Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAccounts.map(account => (
                    <div key={account.id}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-500/20 transition-all cursor-pointer group"
                        onClick={() => setSelectedAccount(account)}>
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-white text-lg group-hover:text-indigo-600 transition-colors">{account.name}</h3>
                                <p className="text-xs text-slate-400 flex items-center gap-1"><Phone className="h-3 w-3" /> {account.phone}</p>
                            </div>
                            <div className={`text-right px-3 py-1.5 rounded-xl ${account.currentBalance > account.creditLimit ? 'bg-rose-50 dark:bg-rose-500/10' :
                                account.currentBalance > 0 ? 'bg-amber-50 dark:bg-amber-500/10' :
                                    'bg-emerald-50 dark:bg-emerald-500/10'
                                }`}>
                                <p className="text-[10px] font-bold text-slate-400">Balance</p>
                                <p className={`text-lg font-black ${account.currentBalance > account.creditLimit ? 'text-rose-600' :
                                    account.currentBalance > 0 ? 'text-amber-600' : 'text-emerald-600'
                                    }`}>₹{account.currentBalance.toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-xs text-slate-400">
                            <span>Total: ₹{account.totalPurchases.toLocaleString('en-IN')}</span>
                            <span>Credit limit: ₹{account.creditLimit.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                            <span className="text-xs text-slate-400">Last: {account.lastTransactionDate}</span>
                            <div className="flex gap-2">
                                {account.currentBalance > 0 && (
                                    <button onClick={(e) => { e.stopPropagation(); sendWhatsAppReminder(account); }}
                                        className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 transition-all" title="Send WhatsApp Reminder">
                                        <MessageCircle className="h-4 w-4" />
                                    </button>
                                )}
                                <button className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                                    <Eye className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomerLedger;
