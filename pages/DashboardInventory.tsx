
import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, Cell, ComposedChart, Line
} from 'recharts';
import {
  AlertTriangle,
  Package,
  Search,
  Truck,
  ShieldAlert,
  Clock,
  History,
  Activity,
  Settings,
  X,
  Mail,
  Phone,
  User,
  CreditCard,
  ExternalLink,
  ChevronRight,
  Filter,
  FileDown,
  Warehouse,
  ArrowRight,
  RefreshCw,
  MoreHorizontal
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { dbService } from '../services/database';
import { supabase } from '../lib/supabase';
import { StockAlert } from '../types';


const DashboardInventory: React.FC = () => {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    valuation: 0,
    totalItems: 0,
    stockoutRisk: 0,
    avgShelfLife: 0,
    damagedReturns: 0
  });

  React.useEffect(() => {
    fetchInventoryData();

    const channels = [
      supabase.channel('inventory-warehouses').on('postgres_changes',
        { event: '*', schema: 'public', table: 'warehouses' },
        () => fetchInventoryData()
      ),
      supabase.channel('inventory-products').on('postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => fetchInventoryData()
      ),
    ];
    channels.forEach(ch => ch.subscribe());

    return () => {
      channels.forEach(ch => supabase.removeChannel(ch));
    };
  }, []);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const [whData, products] = await Promise.all([
        dbService.getWarehouses(),
        dbService.getProducts()
      ]);
      setWarehouses(whData);

      const totalValuation = products.reduce((sum: number, p: any) => sum + ((p.price || 0) * (p.stock || 0)), 0);
      const totalItems = products.reduce((sum: number, p: any) => sum + (p.stock || 0), 0);

      const derivedAlerts = products
        .filter((p: any) => (p.stock || 0) < (p.low_stock_threshold || 10))
        .map((p: any) => ({
          id: p.id,
          productName: p.name,
          sku: p.id,
          currentStock: p.stock || 0,
          reorderPoint: p.low_stock_threshold || 10,
          severity: (p.stock || 0) === 0 ? 'critical' : 'warning',
          value: (p.price || 0) * (p.stock || 0),
          lastSold: 'N/A'
        }));
      setAlerts(derivedAlerts as any);

      setMetrics({
        valuation: totalValuation,
        totalItems: totalItems,
        stockoutRisk: derivedAlerts.length,
        avgShelfLife: products.length > 0 ? 58 : 0,
        damagedReturns: 0
      });
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const stockData = [
    { name: 'Inventory', stock: warehouses.length * 100, lowStock: alerts.length, outOfStock: alerts.filter(a => a.currentStock === 0).length },
  ];

  return (
    <div className="space-y-6 relative min-h-screen pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">Inventory & Logistics</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Real-time stock tracking across Indian hubs.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all active:scale-95 text-slate-700 dark:text-slate-300">
            <RefreshCw className="h-4 w-4" /> Sync ERP
          </button>
          <button className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-xl active:scale-95">
            <Package className="h-4 w-4" /> Stock Adjustment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="Live Stock Valuation" value={(metrics.valuation / 100000).toFixed(2)} suffix=" Lakhs" prefix="₹" trend={0} description={`Total ${metrics.totalItems.toLocaleString()} items`} />
          <MetricCard label="Stockout Risk Items" value={metrics.stockoutRisk.toString()} trend={0} description="Requires immediate reorder" />
          <MetricCard label="Avg. Shelf Life" value={metrics.avgShelfLife.toString()} suffix=" Days" trend={0} description="Healthy velocity" />
          <MetricCard label="Damaged/Returns" value={`₹${metrics.damagedReturns.toFixed(1)}k`} trend={0} description="Defect rate: 0%" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Warehouse className="h-5 w-5 text-blue-600" /> Warehouse-wise Stock
            </h3>
            <button className="text-xs font-bold text-blue-600 hover:underline transition-all">View Map</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/30 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-4">Warehouse</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Valuation</th>
                  <th className="px-6 py-4">Capacity</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {warehouses.map(wh => (
                  <tr key={wh.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-200">{wh.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">{wh.id}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-400">{wh.location}</td>
                    <td className="px-6 py-4 text-sm font-black text-slate-900 dark:text-white transition-colors">₹{wh.stockValue.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden min-w-[60px]">
                          <div className={`h-full ${wh.capacity > 90 ? 'bg-rose-500' : 'bg-blue-500'}`} style={{ width: `${wh.capacity}%` }}></div>
                        </div>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{wh.capacity}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${wh.capacity > 90 ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        }`}>
                        {wh.capacity > 90 ? 'CRITICAL' : 'STABLE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-rose-500" /> Critical Stock Alerts
          </h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-xl border flex flex-col gap-3 transition-all ${alert.severity === 'critical' ? 'bg-rose-50 dark:bg-rose-500/5 border-rose-100 dark:border-rose-500/10' :
                alert.severity === 'warning' ? 'bg-amber-50 dark:bg-amber-500/5 border-amber-100 dark:border-amber-500/10' :
                  'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700'
                }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-200">{alert.productName}</p>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{alert.sku}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${alert.severity === 'critical' ? 'bg-rose-500 text-white' :
                    alert.severity === 'warning' ? 'bg-amber-500 text-white' :
                      'bg-slate-500 text-white'
                    }`}>
                    {alert.severity}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Current</p>
                      <p className={`text-sm font-black ${alert.severity === 'critical' ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>{alert.currentStock}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Min</p>
                      <p className="text-sm font-black text-slate-900 dark:text-white">{alert.reorderPoint}</p>
                    </div>
                  </div>
                  <button className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none transition-all active:scale-95">
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>

                {(alert.batchNumber || alert.expiryDate) && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] font-bold">
                    {alert.batchNumber && <span className="text-slate-400">Batch: <span className="text-slate-600 dark:text-slate-300">{alert.batchNumber}</span></span>}
                    {alert.expiryDate && <span className={new Date(alert.expiryDate) < new Date('2025-06-30') ? 'text-rose-500' : 'text-slate-400'}>
                      Expires: {alert.expiryDate}
                    </span>}
                  </div>
                )}
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-lg">
            Generate PO for All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-8 flex items-center gap-2">
            <History className="h-5 w-5 text-indigo-600" /> Stock Movement History
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#64748b20" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: 'rgba(15, 23, 42, 0.9)', color: '#fff' }}
                />
                <Bar dataKey="stock" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Inflow" />
                <Bar dataKey="lowStock" fill="#94a3b8" radius={[6, 6, 0, 0]} name="Outflow" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Dead Stock Identification</h3>
            <span className="text-[10px] font-black text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2 py-1 rounded-lg uppercase tracking-widest">Action Required</span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {alerts.slice(0, 3).map(item => (
              <div key={item.sku} className="p-4 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-bold text-slate-400 dark:text-slate-600">?</div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-200">{item.name}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">Last Sale: {item.lastSold}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900 dark:text-white">₹{item.value.toLocaleString('en-IN')}</p>
                  <button className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase hover:underline">Liquidate</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardInventory;
