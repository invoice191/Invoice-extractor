import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search, ShoppingCart, Plus, Minus, Trash2, X, CheckCircle2, Zap,
  Filter, MoreVertical, ChevronRight, CreditCard, Wallet, Smartphone,
  Info, PackagePlus, Camera, Tag, Layers, Image as ImageIcon,
  ChevronDown, Check, FolderPlus, QrCode
} from 'lucide-react';
import { dbService } from '../services/database';
import { supabase } from '../lib/supabase';

interface POSProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  description: string;
  barcode?: string;
}

const initialProducts: POSProduct[] = [
  { id: '1', name: 'Pro Wireless Headphones', price: 4500, category: 'Electronics', stock: 42, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400', description: 'Studio quality noise cancelling wireless headphones with 40h battery life.', barcode: '8901234567890' },
  { id: '2', name: 'Cotton Crew Neck Tee', price: 899, category: 'Apparel', stock: 120, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400', description: '100% premium cotton everyday essentials with breathable fabric.', barcode: '8901234567891' },
  { id: '3', name: 'Smart Fitness Tracker', price: 2999, category: 'Electronics', stock: 15, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80&w=400', description: 'Track steps, sleep, and heart rate with a crisp OLED display.', barcode: '8901234567892' },
  { id: '4', name: 'Ergonomic Desk Chair', price: 8500, category: 'Home', stock: 8, image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&q=80&w=400', description: 'Full lumbar support with adjustable armrests and mesh backing.', barcode: '8901234567893' },
  { id: '5', name: 'Stainless Steel Water Bottle', price: 1249, category: 'Home', stock: 55, image: 'https://images.unsplash.com/photo-1602143399827-bd95967c7967?auto=format&fit=crop&q=80&w=400', description: 'Vacuum insulated flask keeps beverages cold for 24 hours.', barcode: '8901234567894' },
  { id: '6', name: 'Leather Slim Wallet', price: 1899, category: 'Accessories', stock: 20, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=400', description: 'Genuine top-grain leather with RFID blocking technology.', barcode: '8901234567895' },
];


const DashboardPOS: React.FC = () => {
  const [products, setProducts] = useState<POSProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(['Electronics', 'Apparel', 'Home', 'Accessories']);
  const [cart, setCart] = useState<{ product: POSProduct; quantity: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<POSProduct | null>(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();

    const channel = supabase.channel('pos-products').on('postgres_changes',
      { event: '*', schema: 'public', table: 'products' },
      (payload) => {
        console.log('Realtime product update:', payload);
        fetchProducts();
      }
    ).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await dbService.getProducts();
      setProducts(data as any);
      // Optionally derive categories from products
      const uniqueCats = Array.from(new Set(data.map((p: any) => p.category)));
      if (uniqueCats.length > 0) setCategories(uniqueCats as string[]);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Modal Internal State
  const [isAddingNewTypeInline, setIsAddingNewTypeInline] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<{ id: string; total: number } | null>(null);
  const [isScanningMode, setIsScanningMode] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'Electronics',
    stock: '',
    description: '',
    image: '',
    barcode: ''
  });

  const displayCategories = ['All', ...categories];

  const handleBarcodeScan = (barcode: string) => {
    const product = products.find(p => p.barcode === barcode);
    if (product) {
      addToCart(product);
      // Optional: Visual feedback maybe?
    }
  };

  const handleCheckout = () => {
    const orderId = `VM-POS-${Math.floor(100000 + Math.random() * 900000)}`;
    setLastOrder({ id: orderId, total: cartTotal * 1.18 });
    setCart([]);
    setIsCheckoutModalOpen(true);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const addToCart = (product: POSProduct) => {
    if (product.stock <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productToAdd = {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        stock: parseInt(newProduct.stock),
        description: newProduct.description,
        image: newProduct.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400',
        barcode: newProduct.barcode
      };
      await dbService.addProduct(productToAdd);
      await fetchProducts();
      setIsAddProductModalOpen(false);
      setNewProduct({ name: '', price: '', category: categories[0] || '', stock: '', description: '', image: '', barcode: '' });
      setIsAddingNewTypeInline(false);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleInlineTypeAdd = () => {
    if (newTypeName.trim() && !categories.includes(newTypeName.trim())) {
      setCategories([...categories, newTypeName.trim()]);
      setNewProduct({ ...newProduct, category: newTypeName.trim() });
      setNewTypeName('');
      setIsAddingNewTypeInline(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-140px)] animate-fade-in">
      {/* --- Products Catalog Section --- */}
      <div className="flex-1 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Terminal Console</h2>
            <p className="text-slate-500 font-medium">Point of sale interface for active transactions.</p>
          </div>

          <button
            onClick={() => setIsAddProductModalOpen(true)}
            className="flex items-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-105 transition-all group active:scale-95"
          >
            <Plus className="h-5 w-5" /> Add New Product
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by product name, SKU, or barcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none dark:text-white"
            />
          </div>
          <div className="flex gap-2 items-center overflow-x-auto pb-1 custom-scrollbar">
            {displayCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === cat
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-6 flex flex-col group hover:shadow-2xl hover:border-blue-200 transition-all duration-500 relative overflow-hidden"
            >
              <div className="relative h-56 w-full rounded-[2rem] overflow-hidden mb-6 bg-slate-50 dark:bg-slate-800">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur px-3 py-1.5 rounded-xl font-black text-xs shadow-xl flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${product.stock < 10 ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                  {product.stock} in Stock
                </div>
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="absolute bottom-4 left-4 bg-slate-900/80 hover:bg-slate-900 text-white p-3 rounded-2xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0"
                >
                  <Info className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.category}</span>
                  <span className="text-xl font-black text-blue-600">₹{product.price.toLocaleString('en-IN')}</span>
                </div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white leading-tight mb-4 group-hover:text-blue-600 transition-colors">{product.name}</h4>
              </div>
              <button
                onClick={() => addToCart(product)}
                disabled={product.stock <= 0}
                className="w-full bg-slate-50 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50 active:scale-95 border border-slate-100 dark:border-slate-700"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- Cart Sidebar --- */}
      <div className="w-full lg:w-96 space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden sticky top-24">
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
            <h3 className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-3">
              <ShoppingCart className="h-6 w-6 text-blue-600" /> Current Cart
            </h3>
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black">{cart.length}</span>
          </div>

          <div className="p-8 max-h-[450px] overflow-y-auto space-y-6 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-300">
                  <ShoppingCart className="h-10 w-10" />
                </div>
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Cart is Empty</p>
              </div>
            ) : cart.map(item => (
              <div key={item.product.id} className="flex gap-4 group">
                <div className="h-16 w-16 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <img src={item.product.image} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-1">
                  <h5 className="text-sm font-black text-slate-900 dark:text-white line-clamp-1">{item.product.name}</h5>
                  <p className="text-blue-600 font-bold text-xs">₹{item.product.price.toLocaleString('en-IN')}</p>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-xl">
                      <button onClick={() => updateCartQuantity(item.product.id, -1)} className="p-1 hover:text-blue-600 transition-colors"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.product.id, 1)} className="p-1 hover:text-blue-600 transition-colors"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id)} className="text-slate-300 hover:text-rose-500 p-1"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>Tax (GST 18%)</span>
                <span>₹{(cartTotal * 0.18).toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between">
                <span className="text-lg font-black text-slate-900 dark:text-white">Grand Total</span>
                <span className="text-2xl font-black text-blue-600 tracking-tighter">₹{(cartTotal * 1.18).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl hover:border-blue-300 transition-all group">
                <Smartphone className="h-5 w-5 text-slate-400 group-hover:text-blue-600 mb-2" />
                <span className="text-[9px] font-black uppercase tracking-widest">UPI Scan</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl hover:border-blue-300 transition-all group">
                <CreditCard className="h-5 w-5 text-slate-400 group-hover:text-blue-600 mb-2" />
                <span className="text-[9px] font-black uppercase tracking-widest">Card Tap</span>
              </button>
            </div>

            <button
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-lg tracking-tight hover:brightness-110 shadow-2xl shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              Checkout <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* --- Receipt Modal --- */}
      {isCheckoutModalOpen && lastOrder && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setIsCheckoutModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up border border-slate-100 dark:border-slate-800 p-8 text-center">
            <div className="h-20 w-20 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Sale Complete!</h3>
            <p className="text-slate-500 font-medium text-xs mb-8 uppercase tracking-widest">Order ID: {lastOrder.id}</p>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-6 mb-8 border border-slate-100 dark:border-slate-700">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Paid</p>
              <p className="text-4xl font-black text-blue-600 tracking-tighter">₹{lastOrder.total.toLocaleString('en-IN')}</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 p-4 rounded-2xl flex flex-col items-center">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl mb-3">
                  <QrCode className="h-32 w-32 text-slate-800 dark:text-white" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scan for Digital Receipt</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="py-4 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                <FolderPlus className="h-4 w-4" /> Print
              </button>
              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                className="py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Product Detail Modal --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setSelectedProduct(null)}></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-slide-up border border-slate-100 dark:border-slate-800">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-8 right-8 p-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur rounded-full text-slate-500 hover:scale-110 transition-transform z-10">
              <X className="h-6 w-6" />
            </button>
            <div className="flex flex-col md:flex-row h-full">
              <div className="w-full md:w-1/2 h-80 md:h-auto bg-slate-100">
                <img src={selectedProduct.image} className="w-full h-full object-cover" />
              </div>
              <div className="w-full md:w-1/2 p-10 md:p-14 space-y-8 flex flex-col justify-center">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">{selectedProduct.category}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SKU: {selectedProduct.id.padStart(4, '0')}</span>
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight mb-2">{selectedProduct.name}</h3>
                  <p className="text-3xl font-black text-blue-600">₹{selectedProduct.price.toLocaleString('en-IN')}</p>
                </div>

                <div className="space-y-4">
                  <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Product Intelligence</h5>
                  <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{selectedProduct.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Available Units</p>
                    <p className={`text-2xl font-black ${selectedProduct.stock < 10 ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>{selectedProduct.stock}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Stock Status</p>
                    <p className="text-sm font-black text-emerald-600 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" /> Fully Active
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                  className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-6 rounded-[2rem] font-black text-xl hover:brightness-110 transition-all flex items-center justify-center gap-3"
                >
                  <ShoppingCart className="h-6 w-6" /> Add to Sale
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Add Product Modal --- */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => { setIsAddProductModalOpen(false); setIsAddingNewTypeInline(false); }}></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-slide-up border border-slate-100 dark:border-slate-800">
            <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl text-white">
                  <PackagePlus className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">SKU Onboarding</h3>
                  <p className="text-slate-500 font-medium">Standardized product entry template</p>
                </div>
              </div>
              <button onClick={() => { setIsAddProductModalOpen(false); setIsAddingNewTypeInline(false); }} className="p-3 hover:bg-white dark:hover:bg-slate-700 rounded-full text-slate-400">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddProduct}>
              <div className="p-10 space-y-8 overflow-y-auto max-h-[60vh] custom-scrollbar">
                {/* Image Placeholder */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Visual Identity</label>
                  <div className="relative h-48 bg-slate-50 dark:bg-slate-800 border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center group cursor-pointer hover:border-blue-300 transition-all overflow-hidden">
                    {newProduct.image ? (
                      <img src={newProduct.image} className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <div className="bg-white dark:bg-slate-700 p-5 rounded-full shadow-lg mb-4 group-hover:scale-110 transition-transform">
                          <ImageIcon className="h-8 w-8 text-blue-600" />
                        </div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Upload Product Photograph</p>
                      </>
                    )}
                    <input
                      type="text"
                      placeholder="Paste Image URL..."
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[80%] bg-white/90 px-4 py-2 rounded-xl text-[10px] font-bold outline-none border border-slate-200"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Descriptor</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Wireless Buds 2.0"
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unit Price (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="0.00"
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1 mb-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Category</label>
                      <button
                        type="button"
                        onClick={() => setIsAddingNewTypeInline(!isAddingNewTypeInline)}
                        className="text-[9px] font-black text-blue-600 uppercase hover:underline flex items-center gap-1"
                      >
                        {isAddingNewTypeInline ? <X className="h-2 w-2" /> : <Plus className="h-2 w-2" />}
                        {isAddingNewTypeInline ? 'Cancel' : 'Add New'}
                      </button>
                    </div>

                    {isAddingNewTypeInline ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          autoFocus
                          placeholder="Type Name..."
                          value={newTypeName}
                          onChange={(e) => setNewTypeName(e.target.value)}
                          className="flex-1 bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-100 dark:border-blue-800 rounded-2xl px-4 py-3.5 text-sm font-bold dark:text-white outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleInlineTypeAdd}
                          className="p-3.5 bg-blue-600 text-white rounded-2xl shadow-lg active:scale-95 transition-all"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <select
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-sm font-black dark:text-white outline-none appearance-none"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Initial Inventory</label>
                    <input
                      type="number"
                      required
                      placeholder="100"
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Retail Description</label>
                  <textarea
                    required
                    placeholder="Provide customer-facing specifications..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] px-5 py-4 text-sm font-medium dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 h-32 resize-none"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="p-10 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                <button
                  type="button"
                  onClick={() => { setIsAddProductModalOpen(false); setIsAddingNewTypeInline(false); }}
                  className="flex-1 py-5 px-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[2rem] text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-5 px-8 bg-blue-600 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-2xl shadow-blue-500/20 hover:brightness-110 active:scale-95 transition-all"
                >
                  Register SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPOS;
