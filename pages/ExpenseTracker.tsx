import React, { useState, useMemo } from 'react';
import {
    Wallet, Plus, Search, Filter, ArrowUpRight, ArrowDownRight,
    TrendingDown, TrendingUp, Calendar, CreditCard, Smartphone,
    Banknote, Receipt, Trash2, PieChart as PieChartIcon, MoreVertical,
    ArrowRight, X
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { Expense } from '../types';
import { dbService } from '../services/database';
import { supabase } from '../lib/supabase';
import MetricCard from '../components/MetricCard';

const CATEGORY_COLORS: Record<string, string> = {
    'Rent': '#3b82f6',
    'Salary': '#10b981',
    'Utilities': '#f59e0b',
    'Raw Material': '#ef4444',
    'Marketing': '#8b5cf6',
    'Transport': '#ec4899',
    'Maintenance': '#6366f1',
    'Others': '#94a3b8'
};

const ExpenseTracker: React.FC = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    React.useEffect(() => {
        fetchExpenses();

        const channel = supabase.channel('expenses-realtime').on('postgres_changes',
            { event: '*', schema: 'public', table: 'expenses' },
            () => fetchExpenses()
        ).subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const data = await dbService.getExpenses();
            setExpenses(data as any);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        } finally {
            setLoading(false);
        }
    };

    // Form state
    const [category, setCategory] = useState<Expense['category']>('Others');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState<number>(0);
    const [paymentMethod, setPaymentMethod] = useState<Expense['paymentMethod']>('Cash');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const filteredExpenses = useMemo(() => {
        return expenses.filter(exp => {
            const matchesSearch = exp.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || exp.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [expenses, searchQuery, selectedCategory]);

    const stats = useMemo(() => {
        const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const thisMonth = expenses.filter(exp => exp.date.startsWith('2025-05')).reduce((sum, exp) => sum + exp.amount, 0);
        const lastMonth = 145000; // Mock comparison
        const trend = ((thisMonth - lastMonth) / lastMonth) * 100;

        const byCategory = Object.keys(CATEGORY_COLORS).map(cat => ({
            name: cat,
            value: expenses.filter(exp => exp.category === cat).reduce((sum, exp) => sum + exp.amount, 0),
            color: CATEGORY_COLORS[cat]
        })).filter(cat => cat.value > 0);

        return { total, thisMonth, trend, byCategory };
    }, [expenses]);

    const handleAddExpense = async () => {
        if (!description || amount <= 0) return;
        try {
            const newExpense: Partial<Expense> = {
                date,
                category,
                description,
                amount,
                paymentMethod
            };
            await dbService.addExpense(newExpense);
            await fetchExpenses();
            setDescription(''); setAmount(0); setShowAddForm(false);
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    };

    const handleDeleteExpense = (id: string) => {
        setExpenses(expenses.filter(exp => exp.id !== id));
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Expense Tracker</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Manage business overheads and cash outflows</p>
                </div>
                <button onClick={() => setShowAddForm(true)}
                    className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-rose-200 dark:shadow-none active:scale-95">
                    <Plus className="h-4 w-4" /> Add Expense
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard label="Total Outflow" value={`₹${stats.total.toLocaleString('en-IN')}`} trend={stats.trend} description="Total business expenses" />
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-400 uppercase">Monthly Burn</span>
                        <Calendar className="h-4 w-4 text-indigo-500" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">₹{stats.thisMonth.toLocaleString('en-IN')}</h3>
                    <p className="text-[10px] font-bold text-slate-400 mt-2">FOR THE MONTH OF MAY 2025</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-400 uppercase">Top Drain</span>
                        <TrendingUp className="h-4 w-4 text-rose-500" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                        {stats.byCategory.sort((a, b) => b.value - a.value)[0]?.name || 'None'}
                    </h3>
                    <p className="text-[10px] font-bold text-rose-500 mt-2 uppercase">Major spending category</p>
                </div>
            </div>

            {showAddForm && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-rose-200 dark:border-rose-500/20 p-6 shadow-xl animate-slide-up">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-800 dark:text-white">Record New Expense</h3>
                        <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><X className="h-4 w-4 text-slate-400" /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Category</label>
                            <select value={category} onChange={e => setCategory(e.target.value as Expense['category'])}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-rose-500">
                                {Object.keys(CATEGORY_COLORS).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Description</label>
                            <input placeholder="What did you spend on?" value={description} onChange={e => setDescription(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-rose-500" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Amount ₹</label>
                            <input type="number" placeholder="0" value={amount || ''} onChange={e => setAmount(Number(e.target.value))}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-rose-500" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Date</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-rose-500" />
                        </div>
                    </div>
                    <div className="flex gap-3 mt-6 justify-end">
                        <button onClick={() => setShowAddForm(false)} className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm">Cancel</button>
                        <button onClick={handleAddExpense} disabled={!description || amount <= 0}
                            className="px-8 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm disabled:opacity-50 transition-all shadow-lg shadow-rose-200 dark:shadow-none">
                            Save Expense
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Expense List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input placeholder="Search expenses..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div className="flex gap-2">
                            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-500 outline-none">
                                <option value="All">All Categories</option>
                                {Object.keys(CATEGORY_COLORS).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="max-h-[600px] overflow-y-auto no-scrollbar">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase">
                                        <th className="text-left p-4">Expense</th>
                                        <th className="text-left p-4">Category</th>
                                        <th className="text-left p-4">Date</th>
                                        <th className="text-right p-4">Amount</th>
                                        <th className="text-right p-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredExpenses.map(exp => (
                                        <tr key={exp.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${CATEGORY_COLORS[exp.category]}15`, color: CATEGORY_COLORS[exp.category] }}>
                                                        <Receipt className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 dark:text-white leading-tight">{exp.description}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{exp.paymentMethod}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-xs">
                                                <span className="px-2.5 py-1 rounded-full font-bold" style={{ backgroundColor: `${CATEGORY_COLORS[exp.category]}15`, color: CATEGORY_COLORS[exp.category] }}>
                                                    {exp.category}
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-500 text-xs font-medium">{exp.date}</td>
                                            <td className="p-4 text-right font-black text-rose-600">₹{exp.amount.toLocaleString('en-IN')}</td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => handleDeleteExpense(exp.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredExpenses.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-12 text-center text-slate-400 font-medium">No matching expenses found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Charts & Categorization */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-3 text-lg">
                            <PieChartIcon className="h-5 w-5 text-rose-500" /> Spending Mix
                        </h3>
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.byCategory}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={85}
                                        paddingAngle={8}
                                        dataKey="value"
                                        cornerRadius={6}
                                    >
                                        {stats.byCategory.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: 'rgba(15, 23, 42, 0.9)', color: '#fff' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-2">
                            {stats.byCategory.sort((a, b) => b.value - a.value).slice(0, 4).map(cat => (
                                <div key={cat.name} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                                        <span className="font-bold text-slate-600 dark:text-slate-400">{cat.name}</span>
                                    </div>
                                    <span className="font-black text-slate-800 dark:text-white">₹{cat.value.toLocaleString('en-IN')}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-[2.5rem] text-white shadow-xl shadow-indigo-200 dark:shadow-none">
                        <div className="flex justify-between items-start mb-4">
                            <Wallet className="h-8 w-8 text-indigo-100/50" />
                            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                <TrendingUp className="h-4 w-4" />
                            </div>
                        </div>
                        <h4 className="text-indigo-100 font-bold text-xs uppercase tracking-widest">Efficiency Score</h4>
                        <p className="text-3xl font-black mt-1">92.4%</p>
                        <p className="text-indigo-100/70 text-[10px] mt-2 font-medium">Your business spending is 4% more efficient than last month.</p>
                        <button className="w-full mt-6 py-3 bg-white text-indigo-700 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 group">
                            View Audit <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpenseTracker;
