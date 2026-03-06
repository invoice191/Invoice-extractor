
import { ChartDataPoint, BusinessData, Transaction, Warehouse, Invoice, WorkerPerformance, AttendanceLog, PartnerStore, B2BOrder, GSTInvoice, CustomerAccount, Expense, StockAlert } from '../types';


export const generateRevenueTrend = (): ChartDataPoint[] => [
  { name: 'Jan', value: 45000, profit: 12000, expenses: 33000, forecast: 0 },
  { name: 'Feb', value: 52000, profit: 15000, expenses: 37000, forecast: 0 },
  { name: 'Mar', value: 48000, profit: 13500, expenses: 34500, forecast: 0 },
  { name: 'Apr', value: 61000, profit: 19000, expenses: 42000, forecast: 0 },
  { name: 'May', value: 55000, profit: 16500, expenses: 38500, forecast: 0 },
  { name: 'Jun', value: 67000, profit: 21000, expenses: 46000, forecast: 0 },
  { name: 'Jul', value: 72000, profit: 24000, expenses: 48000, forecast: 0 },
  { name: 'Aug', value: 69000, profit: 22500, expenses: 46500, forecast: 0 },
  { name: 'Sep', value: 75000, profit: 26000, expenses: 49000, forecast: 0 },
  { name: 'Oct', value: 82000, profit: 29000, expenses: 53000, forecast: 0 },
  { name: 'Nov', value: 95000, profit: 35000, expenses: 60000, forecast: 110000 },
  { name: 'Dec', value: 120000, profit: 45000, expenses: 75000, forecast: 145000 },
];

export const categorySales = [
  { name: 'Electronics', value: 450000, color: '#3b82f6' },
  { name: 'Apparel', value: 320000, color: '#10b981' },
  { name: 'Home & Kitchen', value: 210000, color: '#f59e0b' },
  { name: 'Beauty', value: 140000, color: '#ef4444' },
  { name: 'Books', value: 85000, color: '#8b5cf6' },
];

export const topProducts = [
  { name: 'Pro Wireless Headphones', revenue: 152000, units: 1200, trend: 12, margin: 35, category: 'Electronics', velocity: 'High' },
  { name: 'Cotton Crew Neck Tee', revenue: 124000, units: 8500, trend: -5, margin: 22, category: 'Apparel', velocity: 'Very High' },
  { name: 'Ergonomic Desk Chair', revenue: 98000, units: 450, trend: 24, margin: 40, category: 'Home', velocity: 'Medium' },
  { name: 'Smart Fitness Tracker', revenue: 85000, units: 1100, trend: 8, margin: 28, category: 'Electronics', velocity: 'High' },
  { name: 'Stainless Steel Water Bottle', revenue: 72000, units: 3400, trend: 15, margin: 45, category: 'Home', velocity: 'High' },
];

export const initialInvoices: Invoice[] = [
  { id: 'INV-2025-001', customerName: 'Rahul Sharma', date: '2025-05-10', amount: 12450, status: 'Paid', items: 3, taxAmount: 2241 },
  { id: 'INV-2025-002', customerName: 'Priya Verma', date: '2025-05-12', amount: 890, status: 'Paid', items: 1, taxAmount: 160 },
  { id: 'INV-2025-003', customerName: 'Anita Gupta', date: '2025-05-14', amount: 4500, status: 'Unpaid', items: 2, taxAmount: 810 },
  { id: 'INV-2025-004', customerName: 'Vikram Singh', date: '2025-05-15', amount: 22100, status: 'Unpaid', items: 5, taxAmount: 3978 },
  { id: 'INV-2025-005', customerName: 'Suresh Kumar', date: '2025-05-16', amount: 1500, status: 'Overdue', items: 1, taxAmount: 270 },
];

export const recentTransactions: Transaction[] = [
  { id: 'ORD-8821', customer: 'Rahul Sharma', date: '2025-05-12 14:30', amount: 12450, method: 'UPI', status: 'Paid', items: 3 },
  { id: 'ORD-8820', customer: 'Priya Verma', date: '2025-05-12 12:15', amount: 890, method: 'Cash', status: 'Paid', items: 1 },
  { id: 'ORD-8819', customer: 'Anita Gupta', date: '2025-05-12 11:05', amount: 4500, method: 'Card', status: 'Pending', items: 2 },
  { id: 'ORD-8818', customer: 'Vikram Singh', date: '2025-05-11 18:45', amount: 22100, method: 'UPI', status: 'Paid', items: 5 },
  { id: 'ORD-8817', customer: 'Suresh Kumar', date: '2025-05-11 16:20', amount: 1500, method: 'Cash', status: 'Overdue', items: 1 },
  { id: 'ORD-8816', customer: 'Sneha Patel', date: '2025-05-11 14:10', amount: 6780, method: 'Card', status: 'Paid', items: 3 },
];

