
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  FileText, 
  Download, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileDown, 
  Share2,
  Printer,
  ChevronDown,
  Calendar,
  X
} from 'lucide-react';
import { Invoice } from '../types';

interface InvoicesProps {
  invoices: Invoice[];
}

const Invoices: React.FC<InvoicesProps> = ({ invoices }) => {
  const [filterStatus, setFilterStatus] = useState<'All' | 'Paid' | 'Unpaid' | 'Overdue'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Advanced Filter State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('23:59');

  const filteredInvoices = invoices.filter(inv => {
    const matchesStatus = filterStatus === 'All' || inv.status === filterStatus;
    const matchesSearch = inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inv.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Simple Date Check (YYYY-MM-DD)
    const invDate = new Date(inv.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    let matchesDate = true;
    if (start && invDate < start) matchesDate = false;
    if (end && invDate > end) matchesDate = false;

    return matchesStatus && matchesSearch && matchesDate;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20';
      case 'Unpaid': return 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20';
      case 'Overdue': return 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20';
      default: return 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid': return <CheckCircle2 className="h-3 w-3" />;
      case 'Unpaid': return <Clock className="h-3 w-3" />;
      case 'Overdue': return <AlertCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  const clearFilters = () => {
    setFilterStatus('All');
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
    setStartTime('00:00');
    setEndTime('23:59');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">Invoices</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Manage and track your customer billing history.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm text-slate-700 dark:text-slate-300">
            <FileDown className="h-4 w-4" /> Export All
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-black shadow-xl shadow-blue-200 dark:shadow-blue-900/20 hover:bg-blue-700 transition-all active:scale-95">
            <FileText className="h-4 w-4" /> Create New
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
          <div className="flex flex-wrap gap-2">
            {['All', 'Paid', 'Unpaid', 'Overdue'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as any)}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filterStatus === status 
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' 
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 transition-all outline-none dark:text-slate-200"
              />
            </div>
            <button 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`p-2.5 rounded-xl border transition-all ${
                showAdvancedFilters 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 text-blue-600' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
              }`}
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold dark:text-white outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">End Date</label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold dark:text-white outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">From Time</label>
              <input 
                type="time" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold dark:text-white outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">To Time</label>
              <input 
                type="time" 
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold dark:text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] border-b border-slate-50 dark:border-slate-800">
                <th className="px-6 py-4">Invoice Details</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredInvoices.length > 0 ? filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-slate-200 text-sm uppercase tracking-tight">{inv.id}</p>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{inv.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{inv.customerName}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{inv.items} Items Included</p>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-sm font-black text-slate-900 dark:text-white">₹{inv.amount.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-emerald-500 dark:text-emerald-400 font-bold uppercase tracking-widest">Tax: ₹{inv.taxAmount}</p>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`flex items-center w-fit gap-1.5 px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-wider ${getStatusStyle(inv.status)}`}>
                      {getStatusIcon(inv.status)}
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all" title="Download PDF">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full">
                        <Search className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 font-bold">No results found for current filters</p>
                      <button onClick={clearFilters} className="text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest hover:underline">Reset all filters</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-between items-center px-4">
           <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Showing {filteredInvoices.length} entries</p>
           <div className="flex gap-2">
              <button className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50" disabled>Previous</button>
              <button className="px-4 py-2 bg-slate-900 dark:bg-white rounded-xl text-[10px] font-black uppercase tracking-widest text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200">Next Page</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
