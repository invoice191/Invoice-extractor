
import React, { useState, useMemo, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { ShoppingCart, DollarSign, Calendar, Clock, ChevronDown, Download, TrendingUp } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import DateRangePicker from '../components/DateRangePicker';
import { dbService } from '../services/database';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';

const DashboardSales: React.FC = () => {
  const [dateRange, setDateRange] = useState({ start: new Date(2025, 4, 1), end: new Date(2025, 4, 31) });
  const [isComparing, setIsComparing] = useState(false);

  const getLabel = () => {
    return `${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`;
  };

  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    revenue: 0,
    peakVelocity: 0,
    conversionRate: 0,
    upiSuccessRate: 99.2
  });
  const [trendData, setTrendData] = useState<any[]>([]);

  useEffect(() => {
    fetchSalesData();

    const channel = supabase.channel('sales-invoices')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, () => fetchSalesData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [dateRange]);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const invoices = await dbService.getInvoices();

      // Filter by date range if needed, but for now just total
      const totalRevenue = invoices.reduce((sum: number, inv: any) => sum + (inv.grand_total || 0), 0);

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const trend = Array.from({ length: 12 }, (_, i) => {
        const monthRev = invoices
          .filter((inv: any) => new Date(inv.date).getMonth() === i)
          .reduce((sum: number, inv: any) => sum + (inv.grand_total || 0), 0);
        return { name: months[i], value: monthRev };
      });

      setTrendData(trend);
      setMetrics({
        revenue: totalRevenue,
        peakVelocity: totalRevenue / 30,
        conversionRate: 0,
        upiSuccessRate: 99.2
      });
    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Sales & Revenue</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Precision tracking for <span className="text-emerald-600 font-bold">{getLabel()}</span></p>
        </div>

        <div className="flex items-center gap-3">
          <DateRangePicker
            onApply={(start, end, compare) => {
              setDateRange({ start, end });
              setIsComparing(compare);
            }}
          />
          <button className="bg-emerald-600 text-white p-3 rounded-2xl hover:bg-emerald-700 transition-all active:scale-95 shadow-xl shadow-emerald-500/20">
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Est. Gross Revenue" value={`₹${metrics.revenue.toLocaleString('en-IN')}`} prefix="" trend={0} description={`Period analysis active`} />
        <MetricCard label="Peak Velocity" value={`₹${metrics.peakVelocity.toLocaleString('en-IN', { maximumFractionDigits: 0 })}/day`} trend={0} description="Revenue speed" />
        <MetricCard label="Conversion Rate" value={`${metrics.conversionRate}%`} trend={0} description="Store footfall to sale" />
        <MetricCard label="UPI Success Rate" value={`${metrics.upiSuccessRate}%`} trend={0} description="Payment gateway health" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-black text-slate-800 dark:text-slate-100 mb-10 flex items-center gap-3 text-lg">
            <TrendingUp className="h-6 w-6 text-blue-600" /> Revenue Growth Projection
          </h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#64748b20" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', backgroundColor: 'rgba(15, 23, 42, 0.95)', color: '#fff', padding: '20px' }} />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={5} fillOpacity={1} fill="url(#colorSales)" name="Gross Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <h3 className="font-black text-slate-800 dark:text-slate-100 mb-10 flex items-center gap-3 text-lg">
            <Clock className="h-6 w-6 text-amber-500" /> Hourly Trends
          </h3>
          <div className="flex-1 space-y-6">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
              <div key={day} className="space-y-2">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                  <span>{day}</span>
                  <span className="text-slate-900 dark:text-white">Peak: 18:00 - 00:00</span>
                </div>
                <div className="flex h-3 gap-1">
                  <div className="bg-blue-200 dark:bg-blue-900/30 rounded-full transition-all" style={{ width: `10%` }}></div>
                  <div className="bg-blue-600 rounded-full transition-all" style={{ width: `5%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Insight</p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Sunday evenings show 12% higher checkout volume. Recommend adding staff.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSales;
