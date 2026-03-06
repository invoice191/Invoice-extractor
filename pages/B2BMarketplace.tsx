
import React, { useState, useMemo } from 'react';
import { 
  Store, 
  Search, 
  Star, 
  MapPin, 
  ChevronRight, 
  Package, 
  ArrowLeft, 
  ShoppingCart, 
  TrendingUp, 
  CheckCircle2, 
  Plus, 
  Minus, 
  Trash2, 
  X, 
  Check, 
  Truck, 
  Clock, 
  ShieldCheck,
  Zap,
  MessageSquare,
  LayoutGrid,
  List,
  Info,
  HelpCircle,
  ArrowRight,
  Send
} from 'lucide-react';
import { partnerStores, initialB2BOrders } from '../data/mockData';
import { PartnerStore, B2BOrder } from '../types';

const B2BMarketplace: React.FC = () => {
  const [view, setView] = useState<'hub' | 'store'>('hub');
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');
  const [selectedStore, setSelectedStore] = useState<PartnerStore | null>(null);
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [orders, setOrders] = useState<B2BOrder[]>(initialB2BOrders);
  const [isOrdering, setIsOrdering] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryText, setInquiryText] = useState("");

  const handleStoreClick = (store: PartnerStore) => {
    setSelectedStore(store);
    setView('store');
    setCart({});
  };

  const updateCart = (productId: string, delta: number, moq: number) => {
    setCart(prev => {
      const current = prev[productId] || 0;
      let next = 0;
      
      if (current === 0 && delta > 0) {
        next = moq; // Start at minimum
      } else {
        next = current + delta;
      }
      
      if (next < moq && delta < 0) {
        const { [productId]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: next };
    });
  };

  const cartTotal = useMemo((): number => {
    if (!selectedStore) return 0;
    return selectedStore.catalog.reduce((acc: number, item) => {
      return acc + (Number(item.wholesalePrice) * (Number(cart[item.id]) || 0));
    }, 0);
  }, [cart, selectedStore]);

  const totalItems = (Object.values(cart) as number[]).reduce((a: number, b: number) => a + b, 0);

  const handleCheckout = () => {
    if (!selectedStore) return;
    setIsOrdering(true);
    setTimeout(() => {
      const newOrder: B2BOrder = {
        id: `WH-ORD-${Math.floor(Math.random() * 9000) + 1000}`,
        supplierStore: selectedStore.name,
        date: new Date().toLocaleDateString('en-IN'),
        amount: cartTotal,
        items: totalItems,
        status: 'Sent'
      };
      setOrders([newOrder, ...orders]);
      setIsOrdering(false);
      setView('hub');
      alert(`🎉 Bulk order sent! ${selectedStore.name} will contact you shortly.`);
    }, 1500);
  };

  const handleSendInquiry = () => {
    alert(`Message sent to ${selectedStore?.name}. They usually reply within 2 hours.`);
    setInquiryText("");
    setShowInquiryModal(false);
  };

  if (view === 'store' && selectedStore) {
    return (
      <div className="space-y-6 animate-fade-in pb-32">
        {/* Simple Navigation Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView('hub')}
              className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-500 hover:text-indigo-600 transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Store className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{selectedStore.name}</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedStore.category} • {selectedStore.location}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <button 
              onClick={() => setShowInquiryModal(true)}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-slate-100 dark:border-slate-800 rounded-xl text-xs font-black text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all"
            >
              <MessageSquare className="h-4 w-4" /> Ask Question
            </button>
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-2.5 rounded-xl border border-emerald-100">
               <ShieldCheck className="h-4 w-4 text-emerald-600" />
               <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Wholesale Rates</span>
            </div>
          </div>
        </div>

        {/* Catalog Control Area */}
        <div className="flex justify-between items-center px-1">
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-3">
             <Package className="h-5 w-5 text-indigo-600" /> Stock Catalog
          </h3>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
             <button 
              onClick={() => setDisplayMode('grid')}
              className={`p-2 rounded-lg transition-all ${displayMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-400'}`}
             >
                <LayoutGrid className="h-4 w-4" />
             </button>
             <button 
              onClick={() => setDisplayMode('list')}
              className={`p-2 rounded-lg transition-all ${displayMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-400'}`}
             >
                <List className="h-4 w-4" />
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            {displayMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedStore.catalog.map(product => (
                  <div key={product.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-emerald-500 text-white px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg">
                        Save ₹{Number(product.retailPrice) - Number(product.wholesalePrice)}/unit
                      </span>
                    </div>
                    <div className="h-44 rounded-[1.5rem] overflow-hidden mb-5 bg-slate-50 relative border border-slate-50">
                      <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={product.name} />
                    </div>
                    <h4 className="text-base font-black text-slate-900 dark:text-white mb-0.5">{product.name}</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">Code: {product.id}</p>
                    
                    <div className="flex justify-between items-center mb-5">
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 line-through">Retail: ₹{product.retailPrice}</p>
                        <p className="text-xl font-black text-indigo-600">₹{product.wholesalePrice}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Min. Order</p>
                        <p className="text-xs font-black text-slate-700 dark:text-slate-300">{product.moq} Units</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-100 dark:border-slate-700">
                         <button 
                            onClick={() => updateCart(product.id, -10, product.moq)}
                            className="p-2.5 bg-white dark:bg-slate-700 rounded-lg shadow-sm text-slate-400 hover:text-rose-500 transition-all active:scale-90"
                          >
                           <Minus className="h-3.5 w-3.5" />
                         </button>
                         <span className="font-black text-slate-900 dark:text-white text-base">{cart[product.id] || 0}</span>
                         <button 
                            onClick={() => updateCart(product.id, 10, product.moq)}
                            className="p-2.5 bg-white dark:bg-slate-700 rounded-lg shadow-sm text-slate-400 hover:text-emerald-500 transition-all active:scale-90"
                          >
                           <Plus className="h-3.5 w-3.5" />
                         </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      <th className="px-6 py-4">Product Name</th>
                      <th className="px-6 py-4">Wholesale Price</th>
                      <th className="px-6 py-4">Min Order</th>
                      <th className="px-6 py-4 text-center">Order Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {selectedStore.catalog.map(product => (
                      <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-5">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-slate-100">
                                <img src={product.image} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="font-black text-slate-900 dark:text-white text-sm">{product.name}</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase">{product.id}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-5">
                           <p className="text-base font-black text-indigo-600">₹{product.wholesalePrice}</p>
                           <p className="text-[9px] text-slate-400 line-through">MRP: ₹{product.retailPrice}</p>
                        </td>
                        <td className="px-6 py-5">
                           <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-black text-slate-500">{product.moq} Units</span>
                        </td>
                        <td className="px-6 py-5">
                           <div className="flex items-center justify-center gap-3 bg-slate-50 dark:bg-slate-800 p-1 rounded-lg border border-slate-100 w-fit mx-auto">
                              <button onClick={() => updateCart(product.id, -10, product.moq)} className="p-1 hover:text-rose-500"><Minus className="h-3 w-3" /></button>
                              <span className="font-black text-slate-900 dark:text-white min-w-[15px] text-center text-xs">{cart[product.id] || 0}</span>
                              <button onClick={() => updateCart(product.id, 10, product.moq)} className="p-1 hover:text-emerald-500"><Plus className="h-3 w-3" /></button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-slate-900 p-7 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-2xl sticky top-24">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2.5">
                    <ShoppingCart className="h-5 w-5 text-indigo-600" /> Order Summary
                  </h3>
                  {totalItems > 0 && (
                    <span className="bg-indigo-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full animate-pulse">{totalItems} Units</span>
                  )}
               </div>

               <div className="space-y-3 mb-8 min-h-[100px]">
                  {Object.entries(cart).map(([id, qty]) => {
                    const item = selectedStore.catalog.find(p => p.id === id);
                    if (!item) return null;
                    const quantity = Number(qty);
                    return (
                      <div key={id} className="flex justify-between items-center group">
                         <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-[9px] font-black text-slate-400">{quantity}</div>
                            <p className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors truncate max-w-[150px]">{item.name}</p>
                         </div>
                         <span className="font-black text-slate-900 dark:text-white text-xs">₹{(item.wholesalePrice * quantity).toLocaleString('en-IN')}</span>
                      </div>
                    );
                  })}
                  {Object.keys(cart).length === 0 && (
                    <div className="flex flex-col items-center justify-center py-6 text-center gap-2">
                       <Package className="h-7 w-7 text-slate-200" />
                       <p className="text-slate-400 font-medium italic text-xs">No items added to bulk order.</p>
                    </div>
                  )}
               </div>

               <div className="pt-6 border-t-2 border-dashed border-slate-100 dark:border-slate-800 space-y-6">
                  <div className="flex justify-between items-center">
                     <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total Bill Value</p>
                        <p className="text-2xl font-black text-indigo-600 tracking-tighter">₹{cartTotal.toLocaleString('en-IN')}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-0.5">You Saved</p>
                        <p className="text-lg font-black text-emerald-600">₹{(Number(cartTotal) * 0.15).toLocaleString('en-IN')}</p>
                     </div>
                  </div>

                  <button 
                    disabled={cartTotal === 0 || isOrdering}
                    onClick={handleCheckout}
                    className="w-full bg-indigo-600 text-white py-4 rounded-[1.5rem] font-black text-base hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
                  >
                    {isOrdering ? <Zap className="h-5 w-5 animate-spin" /> : <Truck className="h-5 w-5" />}
                    {isOrdering ? 'Booking Sourcing...' : 'Place Bulk Order'}
                  </button>
                  
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100">
                     <HelpCircle className="h-4 w-4 text-slate-400" />
                     <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 leading-tight">
                        Order sent as a request. Seller will call you for delivery & payment logistics.
                     </p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Inquiry Modal */}
        {showInquiryModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setShowInquiryModal(false)}></div>
             <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-slide-up">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/30">
                   <div className="flex items-center gap-2.5">
                      <MessageSquare className="h-5 w-5 text-indigo-600" />
                      <h4 className="text-lg font-black text-slate-900 tracking-tight">Ask {selectedStore.name}</h4>
                   </div>
                   <button onClick={() => setShowInquiryModal(false)} className="p-2 hover:bg-white rounded-full transition-all"><X className="h-5 w-5 text-slate-400" /></button>
                </div>
                <div className="p-6 space-y-5">
                   <p className="text-xs font-medium text-slate-500">Need custom pricing or delivery details? Send a quick message:</p>
                   <textarea 
                    value={inquiryText}
                    onChange={(e) => setInquiryText(e.target.value)}
                    placeholder="e.g. Bulk pricing for 200+ units?"
                    className="w-full h-28 p-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-xl text-sm font-bold focus:border-indigo-500 outline-none resize-none"
                   ></textarea>
                   <button 
                    onClick={handleSendInquiry}
                    className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg"
                   >
                     Send Message <Send className="h-3.5 w-3.5" />
                   </button>
                </div>
             </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Search & Hero Section */}
      <div className="relative bg-indigo-600 rounded-[2.5rem] p-8 md:p-12 text-white overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
         <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
            <div className="flex-1 space-y-4 text-center lg:text-left">
               <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/20 text-[9px] font-black uppercase tracking-widest">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> 1,500+ Local Suppliers
               </div>
               <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight">Wholesale Marketplace</h2>
               <p className="text-indigo-100 text-base md:text-lg font-medium max-w-lg mx-auto lg:mx-0">
                  Buy stock directly from other local shops at lower rates. No middleman, just growth.
               </p>
            </div>
            <div className="w-full max-w-sm space-y-4">
               <div className="relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Stock requirements..." 
                    className="w-full bg-white text-slate-900 border-none rounded-2xl pl-12 pr-6 py-4 text-base font-black focus:ring-8 focus:ring-white/10 outline-none shadow-2xl"
                  />
               </div>
               <div className="flex justify-center lg:justify-start gap-3">
                  {['Grocery', 'Electronics', 'Fashion'].map(cat => (
                    <button key={cat} className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/10 transition-all">{cat}</button>
                  ))}
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Stores List */}
        <div className="lg:col-span-8 space-y-5">
          <h3 className="text-lg font-black text-slate-900 dark:text-white px-1 flex items-center gap-2.5">
             <Store className="h-5 w-5 text-indigo-600" /> Top Partner Shops Nearby
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {partnerStores.map(store => (
              <div 
                key={store.id}
                onClick={() => handleStoreClick(store)}
                className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:border-indigo-200 transition-all cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-5 transition-opacity">
                   <Store className="h-24 w-24 text-slate-900" />
                </div>
                <div className="flex justify-between items-start mb-5">
                   <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                      <Store className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors" />
                   </div>
                   <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                      <Star className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />
                      <span className="text-[9px] font-black text-amber-700">{store.rating}</span>
                   </div>
                </div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white mb-0.5 group-hover:text-indigo-600 transition-colors">{store.name}</h4>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{store.category}</span>
                  <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                  <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <MapPin className="h-3 w-3" /> {store.location}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-5 border-t border-slate-50 dark:border-slate-800">
                   <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">View Catalog</p>
                   <div className="bg-indigo-50 p-1.5 rounded-lg text-indigo-600 group-hover:translate-x-1 transition-all">
                      <ArrowRight className="h-3.5 w-3.5" />
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tracking & Insight Sidebar */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-900 p-7 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
              <h3 className="text-lg font-black mb-5 flex items-center gap-2.5">
                 <Zap className="h-5 w-5 text-amber-400" /> Buyer Tooltip
              </h3>
              <div className="space-y-4">
                 <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-[9px] font-black uppercase text-indigo-400 mb-1">Local Trend</p>
                    <p className="text-xs font-medium leading-relaxed">Vendors in <span className="text-white font-black">Bengaluru</span> have surplus <span className="text-emerald-400 font-bold">Electronics</span>. Rates are 12% lower than usual.</p>
                 </div>
                 <button className="w-full bg-white text-slate-900 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all shadow-lg active:scale-95">Check Best Deals</button>
              </div>
           </div>

           <div className="bg-white dark:bg-slate-900 p-7 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-base font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2.5">
                 <Truck className="h-5 w-5 text-indigo-600" /> Active Orders
              </h3>
              <div className="space-y-6">
                 {orders.map(order => (
                   <div key={order.id} className="space-y-2 group cursor-pointer">
                      <div className="flex justify-between items-start">
                         <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                               <Package className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                            </div>
                            <div className="min-w-0">
                               <p className="text-xs font-black text-slate-800 dark:text-white truncate">{order.supplierStore}</p>
                               <p className="text-[8px] font-bold text-slate-400 uppercase">{order.id}</p>
                            </div>
                         </div>
                         <p className="text-xs font-black text-slate-900 dark:text-white">₹{order.amount.toLocaleString('en-IN')}</p>
                      </div>
                      
                      <div className="flex items-center justify-between gap-1 px-0.5">
                         {[1,2,3,4].map(step => (
                            <div key={step} className={`h-1 flex-1 rounded-full ${
                               order.status === 'Delivered' ? 'bg-emerald-500' :
                               (step === 1 ? 'bg-indigo-600' : (step === 2 && order.status === 'Processing' ? 'bg-indigo-400' : 'bg-slate-100 dark:bg-slate-800'))
                            }`}></div>
                         ))}
                      </div>
                      <div className="flex justify-between items-center text-[7px] font-black uppercase tracking-widest text-slate-400">
                         <span className={order.status === 'Sent' ? 'text-indigo-600' : ''}>Sent</span>
                         <span className={order.status === 'Processing' ? 'text-indigo-600' : ''}>Ready</span>
                         <span>Ship</span>
                         <span className={order.status === 'Delivered' ? 'text-emerald-600' : ''}>Done</span>
                      </div>
                   </div>
                 ))}
                 <button className="w-full pt-4 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors border-t border-slate-50 dark:border-slate-800">Order Archive</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default B2BMarketplace;
