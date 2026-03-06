
import React, { useState, useRef, useMemo } from 'react';
import { 
  Upload, 
  Plus, 
  RefreshCw, 
  Smartphone, 
  Database, 
  FileText, 
  Package, 
  Users, 
  ShieldCheck, 
  UserPlus, 
  Clock, 
  Search,
  MoreVertical,
  Lock,
  X,
  Image as ImageIcon,
  CheckCircle2,
  DollarSign,
  Tag,
  Layers,
  ShoppingBag,
  CreditCard,
  ChevronRight,
  TrendingUp,
  Activity,
  Calendar,
  Filter,
  BarChart3,
  PieChart as PieIcon,
  ArrowUpRight,
  ArrowLeft,
  Briefcase
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { getWorkerPerformance } from '../data/mockData';
import { WorkerPerformance, AttendanceLog } from '../types';

const DataManagement: React.FC = () => {
  const isAdmin = true; 
  const [activeForm, setActiveForm] = useState<'product' | 'customer' | 'order' | 'other' | null>(null);
  
  // Navigation State
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedWorker, setSelectedWorker] = useState<any | null>(null);
  const [workerDetails, setWorkerDetails] = useState<WorkerPerformance | null>(null);
  
  // Dashboard Specific State
  const [activeWorkerTab, setActiveWorkerTab] = useState<'attendance' | 'sales'>('attendance');
  const [salesFilter, setSalesFilter] = useState<'daily' | 'monthly' | 'yearly'>('daily');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productImage, setProductImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const workers = [
    { id: 'W001', name: 'Arjun Mehta', role: 'Floor Manager', shift: 'Morning', contact: '+91 98221 00443' },
    { id: 'W002', name: 'Sana Khan', role: 'Billing Staff', shift: 'Evening', contact: '+91 88765 11223' },
    { id: 'W003', name: 'Karan Singh', role: 'Inventory Lead', shift: 'Morning', contact: '+91 77654 33221' },
  ];

  const handleWorkerClick = (worker: any) => {
    setSelectedWorker(worker);
    setWorkerDetails(getWorkerPerformance(worker.id));
    setView('detail');
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setActiveForm(null);
      setProductImage(null);
      alert('Record successfully added to the database.');
    }, 1500);
  };

  const Modal = ({ title, icon: Icon, children, colorClass }: any) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setActiveForm(null)}></div>
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up border border-slate-100 dark:border-slate-800">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl text-white ${colorClass}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Add a new record to the system</p>
            </div>
          </div>
          <button onClick={() => setActiveForm(null)} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-all text-slate-400">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-8 md:p-10 space-y-6 overflow-y-auto max-h-[65vh] custom-scrollbar">
            {children}
          </div>
          <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex gap-4">
            <button 
              type="button"
              onClick={() => setActiveForm(null)} 
              className="flex-1 py-4 px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`flex-[2] py-4 px-6 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ${colorClass}`}
            >
              {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {isSubmitting ? 'Saving...' : `Add ${title.split(' ')[1] || 'Entry'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // --- Worker Detailed View (Full Screen) ---
  if (view === 'detail' && selectedWorker && workerDetails) {
    return (
      <div className="space-y-8 animate-fade-in pb-20">
        {/* Detail Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setView('list')}
              className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm group active:scale-95"
            >
              <ArrowLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] flex items-center justify-center text-white font-black text-2xl shadow-xl">
                {selectedWorker.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">{selectedWorker.name}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{selectedWorker.role}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                  <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Active • {selectedWorker.shift} Shift</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
                <FileText className="h-4 w-4" /> Export Report
             </button>
             <button className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 active:scale-95 transition-all">
                <Briefcase className="h-4 w-4" /> Manage Access
             </button>
          </div>
        </div>

        {/* Dash Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar / Stats */}
          <div className="lg:col-span-3 space-y-6">
             <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-6">
                <button 
                  onClick={() => setActiveWorkerTab('attendance')}
                  className={`w-full flex items-center justify-between px-6 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeWorkerTab === 'attendance' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  <div className="flex items-center gap-4">
                     <Calendar className="h-4 w-4" /> Attendance Logs
                  </div>
                </button>
                <button 
                  onClick={() => setActiveWorkerTab('sales')}
                  className={`w-full flex items-center justify-between px-6 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeWorkerTab === 'sales' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  <div className="flex items-center gap-4">
                     <TrendingUp className="h-4 w-4" /> Sales Contribution
                  </div>
                </button>
             </div>

             <div className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 transition-all group-hover:scale-150"></div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-6">Efficiency Hub</p>
                <h4 className="text-4xl font-black tracking-tight mb-2">{workerDetails.efficiencyScore}%</h4>
                <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest flex items-center gap-2">
                   <ArrowUpRight className="h-3 w-3" /> Exceeding Avg. Floor Rate
                </p>
             </div>

             <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Punctuality Factor</p>
                <div className="h-40 relative flex items-center justify-center">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                         <Pie 
                          data={[{v: workerDetails.punctualityRate}, {v: 100 - workerDetails.punctualityRate}]} 
                          innerRadius={50} 
                          outerRadius={70} 
                          startAngle={90} 
                          endAngle={450} 
                          dataKey="v" 
                          cornerRadius={6} 
                          stroke="none"
                        >
                            <Cell fill="#6366f1" />
                            <Cell fill="#f1f5f9" className="dark:fill-slate-800" />
                         </Pie>
                      </PieChart>
                   </ResponsiveContainer>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">{workerDetails.punctualityRate}%</span>
                   </div>
                </div>
                <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">Calculated from 30d logs</p>
             </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-8 animate-slide-up">
            {activeWorkerTab === 'attendance' ? (
              <div className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Standard Shifts</p>
                       <h5 className="text-2xl font-black text-slate-900 dark:text-white">24</h5>
                       <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-2 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Stable Attendance
                       </p>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-500/10 p-8 rounded-[2.5rem] border border-amber-100 dark:border-amber-500/20">
                       <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Early Leaves</p>
                       <h5 className="text-2xl font-black text-amber-900 dark:text-white">1</h5>
                       <p className="text-[9px] font-bold text-amber-500 uppercase tracking-widest mt-2">Personal Justification Filed</p>
                    </div>
                    <div className="bg-rose-50 dark:bg-rose-500/10 p-8 rounded-[2.5rem] border border-rose-100 dark:border-rose-500/20">
                       <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Leaves Taken</p>
                       <h5 className="text-2xl font-black text-rose-900 dark:text-white">1.5</h5>
                       <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest mt-2">Current Period Balance: 0.5</p>
                    </div>
                 </div>

                 <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex justify-between items-center">
                       <h5 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Biometric Log History</h5>
                       <div className="flex items-center gap-4">
                          <Search className="h-4 w-4 text-slate-400" />
                          <Filter className="h-4 w-4 text-slate-400" />
                       </div>
                    </div>
                    <div className="overflow-x-auto">
                       <table className="w-full text-left">
                          <thead>
                             <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800">
                                <th className="px-10 py-5">Date</th>
                                <th className="px-10 py-5">In / Out</th>
                                <th className="px-10 py-5">Status Badge</th>
                                <th className="px-10 py-5">System Notes</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                             {workerDetails.attendance.map((log, i) => (
                               <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                  <td className="px-10 py-6 font-black text-sm text-slate-900 dark:text-white">{log.date}</td>
                                  <td className="px-10 py-6">
                                     <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">IN: {log.checkIn}</span>
                                        <span className="text-[10px] font-medium text-slate-400">OUT: {log.checkOut}</span>
                                     </div>
                                  </td>
                                  <td className="px-10 py-6">
                                     <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                        log.status === 'Standard' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                        log.status === 'Early Leave' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                        log.status === 'Overshift' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                                     }`}>
                                        {log.status}
                                     </span>
                                  </td>
                                  <td className="px-10 py-6 text-xs text-slate-400 font-medium italic">{log.notes || 'Routine Scan'}</td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
              </div>
            ) : (
              <div className="space-y-8">
                 <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                       {['daily', 'monthly', 'yearly'].map(f => (
                         <button 
                           key={f}
                           onClick={() => setSalesFilter(f as any)}
                           className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${salesFilter === f ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl' : 'bg-white dark:bg-slate-800 text-slate-400 hover:bg-slate-50 border border-slate-100 dark:border-slate-800'}`}
                         >
                           {f}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="md:col-span-8 bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm h-[400px]">
                       <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 flex items-center gap-2">
                          <Activity className="h-4 w-4 text-indigo-600" /> Revenue Contribution Trend
                       </h5>
                       <ResponsiveContainer width="100%" height="80%">
                          <AreaChart data={workerDetails.salesHistory}>
                             <defs>
                                <linearGradient id="workerRev" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                                   <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                             </defs>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#64748b15" />
                             <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 700}} />
                             <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} tickFormatter={v => `₹${v/1000}k`} />
                             <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', backgroundColor: '#0f172a', color: '#fff' }} />
                             <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={5} fillOpacity={1} fill="url(#workerRev)" />
                          </AreaChart>
                       </ResponsiveContainer>
                    </div>

                    <div className="md:col-span-4 bg-indigo-600 p-10 rounded-[3rem] text-white flex flex-col justify-between shadow-2xl">
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-6">Total Gross Vol.</p>
                          <h6 className="text-5xl font-black tracking-tighter">₹{(workerDetails.totalSales / 100000).toFixed(1)}L</h6>
                       </div>
                       <div className="space-y-4 pt-10">
                          <div className="flex justify-between items-center text-xs font-bold opacity-80">
                             <span>Orders Handled</span>
                             <span className="font-black">{workerDetails.ordersProcessed}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs font-bold opacity-80">
                             <span>Conversion Rate</span>
                             <span className="font-black">94.2%</span>
                          </div>
                          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                             <div className="bg-white h-full" style={{ width: '94.2%' }}></div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 flex items-center gap-2">
                       <ShoppingBag className="h-4 w-4 text-purple-600" /> Individual Product Performance
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       {workerDetails.topProducts.map(p => (
                         <div key={p.name} className="flex flex-col gap-4 p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 group hover:border-indigo-200 transition-all">
                            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                               <Package className="h-6 w-6" />
                            </div>
                            <div>
                               <p className="text-sm font-black text-slate-900 dark:text-white mb-1">{p.name}</p>
                               <div className="flex justify-between items-end">
                                  <span className="text-2xl font-black text-slate-900 dark:text-white">{p.units} <span className="text-[10px] text-slate-400 font-bold uppercase">Units Sold</span></span>
                                  <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1.5">Top SKU</span>
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- Main List View ---
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Data Management</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Import, sync, and manually edit your business records.</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex items-center gap-2">
           <ShieldCheck className="h-4 w-4 text-blue-600" />
           <span className="text-xs font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest">Admin Access Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'POS Sync', icon: Smartphone, status: 'Active', lastSync: '14m ago', color: 'bg-blue-600' },
          { title: 'Inventory ERP', icon: Database, status: 'Paused', lastSync: '2d ago', color: 'bg-emerald-600' },
          { title: 'Tax Portal', icon: FileText, status: 'Pending', lastSync: 'None', color: 'bg-amber-600' },
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between group hover:border-blue-100 transition-all">
             <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 group-hover:bg-blue-600 transition-colors`}>
                   <item.icon className={`h-6 w-6 text-slate-400 group-hover:text-white transition-colors`} />
                </div>
                <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"><RefreshCw className="h-4 w-4" /></button>
             </div>
             <div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1 transition-colors">{item.title}</h4>
                <div className="flex items-center justify-between">
                   <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Last: {item.lastSync}</p>
                   <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${
                     item.status === 'Active' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100' : 
                     item.status === 'Paused' ? 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 border-amber-100'
                   }`}>{item.status}</span>
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
           <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
             <Plus className="h-7 w-7 text-blue-600" /> Manual Data Entry
           </h3>
           <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setActiveForm('product')} className="flex flex-col items-center justify-center p-6 md:p-8 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:border-blue-200 transition-all group text-center">
                 <Package className="h-8 w-8 text-slate-400 group-hover:text-blue-600 mb-4 transition-colors" />
                 <p className="font-bold text-slate-900 dark:text-slate-200 text-sm">Add Product</p>
                 <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">Update SKU & Price</p>
              </button>
              <button onClick={() => setActiveForm('customer')} className="flex flex-col items-center justify-center p-6 md:p-8 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:border-indigo-200 transition-all group text-center">
                 <Users className="h-8 w-8 text-slate-400 group-hover:text-indigo-600 mb-4 transition-colors" />
                 <p className="font-bold text-slate-900 dark:text-slate-200 text-sm">New Customer</p>
                 <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">Add contact & segment</p>
              </button>
              <button onClick={() => setActiveForm('order')} className="flex flex-col items-center justify-center p-6 md:p-8 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:border-emerald-200 transition-all group text-center">
                 <FileText className="h-8 w-8 text-slate-400 group-hover:text-emerald-600 mb-4 transition-colors" />
                 <p className="font-bold text-slate-900 dark:text-slate-200 text-sm">Record Order</p>
                 <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">Enter manual bill</p>
              </button>
              <button onClick={() => setActiveForm('other')} className="flex flex-col items-center justify-center p-6 md:p-8 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl hover:bg-amber-50 dark:hover:bg-amber-900/10 hover:border-amber-200 transition-all group text-center">
                 <Plus className="h-8 w-8 text-slate-400 group-hover:text-amber-600 mb-4 transition-colors" />
                 <p className="font-bold text-slate-900 dark:text-slate-200 text-sm">Other Entry</p>
                 <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">Expenses & Assets</p>
              </button>
           </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/40 p-8 md:p-10 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white dark:hover:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-900 transition-all">
           <div className="bg-white dark:bg-slate-800 p-8 rounded-full shadow-2xl mb-8 group-hover:scale-110 transition-transform border border-slate-50 dark:border-slate-700">
              <Upload className="h-12 w-12 text-blue-600" />
           </div>
           <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Bulk Import Records</h3>
           <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs mb-10">Upload CSV or Excel files from Tally, Busy, or any custom POS to instantly populate your dashboard.</p>
           <button className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-blue-700 shadow-2xl shadow-blue-100 dark:shadow-none active:scale-95 transition-all">
             Choose File...
           </button>
        </div>
      </div>

      <div className={`relative ${!isAdmin ? 'opacity-50 pointer-events-none' : ''}`}>
        {!isAdmin && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 dark:bg-slate-950/60 backdrop-blur-[2px] rounded-[3rem]">
            <div className="bg-slate-900 dark:bg-white p-4 rounded-2xl shadow-2xl mb-4">
              <Lock className="h-8 w-8 text-white dark:text-slate-900" />
            </div>
            <p className="text-xl font-black text-slate-900 dark:text-white">Restricted Access</p>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Administrator privileges required to view worker info.</p>
          </div>
        )}
        
        <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <Users className="h-7 w-7 text-indigo-600" /> Worker Management
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Manage staff directory, access roles, and payroll schedules.</p>
            </div>
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95">
              <UserPlus className="h-4 w-4" /> Add New Worker
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-4">Worker Details</th>
                  <th className="px-6 py-4">Role / Permissions</th>
                  <th className="px-6 py-4">Current Shift</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {workers.map((worker) => (
                  <tr 
                    key={worker.id} 
                    onClick={() => handleWorkerClick(worker)}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm">
                          {worker.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-slate-200 text-sm">{worker.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{worker.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[10px] font-black uppercase tracking-wider rounded-lg border border-blue-100">
                        {worker.role}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{worker.shift}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-sm font-medium text-slate-500 dark:text-slate-400">
                      {worker.contact}
                    </td>
                    <td className="px-6 py-6 text-right">
                      <button className="p-2 text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-xl"><Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /></div>
               <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Total Workforce: <span className="text-slate-900 dark:text-white">{workers.length} Members</span></p>
            </div>
            <button className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline">Download Attendance Logs</button>
          </div>
        </div>
      </div>

      {/* --- FORMS MODALS --- */}
      {activeForm === 'product' && (
        <Modal title="Add New Product" icon={Package} colorClass="bg-blue-600">
           <div className="space-y-6">
             {/* Image Upload Area */}
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Product Visual</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative h-48 bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2rem] flex flex-col items-center justify-center overflow-hidden group cursor-pointer hover:border-blue-300 transition-all"
                >
                  {productImage ? (
                    <>
                      <img src={productImage} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                        <RefreshCw className="h-8 w-8 text-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-white dark:bg-slate-700 p-4 rounded-full shadow-lg mb-3">
                        <ImageIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Click to upload photo</p>
                    </>
                  )}
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
                  <input type="text" placeholder="e.g. Wireless Buds" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold dark:text-white outline-none focus:border-blue-500" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SKU ID</label>
                  <input type="text" placeholder="SKU-2025-01" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold dark:text-white outline-none focus:border-blue-500" required />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sale Price (₹)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input type="number" placeholder="0.00" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm font-bold dark:text-white outline-none focus:border-blue-500" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm font-black dark:text-white outline-none appearance-none">
                      <option>Electronics</option>
                      <option>Apparel</option>
                      <option>Home Decor</option>
                    </select>
                  </div>
                </div>
             </div>

             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Initial Stock Count</label>
                <div className="relative">
                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type="number" placeholder="Quantity in hand" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm font-bold dark:text-white outline-none focus:border-blue-500" />
                </div>
             </div>
           </div>
        </Modal>
      )}

      {activeForm === 'customer' && (
        <Modal title="Add New Customer" icon={Users} colorClass="bg-indigo-600">
           <div className="space-y-6">
             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Customer Full Name</label>
                <input type="text" placeholder="e.g. Rahul Sharma" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold dark:text-white outline-none focus:border-indigo-500" required />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input type="email" placeholder="rahul@example.com" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold dark:text-white outline-none focus:border-indigo-500" />
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <input type="tel" placeholder="+91 XXXXX XXXXX" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold dark:text-white outline-none focus:border-indigo-500" required />
               </div>
             </div>

             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Customer Segment</label>
                <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-black dark:text-white outline-none appearance-none">
                  <option>New Customers</option>
                  <option>Loyal Customers</option>
                  <option>Bulk Buyers</option>
                </select>
             </div>
           </div>
        </Modal>
      )}

      {activeForm === 'order' && (
        <Modal title="Record Manual Order" icon={FileText} colorClass="bg-emerald-600">
           <div className="space-y-6">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Order ID</label>
                  <input type="text" value={`ORD-${Math.floor(Math.random()*90000)}`} readOnly className="w-full bg-slate-100 dark:bg-slate-800 border border-transparent rounded-xl px-4 py-3 text-sm font-black text-slate-500 dark:text-slate-400" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Transaction Date</label>
                  <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold dark:text-white outline-none" />
                </div>
             </div>

             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Customer</label>
                <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-black dark:text-white outline-none appearance-none">
                  <option>Walk-in Customer</option>
                  <option>Rahul Sharma (W001)</option>
                  <option>Sana Khan (W002)</option>
                </select>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Amount (₹)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input type="number" placeholder="0.00" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm font-black dark:text-white outline-none focus:border-emerald-500" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Items Count</label>
                  <div className="relative">
                    <ShoppingBag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input type="number" placeholder="1" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm font-bold dark:text-white outline-none focus:border-emerald-500" required />
                  </div>
                </div>
             </div>

             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Status</label>
                <div className="flex gap-2">
                   {['Paid', 'Unpaid', 'Credit'].map(s => (
                     <button type="button" key={s} className="flex-1 py-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all active:scale-95">{s}</button>
                   ))}
                </div>
             </div>
           </div>
        </Modal>
      )}

      {activeForm === 'other' && (
        <Modal title="Record Other Entry" icon={Plus} colorClass="bg-amber-600">
           <div className="space-y-6">
             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Entry Type</label>
                <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-black dark:text-white outline-none appearance-none">
                  <option>Operating Expense</option>
                  <option>Fixed Asset</option>
                  <option>Marketing Spend</option>
                  <option>Utility Bill</option>
                </select>
             </div>

             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                <textarea placeholder="Provide details about this entry..." className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-medium dark:text-white outline-none focus:border-amber-500 h-24 resize-none"></textarea>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount (₹)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input type="number" placeholder="0.00" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm font-black dark:text-white outline-none focus:border-amber-500" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                  <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold dark:text-white outline-none" />
                </div>
             </div>
           </div>
        </Modal>
      )}
    </div>
  );
};

export default DataManagement;