export const warehouseStock: Warehouse[] = [
  { id: 'WH-01', name: 'Bengaluru Main', location: 'Whitefield', stockValue: 850000, capacity: 92 },
  { id: 'WH-02', name: 'Mumbai Hub', location: 'Andheri', stockValue: 420000, capacity: 65 },
  { id: 'WH-03', name: 'Delhi Express', location: 'Okhla', stockValue: 180000, capacity: 40 },
];

export const currentBusinessState: BusinessData = {
  revenue: 852400,
  profit: 243500,
  transactions: 1420,
  aov: 600.02,
  customers: 4500,
  newCustomers: 320,
  inventoryValue: 1250000,
  pendingReceivables: 184500,
  yesterdayRevenue: 24500,
  healthScore: 84
};

export const customerSegments = [
  { name: 'Champions', value: 450, color: '#10b981', description: 'Recent & High Frequency' },
  { name: 'New Customers', value: 1250, color: '#3b82f6', description: 'Joined in last 30 days' },
  { name: 'At Risk', value: 320, color: '#f59e0b', description: 'High churn probability' },
  { name: 'Loyal', value: 2480, color: '#8b5cf6', description: 'Regular purchasers' },
];

// Added missing exports for dashboard components
export const salesByDayAndTime = [
  { day: 'Mon', '12-18': 4500, '18-00': 12000 },
  { day: 'Tue', '12-18': 5200, '18-00': 11000 },
  { day: 'Wed', '12-18': 4800, '18-00': 13000 },
  { day: 'Thu', '12-18': 6100, '18-00': 14000 },
  { day: 'Fri', '12-18': 5500, '18-00': 15500 },
  { day: 'Sat', '12-18': 8500, '18-00': 18000 },
  { day: 'Sun', '12-18': 7200, '18-00': 19500 },
];

export const inventoryAgingData = [
  { range: '0-30 Days', value: 450000 },
  { range: '31-60 Days', value: 320000 },
  { range: '61-90 Days', value: 180000 },
  { range: '90+ Days', value: 120000 },
];

export const supplierPerformance = [
  { id: 'S1', name: 'Global Electronics', score: 92, leadTime: 4, reliability: 98 },
  { id: 'S2', name: 'Fashion Hub', score: 85, leadTime: 7, reliability: 92 },
  { id: 'S3', name: 'Home Essentials', score: 78, leadTime: 12, reliability: 85 },
];

export const deadStockItems = [
  { sku: 'DS-001', name: 'Vintage Radio Clock', stock: 12, lastSold: '2024-11-10', value: 14500 },
  { sku: 'DS-002', name: 'Floral Summer Dress', stock: 45, lastSold: '2024-12-05', value: 22000 },
  { sku: 'DS-003', name: 'Ceramic Vase Set', stock: 8, lastSold: '2025-01-20', value: 8900 },
];

export const geographicData = [
  { state: 'Karnataka', revenue: 450000 },
  { state: 'Maharashtra', revenue: 380000 },
  { state: 'Delhi', revenue: 290000 },
  { state: 'Tamil Nadu', revenue: 210000 },
  { state: 'Telangana', revenue: 150000 },
];

export const opexBreakdown = [
  { name: 'Rent', value: 45000, color: '#3b82f6' },
  { name: 'Salaries', value: 85000, color: '#10b981' },
  { name: 'Utilities', value: 12000, color: '#f59e0b' },
  { name: 'Marketing', value: 25000, color: '#ef4444' },
  { name: 'Misc', value: 18000, color: '#8b5cf6' },
];

