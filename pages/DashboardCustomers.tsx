
import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Users, UserPlus, TrendingDown, MapPin, Download, Eye, ExternalLink, IndianRupee, AlertCircle } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import DateRangePicker from '../components/DateRangePicker';
import { dbService } from '../services/database';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import { useEffect } from 'react';

const DashboardCustomers: React.FC = () => {
  const [dateRange, setDateRange] = useState({ start: new Date(2025, 4, 1), end: new Date(2025, 4, 31) });
  const [isComparing, setIsComparing] = useState(false);
  const [activeQuickView, setActiveQuickView] = useState<'activity' | 'alerts' | 'top-products'>('activity');
  const [geographicData, setGeographicData] = useState<any[]>([]);

  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    activeBase: 0,
    avgOrderValue: 0,
    outstandingDues: 0,
    churnRisk: 0
  });
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [segments, setSegments] = useState<any[]>([]);

  useEffect(() => {
    fetchCustomerData();

    const channel = supabase.channel('customers-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'customers' }, () => fetchCustomerData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      const [custList, invoices] = await Promise.all([
        dbService.getCustomers(),
        dbService.getInvoices()
      ]);

      const unpaidInvoices = invoices.filter((inv: any) => inv.status === 'unpaid');
      const totalOutstanding = unpaidInvoices.reduce((sum: number, inv: any) => sum + (inv.grand_total || 0), 0);

      setCustomers(custList);
      setMetrics({
        activeBase: custList.length,
        avgOrderValue: invoices.length > 0 ? totalOutstanding / invoices.length : 0,
        outstandingDues: totalOutstanding,
        churnRisk: 0
      });

      // Simple watchlist of customers with unpaid invoices
      const watch = custList.map(c => {
        const dues = invoices
          .filter(inv => inv.customer_id === c.id && inv.status === 'unpaid')
          .reduce((sum, inv) => sum + (inv.grand_total || 0), 0);
        return { name: c.name, Phone: c.phone, balance: dues, limit: 10000 };
      }).filter(c => c.balance > 0).slice(0, 3);
      setWatchlist(watch);

      // Segment logic
      setSegments([
        { name: 'VIP', value: custList.filter((_, i) => i % 5 === 0).length, color: '#3b82f6' },
        { name: 'Regular', value: custList.filter((_, i) => i % 5 !== 0).length, color: '#10b981' },
      ]);

    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLabel = () => {
    return `${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* --- Unified Header & Time Controller --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Customer Analytics</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Consumer behavior for <span className="text-indigo-600 font-bold">{getLabel()}</span></p>
        </div>

        <div className="flex items-center gap-3">
          <DateRangePicker
            onApply={(start, end, compare) => {
              setDateRange({ start, end });
              setIsComparing(compare);
            }}
          />
          <button className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition-all active:scale-95">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Active Base" value={metrics.activeBase.toLocaleString('en-IN')} trend={0} description="Loyal segment growth" delay={100} />
        <MetricCard label="Avg Order Value" value={`₹${metrics.avgOrderValue.toLocaleString('en-IN')}`} trend={0} description="Period AOV" delay={150} />
        <div className="bg-amber-50 dark:bg-amber-500/10 p-5 rounded-2xl border border-amber-100 dark:border-amber-500/20 flex flex-col justify-between transition-colors">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">Outstanding (Khata)</span>
            <IndianRupee className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-2xl font-black text-amber-900 dark:text-white">₹{metrics.outstandingDues.toLocaleString('en-IN')}</h3>
          <p className="text-[9px] font-bold text-amber-500 uppercase mt-2">{watchlist.length} parties with dues</p>
        </div>
        <div className="bg-rose-50 dark:bg-rose-500/10 p-5 rounded-2xl border border-rose-100 dark:border-rose-500/20 flex flex-col justify-between transition-colors">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest">Churn Risk</span>
            <TrendingDown className="h-4 w-4 text-rose-600 dark:text-rose-400" />
          </div>
          <h3 className="text-2xl font-black text-rose-900 dark:text-white">{metrics.churnRisk}%</h3>
          <p className="text-[9px] font-bold text-rose-500 uppercase mt-2">Predicted Period Churn</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-3 text-lg">
            <Users className="h-5 w-5 text-blue-600" /> Segment Distribution
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segments}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={10}
                  dataKey="value"
                  cornerRadius={6}
                >
                  {segments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: 'rgba(15, 23, 42, 0.9)', color: '#fff' }} />
                <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ color: '#64748b', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-3 text-lg">
            <MapPin className="h-5 w-5 text-indigo-600" /> Geographic Heatmap
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={geographicData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#64748b20" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis dataKey="state" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: 'rgba(15, 23, 42, 0.9)', color: '#fff' }}
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-reveal opacity-0" style={{ animationDelay: '400ms' }}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/20">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Khata Book Watchlist</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Top Outstanding Parties</p>
          </div>
          <button className="text-xs font-bold text-indigo-600 hover:underline">Open Full Ledger</button>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {watchlist.map((cust, i) => (
            <div key={i} className="p-4 flex items-center justify-center lg:justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-500/20 rounded-full flex items-center justify-center font-black text-indigo-600 text-xs shrink-0">
                  {cust.name.split(' ').map((n: any) => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{cust.name}</p>
                  <p className="text-[10px] font-bold text-slate-400">{cust.Phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right hidden sm:block">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Balance</p>
                  <p className={`text-sm font-black ${cust.balance > cust.limit * 0.8 ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>₹{cust.balance.toLocaleString('en-IN')}</p>
                </div>
                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {watchlist.length === 0 && (
            <div className="p-8 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
              No outstanding dues detected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCustomers;
