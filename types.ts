
export enum UserRole {
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  ANALYST = 'Analyst',
  VIEWER = 'Viewer'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface Metric {
  label: string;
  value: string | number;
  trend: number;
  prefix?: string;
  suffix?: string;
  description?: string;
}

export interface Transaction {
  id: string;
  customer: string;
  date: string;
  amount: number;
  method: 'Cash' | 'UPI' | 'Card' | 'Credit';
  status: 'Paid' | 'Pending' | 'Overdue';
  items: number;
}

export interface Invoice {
  id: string;
  customerName: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  items?: number;
  taxAmount?: number;
  imageUrl?: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  stockValue: number;
  capacity: number;
}

export interface BusinessData {
  revenue: number;
  profit: number;
  transactions: number;
  aov: number;
  customers: number;
  newCustomers: number;
  inventoryValue: number;
  pendingReceivables: number;
  yesterdayRevenue: number;
  healthScore: number;
}

export interface BusinessInsightResponse {
  text: string;
  sources?: { uri: string; title: string }[];
}

export interface ChartDataPoint {
  name: string;
  value: number;
  profit: number;
  expenses: number;
  forecast: number;
}

export interface AttendanceLog {
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'Standard' | 'Early Leave' | 'Overshift' | 'Leave';
  notes?: string;
}

export interface WorkerPerformance {
  workerId: string;
  totalSales: number;
  ordersProcessed: number;
  efficiencyScore: number;
  punctualityRate: number;
  salesHistory: { date: string; amount: number }[];
  topProducts: { name: string; units: number }[];
  attendance: AttendanceLog[];
}

export interface B2BOrder {
  id: string;
  supplierStore: string;
  date: string;
  amount: number;
  items: number;
  status: 'Draft' | 'Sent' | 'Processing' | 'Shipped' | 'Delivered';
}

export interface PartnerStore {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  activeSince: string;
  catalog: {
    id: string;
    name: string;
    retailPrice: number;
    wholesalePrice: number;
    moq: number;
    image: string;
  }[];
}

// GST Invoice Types
export interface GSTItem {
  id: string;
  name: string;
  hsnCode: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalAmount: number;
}

export interface GSTInvoice {
  id: string;
  invoiceNumber: string;
  type: 'invoice' | 'quotation' | 'proforma';
  date: string;
  dueDate: string;
  customerName: string;
  customerGSTIN: string;
  customerAddress: string;
  customerPhone: string;
  sellerGSTIN: string;
  sellerName: string;
  sellerAddress: string;
  items: GSTItem[];
  subtotal: number;
  totalCGST: number;
  totalSGST: number;
  totalIGST: number;
  totalTax: number;
  grandTotal: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Unpaid' | 'Overdue' | 'Converted';
  notes?: string;
  upiId?: string;
}

// Customer Ledger Types
export interface CustomerLedgerEntry {
  id: string;
  date: string;
  type: 'credit' | 'debit' | 'payment';
  description: string;
  amount: number;
  balance: number;
  invoiceRef?: string;
}

export interface CustomerAccount {
  id: string;
  name: string;
  phone: string;
  gstin?: string;
  address: string;
  creditLimit: number;
  currentBalance: number;
  totalPurchases: number;
  lastTransactionDate: string;
  entries: CustomerLedgerEntry[];
}

// Expense Types
export interface Expense {
  id: string;
  date: string;
  category: 'Rent' | 'Salary' | 'Utilities' | 'Raw Material' | 'Marketing' | 'Transport' | 'Maintenance' | 'Others';
  description: string;
  amount: number;
  paymentMethod: 'Cash' | 'UPI' | 'Bank Transfer' | 'Card';
  receiptUrl?: string;
}

// Stock Alert Types  
export interface StockAlert {
  id: string;
  productName: string;
  sku: string;
  currentStock: number;
  reorderPoint: number;
  batchNumber?: string;
  expiryDate?: string;
  severity: 'critical' | 'warning' | 'info';
}
// Invoice Settings Types
export interface InvoiceSettings {
  businessName: string;
  gstin: string;
  address: string;
  phone: string;
  email: string;
  upiId: string;
  invoicePrefix: string;
  startingNumber: number;
  terms: string;
  signatureUrl?: string;
  showSignatureBox: boolean;
  theme: string;
  primaryColor: string;
  showPhoneNumber: boolean;
  showEmail: boolean;
  showTime: boolean;
  showPartyBalance: boolean;
  showItemDescription: boolean;
  // UI Display & Logic Settings
  showRamadan: boolean;
  enableFreeItemQty: boolean;
  showAlternateUnit: boolean;
  priceHistory: boolean;
  autoApplyLuxury: boolean;
  selectedIndustry: string;
  poNumber: boolean;
  ewayBill: boolean;
  vehicleNumber: boolean;
  pricePerItem: boolean;
  quantity: boolean;
  batchNo: boolean;
  expDate: boolean;
  mfgDate: boolean;
  bankAccount: string;
  signature: string;
  enableReceiverSignature: boolean;
}