export const partnerStores: (PartnerStore & { isTopSeller?: boolean; bestDiscount?: number; serviceRating?: number })[] = [
  {
    id: "PS-001", name: "Organic Harvest", category: "Grocery", location: "Bengaluru", rating: 4.9, activeSince: "2023",
    isTopSeller: true, serviceRating: 4.8, bestDiscount: 25,
    catalog: [
      { id: 'OH-01', name: 'Premium Basmati Rice', retailPrice: 120, wholesalePrice: 85, moq: 50, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400' },
      { id: 'OH-02', name: 'Cold Pressed Coconut Oil', retailPrice: 450, wholesalePrice: 320, moq: 20, image: 'https://images.unsplash.com/photo-1620706122100-31f1bc2a7b2f?q=80&w=400' }
    ]
  },
  {
    id: "PS-002", name: "Tech Hub Electronics", category: "Electronics", location: "Mumbai", rating: 4.8, activeSince: "2024",
    bestDiscount: 35, serviceRating: 4.5,
    catalog: [
      { id: 'TH-01', name: 'Universal Laptop Adapters', retailPrice: 1500, wholesalePrice: 950, moq: 10, image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=400' },
      { id: 'TH-02', name: 'Wireless Ergonomic Mice', retailPrice: 800, wholesalePrice: 450, moq: 25, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=400' }
    ]
  },
  { id: "PS-003", name: "Ethnic Elegance", category: "Apparel", location: "Jaipur", rating: 5.0, activeSince: "2022", isTopSeller: true, bestDiscount: 40, serviceRating: 5.0, catalog: [] },
  { id: "PS-004", name: "Modern Home Decor", category: "Home", location: "Delhi", rating: 4.7, activeSince: "2023", serviceRating: 4.2, bestDiscount: 15, catalog: [] },
  { id: "PS-005", name: "Wellness Point", category: "Pharmacy", location: "Pune", rating: 4.6, activeSince: "2023", serviceRating: 4.9, catalog: [] },
  { id: "PS-006", name: "Daily Needs Mart", category: "Grocery", location: "Chennai", rating: 4.4, activeSince: "2024", isTopSeller: true, catalog: [] },
  { id: "PS-007", name: "Gadget World", category: "Electronics", location: "Hyderabad", rating: 4.7, activeSince: "2022", bestDiscount: 20, catalog: [] },
  { id: "PS-008", name: "Craft & Clay", category: "Home", location: "Kolkata", rating: 4.9, activeSince: "2021", serviceRating: 4.7, catalog: [] },
];

export const initialB2BOrders: B2BOrder[] = [
  { id: 'WH-ORD-001', supplierStore: 'Organic Harvest', date: '2025-05-01', amount: 14500, items: 50, status: 'Delivered' },
  { id: 'WH-ORD-002', supplierStore: 'Tech Hub Electronics', date: '2025-05-12', amount: 8900, items: 10, status: 'Processing' },
];

export const getWorkerPerformance = (id: string): WorkerPerformance => {
  const attendance: AttendanceLog[] = [
    { date: '2025-05-01', checkIn: '09:05', checkOut: '18:15', status: 'Standard' },
    { date: '2025-05-02', checkIn: '08:55', checkOut: '17:30', status: 'Early Leave', notes: 'Family emergency' },
    { date: '2025-05-03', checkIn: '09:10', checkOut: '20:45', status: 'Overshift', notes: 'Stock arrival' },
    { date: '2025-05-04', checkIn: '-', checkOut: '-', status: 'Leave', notes: 'Sick Leave' },
    { date: '2025-05-05', checkIn: '08:50', checkOut: '18:30', status: 'Standard' },
    { date: '2025-05-06', checkIn: '09:00', checkOut: '19:00', status: 'Standard' },
    { date: '2025-05-07', checkIn: '09:15', checkOut: '21:15', status: 'Overshift' },
  ];

  const salesHistory = [
    { date: 'May 01', amount: 12400 },
    { date: 'May 02', amount: 8900 },
    { date: 'May 03', amount: 22100 },
    { date: 'May 04', amount: 0 },
    { date: 'May 05', amount: 15400 },
    { date: 'May 06', amount: 19800 },
    { date: 'May 07', amount: 24500 },
  ];

  const topProducts = [
    { name: 'Wireless Headphones', units: 45 },
    { name: 'Smart Fitness Tracker', units: 32 },
    { name: 'Ergonomic Desk Chair', units: 12 },
  ];

  return {
    workerId: id,
    totalSales: salesHistory.reduce((a, b) => a + b.amount, 0),
    ordersProcessed: 142,
    efficiencyScore: 94,
    punctualityRate: 88,
    salesHistory,
    topProducts,
    attendance,
  };
};

// === GST Invoices Mock Data ===
export const initialGSTInvoices: GSTInvoice[] = [
  {
    id: 'GST-001', invoiceNumber: 'VM/2025-26/001', type: 'invoice', date: '2025-05-10', dueDate: '2025-06-10',
    customerName: 'Rahul Sharma', customerGSTIN: '29AABCS1429B1ZS', customerAddress: 'Whitefield, Bengaluru', customerPhone: '9876543210',
    sellerGSTIN: '29AADCB2230M1ZT', sellerName: 'Vyaparmitra Store', sellerAddress: 'Koramangala, Bengaluru',
    items: [
      { id: 'GI-1', name: 'Wireless Headphones', hsnCode: '8518', quantity: 2, unitPrice: 2500, discount: 0, cgstRate: 9, sgstRate: 9, igstRate: 0, cgstAmount: 450, sgstAmount: 450, igstAmount: 0, totalAmount: 5900 },
      { id: 'GI-2', name: 'Phone Case', hsnCode: '3926', quantity: 3, unitPrice: 350, discount: 50, cgstRate: 9, sgstRate: 9, igstRate: 0, cgstAmount: 162, sgstAmount: 162, igstAmount: 0, totalAmount: 1224 },
    ],
    subtotal: 5950, totalCGST: 612, totalSGST: 612, totalIGST: 0, totalTax: 1224, grandTotal: 7124,
    status: 'Paid', upiId: 'vyaparmitra@upi'
  },
  {
    id: 'GST-002', invoiceNumber: 'VM/2025-26/002', type: 'invoice', date: '2025-05-14', dueDate: '2025-06-14',
    customerName: 'Anita Gupta', customerGSTIN: '27AADCG1234H1Z5', customerAddress: 'Andheri, Mumbai', customerPhone: '9988776655',
    sellerGSTIN: '29AADCB2230M1ZT', sellerName: 'Vyaparmitra Store', sellerAddress: 'Koramangala, Bengaluru',
    items: [
      { id: 'GI-3', name: 'Ergonomic Desk Chair', hsnCode: '9401', quantity: 1, unitPrice: 12000, discount: 500, cgstRate: 0, sgstRate: 0, igstRate: 18, cgstAmount: 0, sgstAmount: 0, igstAmount: 2070, totalAmount: 13570 },
    ],
    subtotal: 11500, totalCGST: 0, totalSGST: 0, totalIGST: 2070, totalTax: 2070, grandTotal: 13570,
    status: 'Unpaid', upiId: 'vyaparmitra@upi'
  },
  {
    id: 'GST-003', invoiceNumber: 'VM/2025-26/Q01', type: 'quotation', date: '2025-05-16', dueDate: '2025-05-30',
    customerName: 'Vikram Singh', customerGSTIN: '07AABCV5678K1ZM', customerAddress: 'Okhla, Delhi', customerPhone: '9123456789',
    sellerGSTIN: '29AADCB2230M1ZT', sellerName: 'Vyaparmitra Store', sellerAddress: 'Koramangala, Bengaluru',
    items: [
      { id: 'GI-4', name: 'Smart Fitness Tracker', hsnCode: '9102', quantity: 10, unitPrice: 3500, discount: 200, cgstRate: 0, sgstRate: 0, igstRate: 18, cgstAmount: 0, sgstAmount: 0, igstAmount: 5940, totalAmount: 38940 },
      { id: 'GI-5', name: 'USB-C Charging Cable', hsnCode: '8544', quantity: 50, unitPrice: 150, discount: 0, cgstRate: 0, sgstRate: 0, igstRate: 18, cgstAmount: 0, sgstAmount: 0, igstAmount: 1350, totalAmount: 8850 },
    ],
    subtotal: 40500, totalCGST: 0, totalSGST: 0, totalIGST: 7290, totalTax: 7290, grandTotal: 47790,
    status: 'Draft', upiId: 'vyaparmitra@upi'
  },
];

// === Customer Accounts Mock Data ===
export const initialCustomerAccounts: CustomerAccount[] = [
  {
    id: 'CA-001', name: 'Rahul Sharma', phone: '9876543210', gstin: '29AABCS1429B1ZS',
    address: 'Whitefield, Bengaluru', creditLimit: 50000, currentBalance: 7124, totalPurchases: 45600,
    lastTransactionDate: '2025-05-10',
    entries: [
      { id: 'LE-1', date: '2025-04-15', type: 'credit', description: 'Invoice VM/2025-26/001', amount: 7124, balance: 7124, invoiceRef: 'GST-001' },
      { id: 'LE-2', date: '2025-04-20', type: 'payment', description: 'UPI Payment Received', amount: 7124, balance: 0 },
      { id: 'LE-3', date: '2025-05-10', type: 'credit', description: 'Invoice VM/2025-26/005', amount: 12450, balance: 12450, invoiceRef: 'INV-2025-001' },
      { id: 'LE-4', date: '2025-05-15', type: 'payment', description: 'Cash Payment', amount: 5000, balance: 7450 },
    ]
  },
  {
    id: 'CA-002', name: 'Anita Gupta', phone: '9988776655', gstin: '27AADCG1234H1Z5',
    address: 'Andheri, Mumbai', creditLimit: 100000, currentBalance: 13570, totalPurchases: 82300,
    lastTransactionDate: '2025-05-14',
    entries: [
      { id: 'LE-5', date: '2025-05-01', type: 'credit', description: 'Invoice VM/2025-26/002', amount: 13570, balance: 13570, invoiceRef: 'GST-002' },
    ]
  },
  {
    id: 'CA-003', name: 'Suresh Kumar', phone: '9112233445',
    address: 'Jayanagar, Bengaluru', creditLimit: 25000, currentBalance: 18500, totalPurchases: 32100,
    lastTransactionDate: '2025-05-16',
    entries: [
      { id: 'LE-6', date: '2025-04-01', type: 'credit', description: 'Purchase - Electronics', amount: 8500, balance: 8500 },
      { id: 'LE-7', date: '2025-04-25', type: 'credit', description: 'Purchase - Accessories', amount: 12000, balance: 20500 },
      { id: 'LE-8', date: '2025-05-05', type: 'payment', description: 'Partial Cash Payment', amount: 2000, balance: 18500 },
    ]
  },
  {
    id: 'CA-004', name: 'Priya Verma', phone: '9876501234',
    address: 'Koramangala, Bengaluru', creditLimit: 30000, currentBalance: 0, totalPurchases: 15600,
    lastTransactionDate: '2025-05-12',
    entries: [
      { id: 'LE-9', date: '2025-05-12', type: 'credit', description: 'Invoice INV-2025-002', amount: 890, balance: 890 },
      { id: 'LE-10', date: '2025-05-12', type: 'payment', description: 'Cash Payment (Full)', amount: 890, balance: 0 },
    ]
  },
];

// === Expenses Mock Data ===
export const initialExpenses: Expense[] = [
  { id: 'EXP-001', date: '2025-05-01', category: 'Rent', description: 'Monthly shop rent - May', amount: 45000, paymentMethod: 'Bank Transfer' },
  { id: 'EXP-002', date: '2025-05-01', category: 'Salary', description: 'Staff salary - 3 employees', amount: 85000, paymentMethod: 'Bank Transfer' },
  { id: 'EXP-003', date: '2025-05-03', category: 'Utilities', description: 'Electricity bill', amount: 8500, paymentMethod: 'UPI' },
  { id: 'EXP-004', date: '2025-05-05', category: 'Marketing', description: 'Google Ads campaign', amount: 12000, paymentMethod: 'Card' },
  { id: 'EXP-005', date: '2025-05-07', category: 'Raw Material', description: 'Wholesale inventory purchase', amount: 125000, paymentMethod: 'Bank Transfer' },
  { id: 'EXP-006', date: '2025-05-09', category: 'Transport', description: 'Courier charges - 50 orders', amount: 3500, paymentMethod: 'Cash' },
  { id: 'EXP-007', date: '2025-05-10', category: 'Utilities', description: 'Internet & phone bill', amount: 3500, paymentMethod: 'UPI' },
  { id: 'EXP-008', date: '2025-05-12', category: 'Maintenance', description: 'AC repair - shop', amount: 4500, paymentMethod: 'Cash' },
  { id: 'EXP-009', date: '2025-05-14', category: 'Marketing', description: 'Festival banner printing', amount: 8000, paymentMethod: 'Cash' },
  { id: 'EXP-010', date: '2025-05-15', category: 'Others', description: 'Office supplies & stationery', amount: 2200, paymentMethod: 'UPI' },
];

// === Stock Alerts Mock Data ===
export const initialStockAlerts: StockAlert[] = [
  { id: 'SA-001', productName: 'Pro Wireless Headphones', sku: 'EL-WH-001', currentStock: 3, reorderPoint: 20, severity: 'critical' },
  { id: 'SA-002', productName: 'Cotton Crew Neck Tee (M)', sku: 'AP-CT-002', currentStock: 8, reorderPoint: 50, severity: 'critical' },
  { id: 'SA-003', productName: 'Smart Fitness Tracker', sku: 'EL-FT-003', currentStock: 15, reorderPoint: 25, severity: 'warning' },
  { id: 'SA-004', productName: 'Organic Honey 500g', sku: 'GR-OH-004', currentStock: 22, reorderPoint: 30, batchNumber: 'B-2025-03', expiryDate: '2025-07-15', severity: 'warning' },
  { id: 'SA-005', productName: 'Protein Bars (Box)', sku: 'GR-PB-005', currentStock: 45, reorderPoint: 40, batchNumber: 'B-2025-01', expiryDate: '2025-06-01', severity: 'critical' },
  { id: 'SA-006', productName: 'Stainless Steel Bottle', sku: 'HK-SB-006', currentStock: 50, reorderPoint: 40, severity: 'info' },
];

