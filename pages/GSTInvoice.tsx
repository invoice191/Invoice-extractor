import React, { useState, useMemo, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
    FileText, Plus, Trash2, X, CheckCircle2, Clock, AlertCircle,
    Send, Download, Eye, ChevronDown, Receipt, ArrowRight,
    QrCode, Calculator, Hash, Search, Filter
} from 'lucide-react';
import { GSTInvoice as GSTInvoiceType, GSTItem, InvoiceSettings } from '../types';
import { dbService } from '../services/database';
import { supabase } from '../lib/supabase';

const HSN_PRESETS = [
    { code: '8518', name: 'Headphones/Speakers', gst: 18 },
    { code: '3926', name: 'Plastic Articles', gst: 18 },
    { code: '9401', name: 'Furniture/Chairs', gst: 18 },
    { code: '9102', name: 'Watches/Wearables', gst: 18 },
    { code: '8544', name: 'Cables/Wires', gst: 18 },
    { code: '6109', name: 'T-shirts/Vests', gst: 5 },
    { code: '0901', name: 'Tea/Coffee', gst: 5 },
    { code: '8471', name: 'Computers/Laptops', gst: 18 },
    { code: '4901', name: 'Printed Books', gst: 0 },
    { code: '8517', name: 'Mobile Phones', gst: 12 },
];

interface GSTInvoiceProps {
    onNavigateToInvoices?: () => void;
}

