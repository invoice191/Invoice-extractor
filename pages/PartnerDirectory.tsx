
import React, { useState, useMemo } from 'react';
import { 
  Store, 
  Star, 
  MapPin, 
  ChevronRight, 
  Search, 
  ArrowLeft, 
  TrendingUp, 
  Percent, 
  Award, 
  ArrowRight,
  LayoutGrid,
  Sparkles,
  Zap,
  ShoppingBag,
  ShieldCheck,
  PieChart
} from 'lucide-react';
import { partnerStores } from '../data/mockData';

interface PartnerDirectoryProps {
  onBack: () => void;
  onSelectShop: (shopId: string) => void;
}

const PartnerDirectory: React.FC<PartnerDirectoryProps> = ({ onBack, onSelectShop }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Grocery', 'Electronics', 'Apparel', 'Home', 'Pharmacy'];

  const getCategoryImage = (category: string) => {
    switch (category) {
      case 'Grocery': return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800';
      case 'Electronics': return 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800';
      case 'Apparel': return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800';
      case 'Pharmacy': return 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=800';
      case 'Home': return 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?auto=format&fit=crop&q=80&w=800';
      default: return 'https://images.unsplash.com/photo-1534452285072-8e90f4bd0ffd?auto=format&fit=crop&q=80&w=800';
    }
  };

  const filteredShops = useMemo(() => {
    return partnerStores.filter(shop => {
      const matchesCat = activeCategory === 'All' || shop.category === activeCategory;
      const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            shop.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100">
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-slate-100 h-24 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
          <button 
            onClick={onBack}
            className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all font-black text-slate-900 uppercase text-xs tracking-widest shadow-sm active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" /> Main Website
          </button>
          <div className="flex items-center gap-4">
             <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100"><Store className="text-white h-6 w-6" /></div>
             <h1 className="text-2xl font-black text-slate-900 tracking-tighter">Network Directory</h1>
          </div>
          <div className="hidden lg:flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
             <ShieldCheck className="h-5 w-5 text-emerald-600" />
             <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Verified Partners Only</span>
          </div>
        </div>
      </nav>

      <main className="pt-40 pb-40 max-w-7xl mx-auto px-6">
        <section className="space-y-12">
          <div className="flex flex-col xl:flex-row justify-between items-end gap-8 border-b border-slate-100 pb-12">
            <div>
              <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight">Partner Explorer</h3>
              <p className="text-slate-500 font-medium mt-2 text-lg">Direct sourcing from over {partnerStores.length} verified Indian retailers.</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search stores..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-80 bg-slate-50 border-2 border-transparent rounded-[1.5rem] pl-14 pr-6 py-4 text-sm font-bold focus:bg-white focus:border-indigo-600 outline-none transition-all shadow-inner"
                />
              </div>
              <div className="flex bg-slate-50 p-1.5 rounded-[1.75rem] shadow-inner overflow-x-auto custom-scrollbar">
                {categories.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setActiveCategory(cat)}
                    className={`px-8 py-3 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-400 hover:text-slate-700'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredShops.length > 0 ? filteredShops.map(shop => (
              <div 
                key={shop.id}
                onClick={() => onSelectShop(shop.id)}
                className="group relative h-[480px] rounded-[4rem] overflow-hidden shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] transition-all cursor-pointer bg-slate-100"
              >
                <div className="absolute inset-0 z-0">
                   <img 
                    src={getCategoryImage(shop.category)} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    alt={shop.name}
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
                </div>

                <div className="relative z-10 p-10 h-full flex flex-col text-white">
                   <div className="flex justify-between items-start">
                      <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                         <Store className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex items-center gap-1 bg-amber-400/90 backdrop-blur-sm px-3 py-1.5 rounded-xl">
                        <Star className="h-3.5 w-3.5 text-slate-900 fill-slate-900" />
                        <span className="text-[11px] font-black text-slate-900">{shop.rating}</span>
                      </div>
                   </div>

                   <div className="mt-auto space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-indigo-500/90 backdrop-blur-sm px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/20">Verified</span>
                        <span className="bg-emerald-500/90 backdrop-blur-sm px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/10">{shop.category}</span>
                      </div>
                      <h4 className="text-3xl font-black tracking-tight leading-none group-hover:text-blue-400 transition-colors">{shop.name}</h4>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-white/10">
                        <div className="flex items-center gap-2 opacity-80 text-xs font-bold uppercase tracking-widest">
                           <MapPin className="h-4 w-4" /> {shop.location}
                        </div>
                        <div className="w-12 h-12 bg-white text-slate-950 rounded-2xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all shadow-xl active:scale-90">
                           <ArrowRight className="h-6 w-6" />
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-40 text-center space-y-6 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-100">
                <div className="bg-white p-8 rounded-full w-fit mx-auto shadow-xl"><Search className="h-12 w-12 text-slate-200" /></div>
                <p className="text-slate-400 font-black uppercase text-sm tracking-widest">No matching stores found.</p>
                <button onClick={() => {setActiveCategory('All'); setSearchQuery('');}} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl">Clear All Filters</button>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <footer className="bg-white border-t border-slate-100 py-20">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10 opacity-50">
            <div className="flex items-center gap-3">
               <PieChart className="h-6 w-6 text-slate-400" />
               <span className="font-black text-xl tracking-tighter">Vyaparmitra</span>
            </div>
            <p className="text-xs font-black uppercase tracking-widest">© 2025 Indian Retail Network</p>
         </div>
      </footer>
    </div>
  );
};

export default PartnerDirectory;
