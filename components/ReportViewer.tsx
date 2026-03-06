
import React, { useState, useRef } from 'react';
import {
    X,
    Download,
    Calendar,
    Clock,
    Filter,
    Share2,
    FileText,
    ArrowLeft,
    ChevronDown,
    Printer,
    FileSpreadsheet,
    PieChart as PieChartIcon,
    BarChart as BarChartIcon,
    TrendingUp,
    Package,
    MapPin,
    Check,
    Loader2
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

interface ReportFilters {
    dateRange: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    selectedProduct: string;
    selectedLocation: string;
}

interface ReportViewerProps {
    reportName: string;
    reportDesc: string;
    onClose: () => void;
    filters?: ReportFilters;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ reportName, reportDesc, onClose, filters }) => {
    const [activeTab, setActiveTab] = useState<'visual' | 'table'>('visual');
    const [isExporting, setIsExporting] = useState(false);
    const [exportType, setExportType] = useState<string | null>(null);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [exportSuccess, setExportSuccess] = useState<string | null>(null);
    const reportContentRef = useRef<HTMLDivElement>(null);

    // Mock data for the report
    const salesData = [
        { name: 'Mon', sales: 4000, revenue: 2400 },
        { name: 'Tue', sales: 3000, revenue: 1398 },
        { name: 'Wed', sales: 2000, revenue: 9800 },
        { name: 'Thu', sales: 2780, revenue: 3908 },
        { name: 'Fri', sales: 1890, revenue: 4800 },
        { name: 'Sat', sales: 2390, revenue: 3800 },
        { name: 'Sun', sales: 3490, revenue: 4300 },
    ];

    const categoryData = [
        { name: 'Electronics', value: 400 },
        { name: 'Apparel', value: 300 },
        { name: 'Home', value: 300 },
        { name: 'Beauty', value: 200 },
    ];

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];

    const transactionData = [
        { id: 'TRX-9012', date: '2025-05-01', time: '14:20', customer: 'John Doe', amount: 12500, status: 'Paid' },
        { id: 'TRX-9013', date: '2025-05-01', time: '15:45', customer: 'Jane Smith', amount: 8400, status: 'Paid' },
        { id: 'TRX-9014', date: '2025-05-01', time: '16:10', customer: 'Bob Johnson', amount: 21000, status: 'Pending' },
        { id: 'TRX-9015', date: '2025-05-01', time: '17:30', customer: 'Alice Brown', amount: 5600, status: 'Paid' },
        { id: 'TRX-9016', date: '2025-05-01', time: '18:05', customer: 'Charlie Davis', amount: 15200, status: 'Paid' },
    ];

    const handleExportPDF = async () => {
        setIsExporting(true);
        setExportType('PDF');
        setShowExportMenu(false);
        try {
            const element = reportContentRef.current;
            if (!element) return;

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Add header
            pdf.setFillColor(99, 102, 241);
            pdf.rect(0, 0, pdfWidth, 28, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            pdf.text(reportName, 14, 14);
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            pdf.text(reportDesc, 14, 22);

            // Add filter info
            if (filters) {
                pdf.setTextColor(100, 116, 139);
                pdf.setFontSize(8);
                let yPos = 34;
                pdf.text(`Date Range: ${filters.dateRange}`, 14, yPos);
                if (filters.dateRange === 'Custom') {
                    pdf.text(`Period: ${filters.startDate} to ${filters.endDate}`, 14, yPos + 5);
                    yPos += 5;
                }
                pdf.text(`Time: ${filters.startTime} - ${filters.endTime}`, 14, yPos + 5);
                pdf.text(`Product: ${filters.selectedProduct}  |  Location: ${filters.selectedLocation}`, 14, yPos + 10);
                yPos += 16;

                const imgWidth = pdfWidth - 28;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                const maxImgHeight = pdfHeight - yPos - 10;
                const finalHeight = Math.min(imgHeight, maxImgHeight);
                pdf.addImage(imgData, 'PNG', 14, yPos, imgWidth, finalHeight);
            } else {
                const imgWidth = pdfWidth - 28;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 14, 34, imgWidth, Math.min(imgHeight, pdfHeight - 44));
            }

            // Add footer
            pdf.setTextColor(148, 163, 184);
            pdf.setFontSize(7);
            pdf.text(`Generated on ${new Date().toLocaleString()} | VyaparMitra Intelligence`, 14, pdfHeight - 8);

            pdf.save(`${reportName.replace(/\s+/g, '_')}_Report.pdf`);
            setExportSuccess('PDF');
            setTimeout(() => setExportSuccess(null), 3000);
        } catch (err) {
            console.error('PDF export failed:', err);
        } finally {
            setIsExporting(false);
            setExportType(null);
        }
    };

    const handleExportExcel = () => {
        setIsExporting(true);
        setExportType('Excel');
        setShowExportMenu(false);
        try {
            const wb = XLSX.utils.book_new();

            // Summary sheet
            const summaryRows = [
                ['Report Name', reportName],
                ['Description', reportDesc],
                ['Generated On', new Date().toLocaleString()],
                [''],
            ];
            if (filters) {
                summaryRows.push(['--- Applied Filters ---', '']);
                summaryRows.push(['Date Range', filters.dateRange]);
                if (filters.dateRange === 'Custom') {
                    summaryRows.push(['Start Date', filters.startDate]);
                    summaryRows.push(['End Date', filters.endDate]);
                }
                summaryRows.push(['Time Range', `${filters.startTime} - ${filters.endTime}`]);
                summaryRows.push(['Product', filters.selectedProduct]);
                summaryRows.push(['Location', filters.selectedLocation]);
            }
            const summarySheet = XLSX.utils.aoa_to_sheet(summaryRows);
            summarySheet['!cols'] = [{ wch: 20 }, { wch: 40 }];
            XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');

            // Transactions sheet
            const txHeaders = ['Transaction ID', 'Date', 'Time', 'Customer', 'Amount (₹)', 'Status'];
            const txRows = transactionData.map(t => [t.id, t.date, t.time, t.customer, t.amount, t.status]);
            const txSheet = XLSX.utils.aoa_to_sheet([txHeaders, ...txRows]);
            txSheet['!cols'] = [{ wch: 15 }, { wch: 12 }, { wch: 8 }, { wch: 18 }, { wch: 14 }, { wch: 10 }];
            XLSX.utils.book_append_sheet(wb, txSheet, 'Transactions');

            // Sales Trends sheet
            const salesHeaders = ['Day', 'Sales', 'Revenue'];
            const salesRows = salesData.map(s => [s.name, s.sales, s.revenue]);
            const salesSheet = XLSX.utils.aoa_to_sheet([salesHeaders, ...salesRows]);
            salesSheet['!cols'] = [{ wch: 10 }, { wch: 12 }, { wch: 12 }];
            XLSX.utils.book_append_sheet(wb, salesSheet, 'Sales Trends');

            // Category Distribution sheet
            const catHeaders = ['Category', 'Value'];
            const catRows = categoryData.map(c => [c.name, c.value]);
            const catSheet = XLSX.utils.aoa_to_sheet([catHeaders, ...catRows]);
            catSheet['!cols'] = [{ wch: 15 }, { wch: 10 }];
            XLSX.utils.book_append_sheet(wb, catSheet, 'Category Distribution');

            XLSX.writeFile(wb, `${reportName.replace(/\s+/g, '_')}_Report.xlsx`);
            setExportSuccess('Excel');
            setTimeout(() => setExportSuccess(null), 3000);
        } catch (err) {
            console.error('Excel export failed:', err);
        } finally {
            setIsExporting(false);
            setExportType(null);
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-20 animate-fade-in relative">
            {/* Click outside to close dropdown */}
            {showExportMenu && (
                <div className="fixed inset-0 z-[5]" onClick={() => setShowExportMenu(false)} />
            )}

            {/* Top Action Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all text-slate-500"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{reportName}</h2>
                        <p className="text-xs font-medium text-slate-500 line-clamp-1">{reportDesc}</p>
                    </div>
                </div>
                <div className="flex gap-2 items-center relative">
                    {/* Success Toast */}
                    {exportSuccess && (
                        <div className="absolute -bottom-14 right-0 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xl animate-slide-up z-50">
                            <Check className="h-4 w-4" />
                            {exportSuccess} downloaded successfully!
                        </div>
                    )}
                    <button
                        onClick={handleExportPDF}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
                    >
                        {isExporting && exportType === 'PDF' ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Printer className="h-4 w-4" />
                        )}
                        {isExporting && exportType === 'PDF' ? 'Generating...' : 'Print PDF'}
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            disabled={isExporting}
                            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none transition-all disabled:opacity-50"
                        >
                            {isExporting && exportType === 'Excel' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Download className="h-4 w-4" />
                            )}
                            {isExporting && exportType === 'Excel' ? 'Exporting...' : 'Export'}
                            <ChevronDown className="h-3 w-3" />
                        </button>

                        {/* Export Dropdown */}
                        {showExportMenu && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in">
                                <div className="p-2">
                                    <button
                                        onClick={handleExportPDF}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group"
                                    >
                                        <div className="p-2 bg-rose-50 dark:bg-rose-500/10 rounded-lg group-hover:bg-rose-100 transition-colors">
                                            <Printer className="h-4 w-4 text-rose-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">PDF Document</p>
                                            <p className="text-[10px] text-slate-400 font-medium">Print-ready format</p>
                                        </div>
                                    </button>
                                    <button
                                        onClick={handleExportExcel}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group"
                                    >
                                        <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg group-hover:bg-emerald-100 transition-colors">
                                            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">Excel Spreadsheet</p>
                                            <p className="text-[10px] text-slate-400 font-medium">Editable .xlsx file</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Applied Filters Strip */}
            {filters && (
                <div className="flex flex-wrap gap-3 animate-slide-up">
                    <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl px-4 py-2">
                        <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                        <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                            {filters.dateRange}{filters.dateRange === 'Custom' ? ` (${filters.startDate} → ${filters.endDate})` : ''}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 rounded-xl px-4 py-2">
                        <Clock className="h-3.5 w-3.5 text-purple-500" />
                        <span className="text-xs font-bold text-purple-700 dark:text-purple-300">{filters.startTime} – {filters.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl px-4 py-2">
                        <Package className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">{filters.selectedProduct}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-xl px-4 py-2">
                        <MapPin className="h-3.5 w-3.5 text-rose-500" />
                        <span className="text-xs font-bold text-rose-700 dark:text-rose-300">{filters.selectedLocation}</span>
                    </div>
                </div>
            )}

            {/* Capturable report content */}
            <div ref={reportContentRef} className="space-y-8">
                {/* Summary Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Revenue</p>
                            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600">
                                <TrendingUp className="h-3.5 w-3.5" />
                            </div>
                        </div>
                        <p className="text-2xl font-black text-slate-900 dark:text-white transition-colors">₹4.28L</p>
                        <p className="text-[10px] text-emerald-500 font-bold mt-1">↑ 12.5% from last period</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Transactions</p>
                            <div className="p-1.5 bg-amber-50 dark:bg-amber-500/10 rounded-lg text-amber-600">
                                <FileText className="h-3.5 w-3.5" />
                            </div>
                        </div>
                        <p className="text-2xl font-black text-slate-900 dark:text-white transition-colors">1,248</p>
                        <p className="text-[10px] text-emerald-500 font-bold mt-1">↑ 3.2% from last period</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Avg Ticket Size</p>
                            <div className="p-1.5 bg-rose-50 dark:bg-rose-500/10 rounded-lg text-rose-600">
                                <MapPin className="h-3.5 w-3.5" />
                            </div>
                        </div>
                        <p className="text-2xl font-black text-slate-900 dark:text-white transition-colors">₹342</p>
                        <p className="text-[10px] text-rose-500 font-bold mt-1">↓ 0.8% from last period</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Growth Rate</p>
                            <div className="p-1.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-600">
                                <TrendingUp className="h-3.5 w-3.5" />
                            </div>
                        </div>
                        <p className="text-2xl font-black text-slate-900 dark:text-white transition-colors">18.4%</p>
                        <p className="text-[10px] text-emerald-500 font-bold mt-1">↑ 4.1% YoY</p>
                    </div>
                </div>

                {/* View Toggles */}
                <div className="flex items-center justify-between">
                    <div className="flex bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <button
                            onClick={() => setActiveTab('visual')}
                            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'visual' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none' : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            <BarChartIcon className="h-4 w-4" /> Visual Analysis
                        </button>
                        <button
                            onClick={() => setActiveTab('table')}
                            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'table' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none' : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            <FileText className="h-4 w-4" /> Data Table
                        </button>
                    </div>
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-all">
                        <Share2 className="h-3.5 w-3.5" /> Share Report
                    </button>
                </div>

                {activeTab === 'visual' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Trends Chart */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors overflow-hidden">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h4 className="font-black text-slate-900 dark:text-white text-lg tracking-tight">Revenue Trends</h4>
                                    <p className="text-xs font-medium text-slate-400">Comparing revenue vs sales volume</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full bg-indigo-600"></div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Revenue</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Transactions</span>
                                    </div>
                                </div>
                            </div>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={salesData}>
                                        <defs>
                                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#64748b10" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} />
                                        <YAxis hide />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '20px', border: 'none', backgroundColor: '#0f172a', padding: '12px' }}
                                            itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}
                                        />
                                        <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                        <Area type="monotone" dataKey="sales" stroke="#e2e8f0" strokeWidth={2} fillOpacity={0} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Distribution Chart */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors overflow-hidden">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h4 className="font-black text-slate-900 dark:text-white text-lg tracking-tight">Category Distribution</h4>
                                    <p className="text-xs font-medium text-slate-400">Sales split by major product wings</p>
                                </div>
                                <PieChartIcon className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div className="h-[300px] w-full flex items-center justify-center relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={10}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#0f172a', color: '#fff' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                {/* Legend Overlay */}
                                <div className="absolute flex flex-col gap-2 pointer-events-none">
                                    <p className="text-[10px] font-black text-slate-400 uppercase text-center tracking-widest">Total</p>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white text-center">1,200</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Data Table View */
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Time</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {transactionData.map((trx) => (
                                        <tr key={trx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                            <td className="px-8 py-5">
                                                <span className="text-xs font-black text-indigo-600 font-mono tracking-tight">{trx.id}</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">{trx.date}</p>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <Clock className="h-3 w-3 text-slate-400" />
                                                    <span className="text-[10px] font-medium text-slate-400">{trx.time}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-xs font-black text-slate-500">
                                                        {trx.customer.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{trx.customer}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right font-black text-slate-900 dark:text-white">
                                                ₹{trx.amount.toLocaleString('en-IN')}
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${trx.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                    }`}>
                                                    {trx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Action Footer */}
            <div className="bg-indigo-600 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden group">
                {/* Background blobs */}
                <div className="absolute -right-24 -top-24 h-64 w-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
                <div className="absolute -left-24 -bottom-24 h-64 w-64 bg-indigo-500 rounded-full blur-3xl group-hover:bg-indigo-400 transition-all duration-700"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <h4 className="text-2xl font-black tracking-tight mb-2">Need a custom analytics board?</h4>
                        <p className="text-indigo-100 font-medium">Connect with our data scientists for bespoke business reporting.</p>
                    </div>
                    <button className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl active:scale-95">
                        Contact Advisory
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportViewer;
