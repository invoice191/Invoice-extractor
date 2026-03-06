import React, { useState } from 'react';
import {
    Store, Search, Share2, ShoppingBag, ArrowRight, Star,
    Smartphone, MessageCircle, ExternalLink, QrCode, Filter,
    Tag, Info, Check, ShieldCheck, Plus
} from 'lucide-react';

const STORE_PRODUCT_PRESETS = [
    { id: 'OS-1', name: 'Premium Wireless Headphones', price: 2999, originalPrice: 4500, category: 'Electronics', rating: 4.8, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400' },
    { id: 'OS-2', name: 'Smart Fitness Band', price: 1599, originalPrice: 2499, category: 'Electronics', rating: 4.5, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=400' },
    { id: 'OS-3', name: 'Ergonomic Office Chair', price: 8999, originalPrice: 12000, category: 'Home', rating: 4.7, image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=400' },
    { id: 'OS-4', name: 'Stainless Steel Water Bottle', price: 799, originalPrice: 1200, category: 'Home', rating: 4.9, image: 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?q=80&w=400' },
    { id: 'OS-5', name: 'Organic Cotton T-Shirt', price: 499, originalPrice: 899, category: 'Apparel', rating: 4.4, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400' },
    { id: 'OS-6', name: 'Mechanical Gaming Keyboard', price: 3499, originalPrice: 5000, category: 'Electronics', rating: 4.6, image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=400' },
];

const OnlineStore: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isCopying, setIsCopying] = useState(false);

    const categories = ['All', 'Electronics', 'Home', 'Apparel'];

    const filteredProducts = STORE_PRODUCT_PRESETS.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleShare = () => {
        const url = 'https://vyaparmitra.live/my-store';
        navigator.clipboard.writeText(url);
        setIsCopying(true);
        setTimeout(() => setIsCopying(false), 2000);
    };

    const shareOnWhatsApp = () => {
        const message = `Check out our online catalog at Vyaparmitra: https://vyaparmitra.live/my-store. Order directly via WhatsApp!`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 rounded-[3rem] p-8 text-white shadow-xl shadow-indigo-200 dark:shadow-none relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Store className="h-64 w-64" />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <div className="bg-white/20 w-fit px-4 py-1.5 rounded-full backdrop-blur-md mb-4 flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Verified Merchant Store</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-[0.9]">
                            Your Online <br /> <span className="text-white/70 italic">Digital Showroom</span>
                        </h2>
                        <p className="text-indigo-100 font-medium mt-4 leading-relaxed">
                            Launch your business into the digital age. Share your catalog via WhatsApp, SMS, or Social Media and collect orders 24/7.
                        </p>

                        <div className="flex flex-wrap gap-4 mt-8">
                            <button
                                onClick={handleShare}
                                className="bg-white text-indigo-700 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-50 transition-all active:scale-95"
                            >
                                {isCopying ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                                {isCopying ? 'Copied Link' : 'Copy Store Link'}
                            </button>
                            <button
                                onClick={shareOnWhatsApp}
                                className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-600 transition-all active:scale-95 border border-white/20"
                            >
                                <MessageCircle className="h-4 w-4" /> Share on WhatsApp
                            </button>
                        </div>
                    </div>

                    <div className="flex bg-white/10 backdrop-blur-xl p-6 rounded-[2rem] border border-white/20 items-center gap-6">
                        <div className="bg-white p-3 rounded-2xl">
                            <QrCode className="h-24 w-24 text-indigo-900" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-indigo-100 tracking-wider">Store QR Code</p>
                            <h4 className="font-black text-lg">Instant Access</h4>
                            <p className="text-xs text-indigo-100/70 mt-1">Download and print for your <br /> physical counter.</p>
                            <button className="text-[10px] font-black text-white uppercase mt-4 underline underline-offset-4 decoration-white/40">Download PNG</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Management Section */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                    <div>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                            <ShoppingBag className="h-6 w-6 text-indigo-600" /> Online Catalog
                        </h3>
                        <p className="text-slate-500 font-medium text-sm mt-1">Manage what your customers see in your digital store</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-300 w-full sm:w-64 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                        </div>
                        <div className="flex bg-slate-50 dark:bg-slate-800 rounded-2xl p-1">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="group bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] overflow-hidden border border-transparent hover:border-indigo-100 dark:hover:border-indigo-500/20 transition-all hover:shadow-xl hover:shadow-indigo-500/5">
                            <div className="aspect-[4/3] overflow-hidden relative">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                    <span className="text-[10px] font-black text-slate-800 dark:text-white">{product.rating}</span>
                                </div>
                                <div className="absolute top-4 right-4 h-8 w-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-center rounded-xl shadow-sm text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer">
                                    <ExternalLink className="h-4 w-4" />
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{product.category}</span>
                                    <div className="flex flex-col items-end">
                                        <span className="text-lg font-black text-slate-900 dark:text-white leading-none">₹{product.price.toLocaleString('en-IN')}</span>
                                        <span className="text-[10px] font-bold text-slate-400 line-through mt-1">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                                <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors">{product.name}</h4>

                                <div className="mt-6 flex gap-2">
                                    <button className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                                        Edit Visibility
                                    </button>
                                    <button className="bg-indigo-600 text-white w-12 flex items-center justify-center rounded-xl hover:bg-indigo-700 transition-all">
                                        <Smartphone className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add Placeholder */}
                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-8 group cursor-pointer hover:border-indigo-400 transition-all">
                        <div className="h-16 w-16 bg-white dark:bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-slate-300 dark:text-slate-600 group-hover:scale-110 group-hover:text-indigo-500 transition-all shadow-sm">
                            <Plus className="h-8 w-8" />
                        </div>
                        <p className="mt-4 font-black text-slate-400 group-hover:text-indigo-500 transition-all text-xs uppercase tracking-widest">Add Catalog Item</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnlineStore;
