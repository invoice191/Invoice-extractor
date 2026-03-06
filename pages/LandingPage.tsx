
import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  BarChart3,
  Zap,
  PieChart,
  Users,
  Layers,
  Smartphone,
  Lock,
  MessageCircle,
  X,
  Send,
  Sparkles,
  Edit3,
  Check,
  Palette,
  Mail,
  MapPin,
  Phone,
  Globe,
  Calendar,
  ShieldCheck,
  TrendingUp,
  Award,
  Menu,
  Store,
  Star,
  Search as SearchIcon,
  ChevronRight,
  Globe2,
  Cpu,
  ShieldAlert,
  BarChart,
  Truck,
  CreditCard
} from 'lucide-react';
import { getSupportResponse } from '../services/geminiService';
import { Footerdemo } from '@/components/ui/footer-section';
import { partnerStores } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import OnboardingWizard from '../components/OnboardingWizard';

interface LandingPageProps {
  onStart: () => void;
  onNavigateToDirectory: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onNavigateToDirectory }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { t } = useLanguage();
  const [siteConfig, setSiteConfig] = useState(() => {
    const saved = localStorage.getItem('vip_site_config');
    return saved ? JSON.parse(saved) : {
      heroTitle: t('heroTitle'),
      heroDesc: t('heroDesc'),
      primaryColor: "#2563eb",
      contactAddress: "Suite 402, Innovate Plaza, Bengaluru, KA 560001",
      contactEmail: "hello@vyaparmitra.in",
      contactPhone: "+91 80 4567 8901",
      footerTagline: "Building the future of Indian retail analytics."
    };
  });

  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: "Namaste! I'm your Vyaparmitra Assistant. How can I help you grow your business today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    localStorage.setItem('vip_site_config', JSON.stringify(siteConfig));
    document.documentElement.style.setProperty('--primary-color', siteConfig.primaryColor);
  }, [siteConfig]);

  const handleSupportSend = async () => {
    if (!supportMessage.trim()) return;
    const msg = supportMessage;
    setSupportMessage("");
    setChatHistory(prev => [...prev, { role: 'user', text: msg }]);
    setIsTyping(true);

    const aiResponse = await getSupportResponse(msg, []);
    setChatHistory(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setIsTyping(false);
  };

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
    }
  };

  const EditableText = ({ id, value, className, multiline = false }: { id: string, value: string, className: string, multiline?: boolean }) => {
    if (!isEditMode) return <div className={className}>{value}</div>;

    return multiline ? (
      <textarea
        className={`${className} bg-blue-50/50 border-2 border-dashed border-blue-300 rounded-lg p-2 focus:border-blue-500 focus:outline-none w-full min-h-[100px]`}
        value={value}
        onChange={(e) => setSiteConfig({ ...siteConfig, [id]: e.target.value })}
      />
    ) : (
      <input
        className={`${className} bg-blue-50/50 border-2 border-dashed border-blue-300 rounded-lg p-2 focus:border-blue-500 focus:outline-none w-full text-center`}
        value={value}
        onChange={(e) => setSiteConfig({ ...siteConfig, [id]: e.target.value })}
      />
    );
  };

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

  const MagneticButton = ({ children, onClick, className, variant = "primary" }: { children: React.ReactNode, onClick?: () => void, className?: string, variant?: "primary" | "secondary" }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const handleMouse = (e: React.MouseEvent) => {
      const { clientX, clientY, currentTarget } = e;
      const { left, top, width, height } = currentTarget.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      setPosition({ x: x * 0.3, y: y * 0.3 });
    };
    const reset = () => setPosition({ x: 0, y: 0 });

    return (
      <motion.button
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        onClick={onClick}
        className={`${className} premium-button h-16 px-10 rounded-2xl flex items-center justify-center gap-3 shadow-2xl active:scale-95 group overflow-hidden ${variant === "primary" ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm"
          }`}
      >
        <span className="relative z-10 flex items-center gap-3">{children}</span>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </motion.button>
    );
  };

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 relative overflow-x-hidden">
      <div className="fixed bottom-6 left-6 z-[100] flex flex-col items-start gap-3">
        {isEditMode && (
          <div className="flex bg-white border border-slate-200 rounded-2xl p-2 gap-2 shadow-2xl animate-fade-in mb-2">
            <div className="flex flex-col gap-1 items-center px-2">
              <Palette className="h-4 w-4 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400">THEME</span>
            </div>
            {['#2563eb', '#7c3aed', '#059669', '#dc2626', '#1e293b'].map(color => (
              <button
                key={color}
                onClick={() => setSiteConfig({ ...siteConfig, primaryColor: color })}
                className="w-10 h-10 rounded-xl transition-transform hover:scale-110 active:scale-90 shadow-sm border-2 border-white"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className={`flex items-center gap-2 px-6 py-4 rounded-2xl shadow-2xl transition-all duration-500 transform ${isEditMode ? 'bg-emerald-600 text-white hover:scale-105' : 'bg-slate-900 text-white hover:scale-110'}`}
        >
          {isEditMode ? <Check className="h-5 w-5" /> : <Edit3 className="h-5 w-5" />}
          <span className="font-bold text-sm hidden sm:inline">{isEditMode ? 'Save Changes' : 'Customize Platform'}</span>
        </button>
      </div>

      <div className="fixed bottom-6 right-6 z-[100]">
        <button
          onClick={() => setIsSupportOpen(!isSupportOpen)}
          className="bg-blue-600 text-white p-4 sm:p-5 rounded-full shadow-2xl hover:scale-110 hover:rotate-12 transition-all duration-500 group relative border-4 border-white"
          style={{ backgroundColor: siteConfig.primaryColor }}
        >
          {isSupportOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
          {!isSupportOpen && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
          )}
        </button>
      </div>

      <div className={`fixed bottom-24 right-6 w-full sm:w-[400px] max-w-[calc(100vw-3rem)] bg-white rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.25)] z-[100] overflow-hidden transition-all duration-500 transform origin-bottom-right border border-slate-100 ${isSupportOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        <div className="bg-blue-600 p-6 text-white" style={{ backgroundColor: siteConfig.primaryColor }}>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-2xl shadow-inner"><Sparkles className="h-6 w-6" /></div>
            <div>
              <h4 className="font-bold text-lg">Vyaparmitra Assistant</h4>
              <p className="text-xs text-white/80 font-medium">Empowering Indian Retail</p>
            </div>
          </div>
        </div>
        <div className="h-[400px] sm:h-[450px] overflow-y-auto p-6 space-y-4 bg-slate-50/80 scroll-smooth">
          {chatHistory.map((chat, i) => (
            <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-[1.25rem] text-sm leading-relaxed ${chat.role === 'user'
                ? 'bg-blue-600 text-white rounded-tr-none shadow-xl shadow-blue-100'
                : 'bg-white text-slate-800 border border-slate-200/50 rounded-tl-none shadow-sm'
                }`} style={chat.role === 'user' ? { backgroundColor: siteConfig.primaryColor } : {}}>
                {chat.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1.5 shadow-sm">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>
        <div className="p-5 border-t border-slate-100 bg-white">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Ask away..."
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSupportSend()}
              className="flex-1 bg-slate-100/50 border-2 border-transparent rounded-[1.25rem] px-5 py-3 text-sm focus:bg-white focus:border-blue-500/20 focus:ring-0 focus:outline-none transition-all"
            />
            <button
              onClick={handleSupportSend}
              className="bg-blue-600 text-white p-3.5 rounded-[1.25rem] hover:scale-105 active:scale-95 transition-all shadow-lg"
              style={{ backgroundColor: siteConfig.primaryColor }}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100/50 transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={(e) => scrollToSection(e as any, 'home')}
            >
              <div className="p-2 rounded-[0.9rem] group-hover:scale-110 transition-all duration-500 shadow-sm" style={{ backgroundColor: siteConfig.primaryColor }}>
                <PieChart className="text-white h-6 w-6" />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">Vyaparmitra</span>
            </div>

            <div className="hidden lg:flex items-center gap-10 text-[11px] font-black text-slate-600">
              <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:text-blue-600 transition-colors uppercase tracking-widest">{t('features')}</a>
              <a href="#solutions" onClick={(e) => scrollToSection(e, 'solutions')} className="hover:text-blue-600 transition-colors uppercase tracking-widest">{t('solutions')}</a>
              <button
                onClick={onNavigateToDirectory}
                className="hover:text-blue-600 transition-colors uppercase tracking-widest font-black"
              >
                {t('partnerStores')}
              </button>
              <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="hover:text-blue-600 transition-colors uppercase tracking-widest">{t('contact')}</a>
              <button
                onClick={() => setShowOnboarding(true)}
                className="bg-slate-900 text-white px-8 py-3 rounded-full hover:bg-slate-800 transition-all shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)] active:scale-95 font-black uppercase tracking-widest"
              >
                {t('launchDashboard')}
              </button>
            </div>

            <button
              className="lg:hidden p-2 text-slate-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <div className={`lg:hidden bg-white border-b border-slate-100 transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-96' : 'max-h-0'}`}>
          <div className="px-6 py-8 flex flex-col gap-6 text-sm font-bold text-slate-600">
            <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:text-blue-600 transition-colors uppercase tracking-widest">{t('features')}</a>
            <a href="#solutions" onClick={(e) => scrollToSection(e, 'solutions')} className="hover:text-blue-600 transition-colors uppercase tracking-widest">{t('solutions')}</a>
            <button
              onClick={onNavigateToDirectory}
              className="text-left hover:text-blue-600 transition-colors uppercase tracking-widest font-bold"
            >
              {t('partnerStores')}
            </button>
            <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="hover:text-blue-600 transition-colors uppercase tracking-widest">{t('contact')}</a>
            <button
              onClick={onStart}
              className="bg-slate-900 text-white px-8 py-4 rounded-2xl hover:bg-slate-800 transition-all font-black uppercase tracking-wider text-center"
            >
              {t('launchDashboard')}
            </button>
          </div>
        </div>
      </nav>

      <section id="home" className="relative pt-32 pb-10 lg:pt-48 lg:pb-32 min-h-screen flex items-center overflow-hidden">
        <div className="hero-mesh" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-8"
              >
                <Sparkles className="h-4 w-4" />
                <span>{t('nextGenRetail')}</span>
              </motion.div>

              <h1 className="text-6xl sm:text-8xl font-black tracking-tighter leading-[0.95] mb-8 text-slate-950">
                {t('dataDrivenGrowth').split(' ').slice(0, 2).join(' ')} <br />
                <span className="text-indigo-600 italic">{t('dataDrivenGrowth').split(' ').slice(2, 3).join(' ')}</span> <br />
                {t('dataDrivenGrowth').split(' ').slice(3).join(' ')}
              </h1>

              <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-lg font-medium">
                Transform your local shop into an intelligence-powered enterprise.
                Automate inventory, predict sales, and master your cash flow with one click.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <MagneticButton onClick={onStart}>
                  {t('launchDashboard')}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </MagneticButton>

                <MagneticButton onClick={onNavigateToDirectory} variant="secondary">
                  <Store className="h-5 w-5" />
                  {t('marketplace')}
                </MagneticButton>
              </div>

              <div className="mt-12 flex items-center gap-8 grayscale opacity-50">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-slate-900">1.5k+</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">{t('activeShops')}</span>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-slate-900">₹4.2 Cr</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">{t('revenueTracked')}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "backOut" }}
              className="relative hidden lg:block"
            >
              {/* Product Mockup Container */}
              <div className="relative z-20 rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-4 border-white/50 bg-white">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bbbda5366d71?auto=format&fit=crop&q=80&w=1200"
                  alt="Dashboard Preview"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-8">
                  <div className="text-white">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1">Live Feed</p>
                    <p className="text-xl font-bold">Real-time Inventory Sync</p>
                  </div>
                </div>
              </div>

              {/* Floating Performance Cards */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 z-30 glass-card p-6 rounded-3xl"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-500/10 p-3 rounded-2xl text-emerald-600"><TrendingUp className="h-6 w-6" /></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Daily Revenue</p>
                    <p className="text-xl font-black text-slate-900">+₹42,300</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-10 -left-10 z-30 glass-card p-6 rounded-3xl"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-600"><Zap className="h-6 w-6" /></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Efficiency Meta</p>
                    <p className="text-xl font-black text-slate-900">98.4% Accuracy</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- STRATEGIC SOLUTIONS SECTION --- */}
      <section id="solutions" className="py-24 sm:py-32 bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-20 sm:mb-24"
          >
            <h2 className="font-black tracking-[0.3em] uppercase text-[10px] sm:text-xs mb-6 text-indigo-400">The Modern Retail Engine</h2>
            <p className="text-4xl sm:text-6xl font-black text-white tracking-tighter mb-6 leading-tight">Digital Mastery for <br /> Offline Shops.</p>
            <p className="text-slate-400 font-medium text-lg sm:text-xl">We bridge the gap between traditional Kirana wisdom and enterprise-grade intelligence.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {[
              {
                icon: Cpu,
                title: 'AI Business Coach',
                desc: 'Gemini-powered insights that analyze your sales patterns to suggest what to stock and how to outpace local competition.',
                stats: '35% Higher Accuracy',
                tags: ['Predictive Analytics', 'Strategy Hub'],
                photo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800'
              },
              {
                icon: ShieldAlert,
                title: 'Financial Safeguard',
                desc: 'Automated P&L, GST reconciliation, and Smart Invoicing that flags potential audit risks automatically.',
                stats: 'Zero Compliance Lag',
                tags: ['GST-Ready', 'Financial Purity'],
                photo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800'
              },
              {
                icon: Truck,
                title: 'Direct Sourcing Hub',
                desc: 'Skip the middlemen. Buy inventory directly from our verified network of 1,500+ local wholesale-ready partner shops.',
                stats: 'Bulk Sourcing Savings',
                tags: ['Marketplace', 'Wholesale'],
                photo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'
              },
              {
                icon: CreditCard,
                title: 'Omnichannel POS',
                desc: 'A unified billing terminal that handles UPI, Cash, and Card seamlessly while syncing stock levels.',
                stats: 'Fastest Checkout Flow',
                tags: ['UPI Integrated', 'Cloud POS'],
                photo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800'
              }
            ].map((sol, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-white/5 border border-white/10 rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden flex flex-col hover:border-indigo-500/50 transition-all duration-700 h-full shadow-2xl"
              >
                <div className="h-56 sm:h-64 overflow-hidden relative">
                  <img src={sol.photo} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-1000 group-hover:scale-110" alt={sol.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                    {sol.tags.map(tag => <span key={tag} className="px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[8px] font-black uppercase tracking-widest border border-white/10 text-white">{tag}</span>)}
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="bg-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center text-white mb-6 shadow-xl -mt-16 relative z-20 group-hover:scale-110 group-hover:rotate-12 transition-all">
                      <sol.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight leading-none">{sol.title}</h3>
                    <p className="text-slate-400 text-base sm:text-lg leading-relaxed font-medium mb-6">{sol.desc}</p>
                  </div>
                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-1">Impact Factor</span>
                      <span className="text-lg font-black text-white">{sol.stats}</span>
                    </div>
                    <button className="p-4 bg-white text-slate-950 rounded-xl hover:bg-indigo-500 hover:text-white transition-all shadow-xl active:scale-90">
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 sm:mt-24 p-10 sm:p-16 rounded-[3rem] sm:rounded-[4rem] bg-indigo-600 text-white relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(79,70,229,0.4)]">
            <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Cpu className="h-64 w-64" /></div>
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="max-w-xl text-center lg:text-left">
                <h4 className="text-3xl sm:text-4xl font-black tracking-tight mb-6 leading-tight">Transform your shop <br className="hidden sm:block" /> into a data powerhouse.</h4>
                <p className="text-base sm:text-lg text-indigo-100 font-medium leading-relaxed">Join thousands of Indian vendors who use Vyaparmitra to automate their success every day.</p>
              </div>
              <button onClick={onStart} className="w-full lg:w-auto px-12 py-6 bg-white text-indigo-600 rounded-[1.5rem] font-black uppercase text-base tracking-widest hover:scale-110 transition-all shadow-2xl active:scale-95 group">
                Launch App <ArrowRight className="inline-block ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- Partner Network Explorer --- */}
      <section id="shops" className="py-20 sm:py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="font-black tracking-[0.3em] uppercase text-[10px] sm:text-xs mb-4 sm:mb-5" style={{ color: siteConfig.primaryColor }}>Network Explorer</h2>
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter mb-5">Registered Partner Stores</p>
            <p className="text-slate-500 font-medium text-base max-w-xl mx-auto">Discover highly selling shops and exclusive wholesale discounts in our community.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {partnerStores.slice(0, 6).map((shop, i) => (
              <div
                key={i}
                className="bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden h-[420px] flex flex-col cursor-pointer"
                onClick={onNavigateToDirectory}
              >
                <div className="absolute inset-0 z-0">
                  <img
                    src={getCategoryImage(shop.category)}
                    alt={shop.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
                </div>

                <div className="relative z-10 p-8 mt-auto flex flex-col h-full text-white">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/20">
                      <Store className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex items-center gap-1 bg-amber-400/90 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                      <Star className="h-3 w-3 text-slate-900 fill-slate-900" />
                      <span className="text-[10px] font-black text-slate-900">{shop.rating}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 mt-auto">
                    <div className="flex items-center gap-2">
                      <span className="bg-indigo-500 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest">Verified Seller</span>
                      <span className="bg-emerald-500 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest">{shop.category}</span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-black tracking-tight leading-none my-2 group-hover:text-blue-400 transition-colors">{shop.name}</h4>
                    <div className="flex items-center gap-2 mb-6 opacity-80 font-bold">
                      <div className="flex items-center gap-1 text-[10px] tracking-widest uppercase">
                        <MapPin className="h-3 w-3" /> {shop.location}
                      </div>
                    </div>

                    <div className="pt-5 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-blue-300">Active Since</p>
                        <p className="text-xs font-black">{shop.activeSince}</p>
                      </div>
                      <button
                        className="p-3 bg-white text-slate-900 rounded-xl group-hover:bg-blue-400 group-hover:text-white transition-all shadow-xl active:scale-95"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 sm:mt-20 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="p-3.5 bg-blue-50 rounded-2xl shadow-inner"><SearchIcon className="h-6 w-6 text-blue-600" /></div>
              <div>
                <h5 className="text-lg font-black text-slate-900 tracking-tight">Access the Separate Network Page</h5>
                <p className="text-xs font-medium text-slate-500">Explore categories, top sellers, and deep discounts in one place.</p>
              </div>
            </div>
            <button onClick={onNavigateToDirectory} className="w-full md:w-auto px-10 py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-[11px] tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg">
              Enter Network Directory
            </button>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 sm:py-32 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-black tracking-[0.3em] uppercase text-[10px] sm:text-xs mb-4 sm:mb-5" style={{ color: siteConfig.primaryColor }}>Advantages</h2>
          <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter mb-12 sm:mb-16">Precision analytics for retailers.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
            {[
              { icon: BarChart3, title: 'Real-time Analytics', desc: 'Monitor your KPIs in live INR with automated data pipelines from your POS.' },
              { icon: Layers, title: 'Smart Inventory', desc: 'Avoid overstocking and stockouts with our predictive velocity-based engine.' },
              { icon: Users, title: 'Growth Strategies', desc: 'Get automated cross-selling suggestions to keep your customers coming back.' }
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-[2rem] border border-slate-100 hover:border-blue-100 transition-all bg-slate-50/20 text-left">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-8 shadow-xl" style={{ backgroundColor: `${siteConfig.primaryColor}` }}>
                  <f.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 tracking-tight">{f.title}</h3>
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-semibold">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 sm:py-32 bg-slate-50 scroll-mt-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div className="animate-fade-in text-center lg:text-left">
              <h2 className="font-black tracking-[0.3em] uppercase text-[10px] sm:text-xs mb-4 sm:mb-5" style={{ color: siteConfig.primaryColor }}>Contact</h2>
              <h3 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter mb-6 sm:mb-8 leading-tight">Ready to scale?</h3>
              <p className="text-base sm:text-lg text-slate-600 mb-10 sm:mb-12 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                Our team is ready to provide a custom strategy for your retail operations.
              </p>

              <div className="space-y-6 sm:space-y-8 text-left">
                {[
                  { icon: MapPin, label: 'Headquarters', id: 'contactAddress' },
                  { icon: Mail, label: 'Email Us', id: 'contactEmail' },
                  { icon: Phone, label: 'Call Support', id: 'contactPhone' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 sm:gap-5 items-start group">
                    <div className="bg-white p-3 rounded-xl shadow-xl group-hover:scale-110 transition-transform">
                      <item.icon className="h-5 w-5" style={{ color: siteConfig.primaryColor }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                      <EditableText id={item.id} value={siteConfig[item.id]} className="text-sm sm:text-base font-bold text-slate-900" multiline={idx === 0} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 animate-slide-up">
              <h4 className="text-xl sm:text-2xl font-black text-slate-900 mb-6 sm:mb-8 tracking-tight">Send an Inquiry</h4>
              <div className="space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Full Name</label>
                    <input type="text" className="w-full bg-slate-50 border-2 border-transparent rounded-xl px-5 py-3 text-xs font-bold focus:bg-white focus:border-blue-500/20 focus:outline-none transition-all" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Company</label>
                    <input type="text" className="w-full bg-slate-50 border-2 border-transparent rounded-xl px-5 py-3 text-xs font-bold focus:bg-white focus:border-blue-500/20 focus:outline-none transition-all" placeholder="Retail Hub" />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Message</label>
                  <textarea className="w-full bg-slate-50 border-2 border-transparent rounded-xl px-5 py-3 text-xs font-bold focus:bg-white focus:border-blue-500/20 focus:outline-none transition-all h-24 sm:h-28 resize-none" placeholder="Your goals..."></textarea>
                </div>
                <button
                  className="w-full text-white font-black py-4 rounded-xl text-base hover:brightness-110 active:scale-95 transition-all shadow-xl"
                  style={{ backgroundColor: siteConfig.primaryColor }}
                >
                  Request Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footerdemo
        address={siteConfig.contactAddress}
        email={siteConfig.contactEmail}
        phone={siteConfig.contactPhone}
        primaryColor={siteConfig.primaryColor}
      />

      {showOnboarding && (
        <OnboardingWizard
          onClose={() => setShowOnboarding(false)}
          onLaunch={() => {
            setShowOnboarding(false);
            onStart();
          }}
        />
      )}
    </div>
  );
};

export default LandingPage;
