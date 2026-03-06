
import React, { useState } from 'react';
import {
  FileText,
  FileDown,
  Search,
  Filter,
  Calendar,
  Mail,
  Share2,
  ChevronRight,
  X,
  Check,
  Clock,
  Package,
  ArrowRight,
  Settings2,
  Download,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { topProducts } from '../data/mockData';
import ReportViewer from '../components/ReportViewer';

interface Report {
  name: string;
  desc: string;
  formats: string[];
}

const ReportsLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [activeReport, setActiveReport] = useState<Report | null>(null);

  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [startDate, setStartDate] = useState('2025-04-01');
  const [endDate, setEndDate] = useState('2025-05-01');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('21:00');
  const [selectedProduct, setSelectedProduct] = useState('All Products');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [isGenerating, setIsGenerating] = useState(false);

  const reportCategories = [
    {
      title: 'Sales & Revenue',
      reports: [
        { name: 'Daily Sales Report', desc: 'Itemized list of all transactions within 24h', formats: ['PDF', 'Excel'] },
        { name: 'Monthly Tax (GST) Summary', desc: 'Summary of GST collected vs paid', formats: ['Excel'] },
        { name: 'Peak Selling Hours Analysis', desc: 'Heatmap data for store footfall', formats: ['PDF'] },
        { name: 'Sales Forecast (Next 90 Days)', desc: 'Advanced revenue projections based on historical data', formats: ['PDF'] }
      ]
    },
    {
      title: 'Inventory & Supply',
      reports: [
        { name: 'Full Stock Valuation', desc: 'Current market value of all SKU in hand', formats: ['PDF', 'Excel'] },
        { name: 'Supplier Performance Audit', desc: 'Lead time and quality benchmarking', formats: ['PDF'] },
        { name: 'Expired/Damaged Stock Log', desc: 'Tracking of inventory loss/shrinkage', formats: ['Excel'] },
        { name: 'Warehouse Movement History', desc: 'Transfers between store locations', formats: ['CSV'] }
      ]
    },
    {
      title: 'Customer Intelligence',
      reports: [
        { name: 'High-LTV Customer List', desc: 'Top 5% of customers by lifetime value', formats: ['Excel'] },
        { name: 'Churn Risk Analysis', desc: 'At-risk customer segments with contact protocols', formats: ['PDF', 'CSV'] },
        { name: 'Purchase Frequency Report', desc: 'Retention trends over last 12 months', formats: ['PDF'] }
      ]
    }
  ];

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      if (selectedReport) {
        setActiveReport(selectedReport);
      }
      setSelectedReport(null);
    }, 1500);
  };

  if (activeReport) {
    return (
      <ReportViewer
        reportName={activeReport.name}
        reportDesc={activeReport.desc}
        onClose={() => setActiveReport(null)}
        filters={{
          dateRange,
          startDate,
          endDate,
          startTime,
          endTime,
          selectedProduct,
          selectedLocation,
        }}
      />
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">Intelligence Library</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Configure and download high-precision business reports.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Find a report..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none dark:text-slate-200"
            />
          </div>
          <button className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white p-3 rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-200 shadow-xl shadow-slate-200 dark:shadow-none transition-all active:scale-95">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid gap-12">
        {reportCategories.map((category, idx) => (
          <div key={idx} className="space-y-6 animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="flex items-center gap-4">
              <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">{category.title}</h3>
              <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800 transition-colors"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.reports.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase())).map((report, ridx) => (
                <div key={ridx} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-blue-100 dark:hover:border-blue-900 hover:shadow-2xl transition-all group relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-50 dark:bg-blue-500/10 p-3 rounded-2xl group-hover:bg-blue-600 transition-colors">
                      <FileText className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex gap-1">
                      {report.formats.map(fmt => (
                        <span key={fmt} className="text-[8px] font-black text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg uppercase">{fmt}</span>
                      ))}
                    </div>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-2 leading-tight transition-colors">{report.name}</h4>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 leading-relaxed transition-colors line-clamp-2">{report.desc}</p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all"
                    >
                      <Settings2 className="h-3.5 w-3.5" /> Configure
                    </button>
                    <button className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-2xl hover:text-blue-600 dark:hover:text-blue-400 transition-all">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            onClick={() => !isGenerating && setSelectedReport(null)}
          ></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up border border-slate-100 dark:border-slate-800">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl text-white">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{selectedReport.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Configure report parameters</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-all text-slate-400"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-8 md:p-10 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Select Date Period</label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Today', 'Last 7 Days', 'Last 30 Days', 'Custom'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setDateRange(range)}
                      className={`px-4 py-3 rounded-xl text-xs font-bold transition-all border ${dateRange === range
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-300'
                        }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
                {dateRange === 'Custom' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 animate-fade-in">
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-slate-400 uppercase ml-1">Start Date</p>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-slate-400 uppercase ml-1">End Date</p>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Select Time Range</label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-slate-400 uppercase ml-1">From Time</p>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-slate-400 uppercase ml-1">To Time</p>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-4 w-4 text-emerald-600" />
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Product / Category</label>
                  </div>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-xs font-black text-slate-900 dark:text-white outline-none"
                  >
                    <option>All Products</option>
                    <option>Electronics</option>
                    <option>Apparel</option>
                    {topProducts.map(p => (
                      <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-rose-600" />
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Location / Warehouse</label>
                  </div>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-xs font-black text-slate-900 dark:text-white outline-none"
                  >
                    <option>All Locations</option>
                    <option>Bengaluru Main</option>
                    <option>Mumbai Hub</option>
                    <option>Delhi Express</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex gap-4">
              <button
                onClick={() => setSelectedReport(null)}
                disabled={isGenerating}
                className="flex-1 py-4 px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="flex-[2] py-4 px-6 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 dark:shadow-none transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    Run Report <FileDown className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsLibrary;
