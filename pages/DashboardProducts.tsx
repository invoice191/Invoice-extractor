
import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ComposedChart, Line, AreaChart, Area, Cell, Legend, PieChart, Pie
} from 'recharts';
import {
  Package,
  TrendingUp,
  DollarSign,
  Activity,
  ChevronDown,
  Download,
  ArrowLeft,
  MapPin,
  ShoppingBag,
  Zap,
  ArrowUpRight,
  Target,
  BarChart3,
  PieChart as PieIcon,
  Warehouse,
  History
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import DateRangePicker from '../components/DateRangePicker';
import { dbService } from '../services/database';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import { useEffect } from 'react';

const DashboardProducts: React.FC = () => {
  const [dateRange, setDateRange] = useState({ start: new Date(2025, 4, 1), end: new Date(2025, 4, 31) });
  const [isComparing, setIsComparing] = useState(false);
  const [selectedSKU, setSelectedSKU] = useState<string | null>(null);

  const getLabel = () => {
    return `${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`;
  };

  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    analyzedSKUs: 0,
    grossMargin: 32.4, // Keep static or derive if possible
    satisfaction: 98.2,
    velocity: 0
  });

  useEffect(() => {
    fetchProductData();

    const channel = supabase.channel('products-view')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => fetchProductData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const data = await dbService.getProducts();
      setProducts(data);
      setMetrics(prev => ({
        ...prev,
        analyzedSKUs: data.length,
        velocity: data.length > 0 ? 12.5 : 0
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.map(p => ({
      name: p.name,
      category: p.category || 'Uncategorized',
      revenue: (p.price || 0) * 10, // Placeholder volume
      units: 10,
      margin: 30, // Default margin
      trend: 0,
      velocity: 'Medium',
      stock: p.stock || 0
    }));
  }, [products]);

  const currentProduct = useMemo(() => {
    return filteredProducts.find(p => p.name === selectedSKU);
  }, [selectedSKU, filteredProducts]);

  // Use empty/default data for trends since we cleared invoices
  const productTrendData = useMemo(() => {
    if (!currentProduct) return [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(m => ({
      name: m,
      revenue: 0,
      units: 0,
      stock: currentProduct.stock
    }));
  }, [currentProduct]);

  const productRegionalData = useMemo(() => [], []);
  const channelData = useMemo(() => [
    { name: 'Online Store', value: 0, color: '#3b82f6' },
    { name: 'Retail Shop', value: 0, color: '#10b981' },
    { name: 'Wholesale', value: 0, color: '#f59e0b' },
  ], []);

  if (selectedSKU && currentProduct) {
    return (
      <div className="space-y-8 animate-fade-in">
        {/* --- Product Drill-down Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSelectedSKU(null)}
              className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[10px] font-black bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-2 py-0.5 rounded-lg uppercase tracking-widest">{currentProduct.category}</span>
                <span className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-lg uppercase tracking-widest">SKU: {currentProduct.name.split(' ').map(n => n[0]).join('')}-2025</span>
              </div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{currentProduct.name}</h2>
              <p className="text-slate-500 font-medium">Visual intelligence summary</p>
            </div>
          </div>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2">
            <Download className="h-4 w-4" /> Export Charts
          </button>
        </div>

        {/* --- Visual Row 1: Core Performance & Channel Distribution --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black text-slate-800 dark:text-slate-100 flex items-center gap-3 text-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" /> Sales Velocity Over Time
              </h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-400"><div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div> Revenue Trend</div>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={productTrendData}>
                  <defs>
                    <linearGradient id="colorProdRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#64748b15" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip cursor={{ stroke: '#3b82f6', strokeWidth: 1 }} contentStyle={{ borderRadius: '24px', border: 'none', backgroundColor: '#0f172a', color: '#fff' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorProdRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-black text-slate-800 dark:text-slate-100 mb-8 flex items-center gap-3 text-lg">
              <PieIcon className="h-6 w-6 text-emerald-600" /> Sales Channel Mix
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  {/* cornerRadius moved from Cell to Pie */}
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                    cornerRadius={6}
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#0f172a', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {channelData.map(c => (
                <div key={c.name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }}></div>
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- Visual Row 2: Inventory Correlation & Regional Maps --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-black text-slate-800 dark:text-slate-100 mb-8 flex items-center gap-3 text-lg">
              <Warehouse className="h-6 w-6 text-purple-600" /> Sales vs Stock Health
            </h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={productTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#64748b15" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8b5cf6' }} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#0f172a', color: '#fff' }} />
                  <Bar yAxisId="left" dataKey="units" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Units Sold" />
                  <Line yAxisId="right" type="monotone" dataKey="stock" stroke="#8b5cf6" strokeWidth={3} dot={false} name="Stock Level" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center gap-6">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div> <span className="text-[10px] font-bold text-slate-500 uppercase">Daily Sales</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-purple-500"></div> <span className="text-[10px] font-bold text-slate-500 uppercase">Warehouse Units</span></div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-black text-slate-800 dark:text-slate-100 mb-8 flex items-center gap-3 text-lg">
              <MapPin className="h-6 w-6 text-rose-600" /> Regional Performance Map
            </h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productRegionalData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#64748b15" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="state" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 900, fill: '#64748b' }} width={100} />
                  <Tooltip cursor={{ fill: 'rgba(244, 63, 94, 0.05)' }} contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#0f172a', color: '#fff' }} />
                  <Bar dataKey="sales" fill="#f43f5e" radius={[0, 8, 8, 0]} barSize={32}>
                    {productRegionalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fillOpacity={1 - (index * 0.12)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Product Performance</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">SKU efficiency for <span className="text-blue-600 font-bold">{getLabel()}</span></p>
        </div>

        <div className="flex items-center gap-3">
          <DateRangePicker
            onApply={(start, end, compare) => {
              setDateRange({ start, end });
              setIsComparing(compare);
            }}
          />
          <button className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95">
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Analyzed SKUs" value={metrics.analyzedSKUs.toString()} trend={0} description="Catalog size" />
        <MetricCard label="Gross Margin" value={`${metrics.grossMargin}%`} trend={0} description="Profit efficiency" />
        <MetricCard label="Satisfaction" value={`${metrics.satisfaction}%`} trend={0} description="Returns trend" />
        <MetricCard label="Velocity" value={metrics.velocity.toString()} suffix=" days" trend={0} description="Avg shelf life" />
      </div>

      {/* --- Performance Tile Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.name}
            onClick={() => setSelectedSKU(product.name)}
            className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-blue-100 dark:hover:border-blue-900 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl group-hover:bg-blue-600 transition-colors">
                <Package className="h-6 w-6 text-slate-400 group-hover:text-white transition-colors" />
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${product.trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {product.trend > 0 ? '+' : ''}{product.trend}%
                </span>
              </div>
            </div>

            <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-blue-600 transition-colors">{product.name}</h4>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.category}</span>
              <div className="w-1 h-1 rounded-full bg-slate-300"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.velocity} Velocity</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Revenue</p>
                <p className="text-lg font-black text-slate-900 dark:text-white">₹{(product.revenue / 1000).toFixed(1)}k</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Profit Margin</p>
                <p className="text-lg font-black text-emerald-600">{product.margin}%</p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center group-hover:border-blue-50 transition-colors">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">View Detailed Graphs</span>
              <ArrowUpRight className="h-4 w-4 text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <h3 className="font-black text-slate-800 dark:text-slate-100 mb-10 flex items-center gap-3 text-lg">
          <Activity className="h-6 w-6 text-emerald-600" /> Comparison: Revenue vs Margin
        </h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={filteredProducts}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#64748b15" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#10b981' }} unit="%" />
              <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', backgroundColor: 'rgba(15, 23, 42, 0.95)', color: '#fff', padding: '20px' }} />
              <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Revenue (₹)" />
              <Line yAxisId="right" type="monotone" dataKey="margin" stroke="#10b981" strokeWidth={5} dot={{ r: 6, fill: '#10b981', strokeWidth: 3, stroke: '#fff' }} name="Profit Margin (%)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardProducts;
