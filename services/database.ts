import { supabase } from '../lib/supabase';
import { CustomerAccount, Expense, GSTInvoice, StockAlert } from '../types';

export const dbService = {
    // Customers
    async getCustomers() {
        const { data, error } = await supabase
            .from('customers')
            .select('*')
            .order('name');
        if (error) throw error;
        return data;
    },

    async addCustomer(customer: Partial<CustomerAccount>) {
        const { data, error } = await supabase
            .from('customers')
            .insert([customer])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // Products / Inventory
    async getProducts() {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('name');
        if (error) throw error;
        return data;
    },

    async addProduct(product: any) {
        const { data, error } = await supabase
            .from('products')
            .insert([product])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // Invoices
    async getInvoices() {
        const { data, error } = await supabase
            .from('invoices')
            .select(`
        *,
        customers(name),
        invoice_items (*)
      `)
            .order('date', { ascending: false });
        if (error) throw error;
        return data;
    },

    async createInvoice(invoice: Partial<GSTInvoice>, items: any[]) {
        const { data: invoiceData, error: invoiceError } = await supabase
            .from('invoices')
            .insert([invoice])
            .select()
            .single();

        if (invoiceError) throw invoiceError;

        const itemsWithInvoiceId = items.map(item => ({
            ...item,
            invoice_id: invoiceData.id
        }));

        const { error: itemsError } = await supabase
            .from('invoice_items')
            .insert(itemsWithInvoiceId);

        if (itemsError) throw itemsError;
        return invoiceData;
    },

    // Expenses
    async getExpenses() {
        const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .order('date', { ascending: false });
        if (error) throw error;
        return data;
    },

    async addExpense(expense: Partial<Expense>) {
        const { data, error } = await supabase
            .from('expenses')
            .insert([expense])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // Warehouses
    async getWarehouses() {
        const { data, error } = await supabase
            .from('warehouses')
            .select('*')
            .order('name');
        if (error) throw error;
        return data;
    },

    async addWarehouse(warehouse: any) {
        const { data, error } = await supabase
            .from('warehouses')
            .insert([warehouse])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // Ledger Entries
    async getLedgerEntries(customerId: string) {
        const { data, error } = await supabase
            .from('ledger_entries')
            .select('*')
            .eq('customer_id', customerId)
            .order('date', { ascending: false });
        if (error) throw error;
        return data;
    },

    async addLedgerEntry(entry: any) {
        const { data, error } = await supabase
            .from('ledger_entries')
            .insert([entry])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // B2B Orders
    async getB2BOrders() {
        const { data, error } = await supabase
            .from('b2b_orders')
            .select('*')
            .order('date', { ascending: false });
        if (error) throw error;
        return data;
    },

    async addB2BOrder(order: any) {
        const { data, error } = await supabase
            .from('b2b_orders')
            .insert([order])
            .select()
            .single();
        if (error) throw error;
        return data;
    }
};