const GSTInvoicePage: React.FC<GSTInvoiceProps> = ({ onNavigateToInvoices }) => {
    const [invoices, setInvoices] = useState<GSTInvoiceType[]>([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        fetchInvoices();

        const channel = supabase.channel('invoices-realtime').on('postgres_changes',
            { event: '*', schema: 'public', table: 'invoices' },
            () => fetchInvoices()
        ).subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const data = await dbService.getInvoices();
            setInvoices(data as any);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        } finally {
            setLoading(false);
        }
    };
    const [showCreator, setShowCreator] = useState(false);
    const [showPreview, setShowPreview] = useState<GSTInvoiceType | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const invoiceRef = useRef<HTMLDivElement>(null);

    // Default settings if not provided
    const [invoiceSettings] = useState<InvoiceSettings>(() => {
        const saved = localStorage.getItem('vm_invoice_settings');
        return saved ? JSON.parse(saved) : {
            businessName: 'Vyaparmitra Store',
            gstin: '',
            address: 'Koramangala, Bengaluru',
            phone: '',
            email: '',
            upiId: 'vyaparmitra@upi',
            invoicePrefix: 'VM/',
            startingNumber: 1,
            terms: '',
            showSignatureBox: true,
            theme: 'Advanced GST (Tally)',
            primaryColor: '#4f46e5',
            showPhoneNumber: true,
            showEmail: false,
            showTime: false,
            showPartyBalance: false,
            showItemDescription: true,
            showRamadan: false,
            enableFreeItemQty: false,
            showAlternateUnit: false,
            priceHistory: false,
            autoApplyLuxury: false,
            selectedIndustry: 'Retail',
            poNumber: false,
            ewayBill: false,
            vehicleNumber: false,
            pricePerItem: true,
            quantity: true,
            batchNo: false,
            expDate: false,
            mfgDate: false,
            bankAccount: 'Select Account',
            signature: 'Leave Empty Space',
            enableReceiverSignature: false
        };
    });

    // Creator state
    const [invoiceType, setInvoiceType] = useState<'invoice' | 'quotation'>('invoice');
    const [customerName, setCustomerName] = useState('');
    const [customerGSTIN, setCustomerGSTIN] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [isInterState, setIsInterState] = useState(false);
    const [items, setItems] = useState<GSTItem[]>([]);
    const [notes, setNotes] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'invoice' | 'quotation'>('all');

    const addItem = () => {
        const newItem: GSTItem = {
            id: `item-${Date.now()}`,
            name: '', hsnCode: '', quantity: 1, unitPrice: 0, discount: 0,
            cgstRate: 9, sgstRate: 9, igstRate: 0,
            cgstAmount: 0, sgstAmount: 0, igstAmount: 0, totalAmount: 0
        };
        setItems([...items, newItem]);
    };

    const updateItem = (index: number, field: keyof GSTItem, value: string | number) => {
        const updated = [...items];
        (updated[index] as any)[field] = value;

        const item = updated[index];
        const baseAmount = item.quantity * item.unitPrice - item.discount;

        if (isInterState) {
            item.cgstRate = 0; item.sgstRate = 0;
            item.igstRate = HSN_PRESETS.find(h => h.code === item.hsnCode)?.gst || 18;
            item.cgstAmount = 0; item.sgstAmount = 0;
            item.igstAmount = Math.round(baseAmount * item.igstRate / 100);
        } else {
            const gstRate = HSN_PRESETS.find(h => h.code === item.hsnCode)?.gst || 18;
            item.cgstRate = gstRate / 2; item.sgstRate = gstRate / 2; item.igstRate = 0;
            item.cgstAmount = Math.round(baseAmount * item.cgstRate / 100);
            item.sgstAmount = Math.round(baseAmount * item.sgstRate / 100);
            item.igstAmount = 0;
        }
        item.totalAmount = baseAmount + item.cgstAmount + item.sgstAmount + item.igstAmount;
        setItems(updated);
    };

    const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

    const totals = useMemo(() => {
        const subtotal = items.reduce((sum, i) => sum + (i.quantity * i.unitPrice - i.discount), 0);
        const totalCGST = items.reduce((sum, i) => sum + i.cgstAmount, 0);
        const totalSGST = items.reduce((sum, i) => sum + i.sgstAmount, 0);
        const totalIGST = items.reduce((sum, i) => sum + i.igstAmount, 0);
        return { subtotal, totalCGST, totalSGST, totalIGST, totalTax: totalCGST + totalSGST + totalIGST, grandTotal: subtotal + totalCGST + totalSGST + totalIGST };
    }, [items]);

    const handleDownloadPDF = async () => {
        if (!invoiceRef.current) return;

        const canvas = await html2canvas(invoiceRef.current, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`${showPreview?.invoiceNumber || 'invoice'}.pdf`);
    };

    const handleSaveInvoice = async () => {
        if (!customerName || items.length === 0) return;
        try {
            const invCount = invoices.filter(i => i.type === invoiceType).length;
            const currentNumber = invoiceSettings.startingNumber + invCount;
            const invoiceData: Partial<GSTInvoiceType> = {
                invoiceNumber: `${invoiceSettings.invoicePrefix}${String(currentNumber).padStart(3, '0')}`,
                type: invoiceType,
                date: new Date().toISOString().split('T')[0],
                dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
                customerName,
                customerGSTIN,
                customerAddress,
                customerPhone,
                sellerGSTIN: invoiceSettings.gstin || '29AADCB2230M1ZT',
                sellerName: invoiceSettings.businessName,
                sellerAddress: invoiceSettings.address,
                subtotal: totals.subtotal,
                totalCGST: totals.totalCGST,
                totalSGST: totals.totalSGST,
                totalIGST: totals.totalIGST,
                totalTax: totals.totalTax,
                grandTotal: totals.grandTotal,
                status: 'Draft',
                notes,
                upiId: invoiceSettings.upiId
            };

            await dbService.createInvoice(invoiceData as any, items);
            await fetchInvoices();
            resetForm();
        } catch (error) {
            console.error('Error saving invoice:', error);
            alert('Failed to save invoice. Please try again.');
        }
    };

    const convertToInvoice = (quotation: GSTInvoiceType) => {
        const invCount = invoices.filter(i => i.type === 'invoice').length + 1;
        const converted: GSTInvoiceType = {
            ...quotation, id: `GST-${Date.now()}`, type: 'invoice',
            invoiceNumber: `VM/2025-26/${String(invCount).padStart(3, '0')}`,
            date: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
            status: 'Unpaid'
        };
        setInvoices(prev => [converted, ...prev.map(i => i.id === quotation.id ? { ...i, status: 'Converted' as const } : i)]);
    };

    const resetForm = () => {
        setShowCreator(false); setCustomerName(''); setCustomerGSTIN(''); setCustomerAddress('');
        setCustomerPhone(''); setItems([]); setNotes(''); setInvoiceType('invoice');
    };

    const filteredInvoices = useMemo(() => {
        return invoices.filter(inv => {
            if (filterType !== 'all' && inv.type !== filterType) return false;
            if (searchQuery && !inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) && !inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            return true;
        });
    }, [invoices, filterType, searchQuery]);

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            'Paid': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
            'Unpaid': 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
            'Overdue': 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
            'Draft': 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
            'Sent': 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
            'Converted': 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400',
        };
        const icons: Record<string, React.ReactNode> = {
            'Paid': <CheckCircle2 className="h-3 w-3" />, 'Unpaid': <Clock className="h-3 w-3" />,
            'Overdue': <AlertCircle className="h-3 w-3" />, 'Draft': <FileText className="h-3 w-3" />,
            'Converted': <ArrowRight className="h-3 w-3" />,
        };
        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${styles[status] || styles['Draft']}`}>
                {icons[status]} {status}
            </span>
        );
    };

    // Invoice Preview Modal
    if (showPreview) {
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                        {showPreview.type === 'quotation' ? 'Quotation' : 'Tax Invoice'} Preview
                    </h2>
                    <div className="flex gap-3">
                        <button onClick={handleDownloadPDF}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all">
                            <Download className="h-4 w-4" /> Download PDF
                        </button>
                        {showPreview.type === 'quotation' && showPreview.status !== 'Converted' && (
                            <button onClick={() => { convertToInvoice(showPreview); setShowPreview(null); }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all">
                                <ArrowRight className="h-4 w-4" /> Convert to Invoice
                            </button>
                        )}
                        <button onClick={() => setShowPreview(null)}
                            className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all hover:bg-slate-200 dark:hover:bg-slate-700">
                            <X className="h-4 w-4" /> Close
                        </button>
                    </div>
                </div>

                {/* Invoice Document */}
                <div ref={invoiceRef} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-700 pb-6 mb-6">
                        <div>
                            <h3 className={`text-2xl font-black ${invoiceSettings.theme === 'Luxury' ? 'text-amber-600' : 'text-indigo-600'}`}>{showPreview.sellerName}</h3>
                            <p className="text-sm text-slate-500 mt-1">{showPreview.sellerAddress}</p>
                            <p className="text-xs font-bold text-slate-400 mt-2">GSTIN: {showPreview.sellerGSTIN}</p>
                            {invoiceSettings.showPhoneNumber && <p className="text-xs text-slate-400">Mob: {invoiceSettings.phone}</p>}
                            {invoiceSettings.showEmail && <p className="text-xs text-slate-400">Email: {invoiceSettings.email}</p>}
                        </div>
                        <div className="text-right">
                            <div className={`text-sm font-black uppercase px-4 py-1.5 rounded-full ${showPreview.type === 'quotation' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400'}`}>
                                {showPreview.type === 'quotation' ? 'Quotation' : 'Tax Invoice'}
                            </div>
                            <p className="text-lg font-black text-slate-800 dark:text-white mt-3">{showPreview.invoiceNumber}</p>
                            <p className="text-sm text-slate-500">Date: {showPreview.date}</p>
                            <p className="text-sm text-slate-500">Due: {showPreview.dueDate}</p>
                        </div>
                    </div>

                    {/* Bill To */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5">
                            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Bill To</p>
                            <p className="font-bold text-slate-800 dark:text-white">{showPreview.customerName}</p>
                            <p className="text-sm text-slate-500">{showPreview.customerAddress}</p>
                            {showPreview.customerGSTIN && <p className="text-xs font-bold text-slate-400 mt-2">GSTIN: {showPreview.customerGSTIN}</p>}
                            <p className="text-xs text-slate-400 mt-1">Phone: {showPreview.customerPhone}</p>
                        </div>
                        {/* QR Code placeholder */}
                        <div className="flex justify-end">
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 text-center w-40">
                                <QrCode className="h-20 w-20 text-slate-300 dark:text-slate-600 mx-auto" />
                                <p className="text-[10px] font-bold text-slate-400 mt-2">Scan to Pay</p>
                                <p className="text-[10px] text-slate-400">{showPreview.upiId}</p>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="overflow-x-auto mb-6">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800">
                                    <th className="text-left p-3 font-bold text-slate-500 text-xs uppercase rounded-l-xl">#</th>
                                    <th className="text-left p-3 font-bold text-slate-500 text-xs uppercase">Item</th>
                                    <th className="text-left p-3 font-bold text-slate-500 text-xs uppercase">HSN</th>
                                    <th className="text-right p-3 font-bold text-slate-500 text-xs uppercase">Qty</th>
                                    <th className="text-right p-3 font-bold text-slate-500 text-xs uppercase">Rate</th>
                                    <th className="text-right p-3 font-bold text-slate-500 text-xs uppercase">CGST</th>
                                    <th className="text-right p-3 font-bold text-slate-500 text-xs uppercase">SGST</th>
                                    <th className="text-right p-3 font-bold text-slate-500 text-xs uppercase">IGST</th>
                                    <th className="text-right p-3 font-bold text-slate-500 text-xs uppercase rounded-r-xl">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {showPreview.items.map((item, idx) => (
                                    <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800">
                                        <td className="p-3 text-slate-400">{idx + 1}</td>
                                        <td className="p-3">
                                            <p className="font-semibold text-slate-800 dark:text-white">{item.name}</p>
                                            {invoiceSettings.showItemDescription && <p className="text-[10px] text-slate-400">{item.name} description</p>}
                                        </td>
                                        <td className="p-3 text-slate-500 font-mono text-xs">{item.hsnCode}</td>
                                        <td className="p-3 text-right text-slate-600 dark:text-slate-300">{item.quantity}</td>
                                        <td className="p-3 text-right text-slate-600 dark:text-slate-300">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                                        <td className="p-3 text-right text-slate-500">₹{item.cgstAmount.toLocaleString('en-IN')}</td>
                                        <td className="p-3 text-right text-slate-500">₹{item.sgstAmount.toLocaleString('en-IN')}</td>
                                        <td className="p-3 text-right text-slate-500">₹{item.igstAmount.toLocaleString('en-IN')}</td>
                                        <td className="p-3 text-right font-bold text-slate-800 dark:text-white">₹{item.totalAmount.toLocaleString('en-IN')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end">
                        <div className="w-72 space-y-2">
                            <div className="flex justify-between text-sm text-slate-500"><span>Subtotal</span><span>₹{showPreview.subtotal.toLocaleString('en-IN')}</span></div>
                            {showPreview.totalCGST > 0 && <div className="flex justify-between text-sm text-slate-500"><span>CGST</span><span>₹{showPreview.totalCGST.toLocaleString('en-IN')}</span></div>}
                            {showPreview.totalSGST > 0 && <div className="flex justify-between text-sm text-slate-500"><span>SGST</span><span>₹{showPreview.totalSGST.toLocaleString('en-IN')}</span></div>}
                            {showPreview.totalIGST > 0 && <div className="flex justify-between text-sm text-slate-500"><span>IGST</span><span>₹{showPreview.totalIGST.toLocaleString('en-IN')}</span></div>}
                            <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-black text-lg text-slate-900 dark:text-white">
                                <span>Grand Total</span><span>₹{showPreview.grandTotal.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>

                    {showPreview.notes && (
                        <div className="mt-6 bg-amber-50 dark:bg-amber-500/5 rounded-xl p-4 border border-amber-100 dark:border-amber-500/10">
                            <p className="text-xs font-bold text-amber-600 mb-1">Notes</p>
                            <p className="text-sm text-amber-700 dark:text-amber-300">{showPreview.notes}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Creator Form
    if (showCreator) {
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                            Create {invoiceType === 'quotation' ? 'Quotation' : 'GST Invoice'}
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">Fill details to generate a GST-compliant document</p>
                    </div>
                    <button onClick={resetForm} className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                </div>

                {/* Type Toggle */}
                <div className="flex gap-3">
                    {(['invoice', 'quotation'] as const).map(type => (
                        <button key={type} onClick={() => setInvoiceType(type)}
                            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all capitalize ${invoiceType === type ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                            {type === 'invoice' ? '🧾 Tax Invoice' : '📝 Quotation'}
                        </button>
                    ))}
                </div>

                {/* Customer Details */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><Receipt className="h-4 w-4 text-indigo-500" /> Customer Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input placeholder="Customer Name *" value={customerName} onChange={e => setCustomerName(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none" />
                        <input placeholder="GSTIN (optional)" value={customerGSTIN} onChange={e => setCustomerGSTIN(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none font-mono" />
                        <input placeholder="Address" value={customerAddress} onChange={e => setCustomerAddress(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none" />
                        <input placeholder="Phone" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    <label className="flex items-center gap-3 mt-4 cursor-pointer">
                        <input type="checkbox" checked={isInterState} onChange={e => setIsInterState(e.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Inter-state supply (IGST instead of CGST+SGST)</span>
                    </label>
                </div>

                {/* Items */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><Calculator className="h-4 w-4 text-indigo-500" /> Line Items</h3>
                        <button onClick={addItem} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all">
                            <Plus className="h-3.5 w-3.5" /> Add Item
                        </button>
                    </div>

                    {items.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            <Calculator className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            <p className="font-medium">No items added yet</p>
                            <p className="text-xs mt-1">Click "Add Item" to start building your invoice</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {items.map((item, idx) => (
                                <div key={item.id} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
                                    <div className="grid grid-cols-12 gap-3 items-center">
                                        <div className="col-span-3">
                                            <input placeholder="Item name" value={item.name} onChange={e => updateItem(idx, 'name', e.target.value)}
                                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 outline-none focus:ring-1 focus:ring-indigo-400" />
                                        </div>
                                        <div className="col-span-2">
                                            <select value={item.hsnCode} onChange={e => updateItem(idx, 'hsnCode', e.target.value)}
                                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm font-medium text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-400">
                                                <option value="">HSN Code</option>
                                                {HSN_PRESETS.map(h => <option key={h.code} value={h.code}>{h.code} - {h.name} ({h.gst}%)</option>)}
                                            </select>
                                        </div>
                                        <div className="col-span-1">
                                            <input type="number" placeholder="Qty" value={item.quantity || ''} onChange={e => updateItem(idx, 'quantity', Number(e.target.value))}
                                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-center font-medium text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-400" />
                                        </div>
                                        <div className="col-span-2">
                                            <input type="number" placeholder="Unit Price ₹" value={item.unitPrice || ''} onChange={e => updateItem(idx, 'unitPrice', Number(e.target.value))}
                                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm font-medium text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-400" />
                                        </div>
                                        <div className="col-span-1">
                                            <input type="number" placeholder="Disc ₹" value={item.discount || ''} onChange={e => updateItem(idx, 'discount', Number(e.target.value))}
                                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm font-medium text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-400" />
                                        </div>
                                        <div className="col-span-2 text-right">
                                            <p className="text-sm font-black text-slate-800 dark:text-white">₹{item.totalAmount.toLocaleString('en-IN')}</p>
                                            <p className="text-[10px] text-slate-400">
                                                Tax: ₹{(item.cgstAmount + item.sgstAmount + item.igstAmount).toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                        <div className="col-span-1 text-right">
                                            <button onClick={() => removeItem(idx)} className="p-2 text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Totals Summary */}
                    {items.length > 0 && (
                        <div className="mt-6 flex justify-end">
                            <div className="w-80 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-500/5 dark:to-blue-500/5 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-500/10">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>₹{totals.subtotal.toLocaleString('en-IN')}</span></div>
                                    {!isInterState && <>
                                        <div className="flex justify-between text-slate-500"><span>CGST</span><span>₹{totals.totalCGST.toLocaleString('en-IN')}</span></div>
                                        <div className="flex justify-between text-slate-500"><span>SGST</span><span>₹{totals.totalSGST.toLocaleString('en-IN')}</span></div>
                                    </>}
                                    {isInterState && <div className="flex justify-between text-slate-500"><span>IGST</span><span>₹{totals.totalIGST.toLocaleString('en-IN')}</span></div>}
                                    <div className="border-t border-indigo-200 dark:border-indigo-500/20 pt-2 flex justify-between font-black text-lg text-indigo-700 dark:text-indigo-300">
                                        <span>Grand Total</span><span>₹{totals.grandTotal.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Notes & Actions */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6">
                    <textarea placeholder="Additional notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-700 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
                </div>

                <div className="flex gap-3 justify-end">
                    <button onClick={resetForm} className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">Cancel</button>
                    <button onClick={handleSaveInvoice} disabled={!customerName || items.length === 0}
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95">
                        <CheckCircle2 className="h-4 w-4" /> Save {invoiceType === 'quotation' ? 'Quotation' : 'Invoice'}
                    </button>
                </div>
            </div>
        );
    }

    // Invoice List View
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">GST Invoicing</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Create GST-compliant invoices and quotations</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => { setInvoiceType('quotation'); setShowCreator(true); }}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95">
                        <FileText className="h-4 w-4" /> New Quotation
                    </button>
                    <button onClick={() => { setInvoiceType('invoice'); setShowCreator(true); }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95">
                        <Plus className="h-4 w-4" /> New GST Invoice
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                    <p className="text-xs font-bold text-slate-400 uppercase">Total Invoices</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{invoices.filter(i => i.type === 'invoice').length}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                    <p className="text-xs font-bold text-emerald-500 uppercase">Total Collected</p>
                    <p className="text-2xl font-black text-emerald-600 mt-1">₹{invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.grandTotal, 0).toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                    <p className="text-xs font-bold text-amber-500 uppercase">Total Pending</p>
                    <p className="text-2xl font-black text-amber-600 mt-1">₹{invoices.filter(i => i.status === 'Unpaid' || i.status === 'Overdue').reduce((s, i) => s + i.grandTotal, 0).toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                    <p className="text-xs font-bold text-purple-500 uppercase">GST Collected</p>
                    <p className="text-2xl font-black text-purple-600 mt-1">₹{invoices.reduce((s, i) => s + i.totalTax, 0).toLocaleString('en-IN')}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3 items-center">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input placeholder="Search by customer or invoice number..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-700 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                    {(['all', 'invoice', 'quotation'] as const).map(type => (
                        <button key={type} onClick={() => setFilterType(type)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all capitalize ${filterType === type ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                            {type === 'all' ? 'All' : type === 'invoice' ? 'Invoices' : 'Quotations'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Invoice Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800">
                            <th className="text-left p-4 text-xs font-bold text-slate-400 uppercase">Invoice #</th>
                            <th className="text-left p-4 text-xs font-bold text-slate-400 uppercase">Customer</th>
                            <th className="text-left p-4 text-xs font-bold text-slate-400 uppercase">Type</th>
                            <th className="text-left p-4 text-xs font-bold text-slate-400 uppercase">Date</th>
                            <th className="text-right p-4 text-xs font-bold text-slate-400 uppercase">Amount</th>
                            <th className="text-right p-4 text-xs font-bold text-slate-400 uppercase">Tax</th>
                            <th className="text-left p-4 text-xs font-bold text-slate-400 uppercase">Status</th>
                            <th className="text-center p-4 text-xs font-bold text-slate-400 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInvoices.map(inv => (
                            <tr key={inv.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="p-4 font-mono text-sm font-bold text-indigo-600">{inv.invoiceNumber}</td>
                                <td className="p-4 font-semibold text-sm text-slate-800 dark:text-white">{inv.customerName}</td>
                                <td className="p-4">
                                    <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-full ${inv.type === 'quotation' ? 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'}`}>
                                        {inv.type}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-slate-500">{inv.date}</td>
                                <td className="p-4 text-right font-bold text-sm text-slate-800 dark:text-white">₹{inv.grandTotal.toLocaleString('en-IN')}</td>
                                <td className="p-4 text-right text-sm text-slate-500">₹{inv.totalTax.toLocaleString('en-IN')}</td>
                                <td className="p-4">{getStatusBadge(inv.status)}</td>
                                <td className="p-4">
                                    <div className="flex justify-center gap-2">
                                        <button onClick={() => setShowPreview(inv)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all text-slate-400 hover:text-indigo-600">
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        {inv.type === 'quotation' && inv.status !== 'Converted' && (
                                            <button onClick={() => convertToInvoice(inv)} className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-all text-slate-400 hover:text-emerald-600" title="Convert to Invoice">
                                                <ArrowRight className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GSTInvoicePage;
