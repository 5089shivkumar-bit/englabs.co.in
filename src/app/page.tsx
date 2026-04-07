"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Search,
  X,
  ShieldCheck,
  Fingerprint,
  ScanFace,
  KeyRound,
  Battery,
  Settings,
  Bell,
  Lock,
  Smartphone,
  Cpu,
  ChevronRight,
  ChevronLeft,
  Grip,
  ChevronDown,
  Video,
  Mic,
  Unlock,
  ChevronsRight,
  Key,
  Grid3X3,
  Home as HomeIcon,
  Navigation,
  Volume2,
  Scan,
  Dumbbell,
  Building2,
  Users,
  Check,
  Globe,
  Monitor
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductViewer3D from "@/components/home/ProductViewer3D";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { useAudio } from "@/hooks/useAudio";
import ScarcityAlert from "@/components/ui/ScarcityAlert";
import DemoVideo from "@/components/home/DemoVideo";
import HowItWorks from "@/components/home/HowItWorks";
import TrustBuilding from "@/components/home/TrustBuilding";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  
  const { play } = useAudio();

  useEffect(() => {
    setMounted(true);
    const splashPlayed = sessionStorage.getItem('auralock_splash_played');
    if (splashPlayed) {
      setShowSplash(false);
    } else {
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('auralock_splash_played', 'true');
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (!mounted) return <div className="min-h-screen bg-black" />;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-orange-500/30 overflow-x-hidden font-sans">
      
      <AnimatePresence>
        {showSplash && (
          <motion.div 
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center p-6"
          >
            <motion.div
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.5 }}
              className="text-center"
            >
              <div className="relative mb-4">
                <Lock className="w-16 h-16 text-orange-600 animate-pulse mx-auto" strokeWidth={1.5} />
                <div className="absolute inset-0 bg-orange-600/30 blur-2xl rounded-full" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">
                Aura<span className="text-orange-600">Lock</span>
              </h1>
              <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-orange-600 to-transparent mx-auto mt-4" />
              <p className="mt-6 text-[10px] tracking-[0.4em] text-gray-500 uppercase font-medium">System Initialization In Progress</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="fixed top-0 left-0 right-0 z-[500] px-6 py-6 md:px-12 flex justify-between items-center bg-black/40 backdrop-blur-2xl border-b border-white/5">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => { play('click'); setActiveTab('home'); }}>
          <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center shadow-[0_0_15px_rgba(234,88,12,0.5)]">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase italic">Aura<span className="text-orange-600">Lock</span></span>
        </div>
        
        <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold uppercase tracking-widest text-gray-400">
          <button onClick={() => { play('click'); setActiveTab('home'); }} className={`hover:text-white transition ${activeTab === 'home' ? 'text-orange-500' : ''}`}>Ecosystem</button>
          <button onClick={() => { play('click'); setActiveTab('products'); }} className={`hover:text-white transition ${activeTab === 'products' ? 'text-orange-500' : ''}`}>Product</button>
          <Link href="/track" className="hover:text-white transition">Tracking</Link>
          <button onClick={() => { play('click'); setActiveTab('contact'); }} className="hover:text-white transition">Intelligence</button>
        </div>

        <button className="hidden sm:block px-5 py-2.5 bg-orange-600/10 border border-orange-600/20 rounded-full text-[10px] font-black uppercase tracking-widest text-orange-500 hover:bg-orange-600 hover:text-white transition-all duration-300">
          Partner Portal
        </button>
      </nav>

      <main className="pt-32 pb-10">
        
        {activeTab === 'home' && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto px-6"
          >
            <div className="relative min-h-[90vh] flex flex-col lg:flex-row items-center justify-center overflow-hidden rounded-[3rem] border border-white/5 mb-12 shadow-[0_30px_100px_rgba(0,0,0,1)] bg-black group p-10 lg:p-20 gap-12">
               
               <div className="absolute inset-0 z-0 bg-[#020617] overflow-hidden">
                 <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-lighten scale-[1.02] filter contrast-125 saturate-150">
                   <source src="https://www.shutterstock.com/shutterstock/videos/3906850375/preview/stock-footage-futuristic-cybersecurity-technology-animation-digital-shield-lock.webm" type="video/webm" />
                 </video>
                 <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/95 via-[#020617]/60 to-transparent z-10" />
                 <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/20 to-[#020617] opacity-90 z-10" />
               </div>

               <div className="relative z-10 w-full lg:w-1/2">
                  <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-orange-600/10 border border-orange-600/20 text-orange-500 text-[10px] font-black tracking-[0.2em] uppercase mb-8 backdrop-blur-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-600"></span>
                      </span>
                      Liveness Verification Active
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl lg:text-[4.5rem] font-black tracking-tighter leading-[1.0] text-white mb-8 pr-4 italic uppercase">
                      No Keys.<br/>
                      No Guards.<br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-600 to-red-600 italic">No Hassle.</span>
                    </h1>
                    
                    <p className="text-lg text-gray-300 font-medium max-w-md mb-12">
                      AuraLock turns any space into a fully automated secure zone.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-6 mt-12 bg-transparent pointer-events-auto">
                      {/* Primary CTA: Buy Now */}
                      <motion.button 
                        whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(234, 88, 12, 0.6)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { play('click'); setActiveTab('products'); }}
                        className="relative group px-12 py-5 bg-gradient-to-r from-orange-500 via-orange-600 to-red-700 text-white font-black uppercase italic tracking-tighter text-xl rounded-2xl shadow-[0_20px_40px_rgba(234,88,12,0.3)] transition-all duration-500 overflow-hidden"
                      >
                        <div className="flex items-center gap-3 relative z-10">
                          <span>Buy Now</span>
                          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </div>
                        {/* Interactive Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                      </motion.button>

                      {/* Secondary CTA: Book a Demo */}
                      <motion.button 
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(6, 182, 212, 0.15)", borderColor: "rgba(6, 182, 212, 0.6)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { play('click'); setActiveTab('contact'); }}
                        className="px-10 py-5 bg-cyan-500/5 border-2 border-cyan-500/30 text-cyan-400 font-black uppercase italic tracking-tighter text-xl rounded-2xl backdrop-blur-md shadow-[0_10px_30px_rgba(6,182,212,0.1)] transition-all duration-500"
                      >
                        Book a Demo
                      </motion.button>
                    </div>
                  </motion.div>
               </div>

               {/* Step 1: 3D Product Viewer */}
               <div className="relative z-10 w-full lg:w-1/2 h-[500px]">
                  <ProductViewer3D />
               </div>
            </div>

            {/* Step 4: Demo Video Section */}
            <div id="demo-video-section">
              <DemoVideo />
            </div>

            {/* Step 5: How It Works Section */}
            <div id="how-it-works-section">
              <HowItWorks />
            </div>

            {/* Step 6: Trust Building Section */}
            <div id="trust-building-section">
              <TrustBuilding />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
               {[
                 { icon: ScanFace, title: "Smart Face Recognition", desc: "Secure contactless entry." },
                 { icon: Cpu, title: "Always Active", desc: "Works offline." },
                 { icon: Smartphone, title: "Real-Time Monitoring", desc: "Track results." }
               ].map((feat, i) => (
                 <motion.div key={i} variants={itemVariants} className="group p-8 bg-[#0a0a0a] border border-white/5 rounded-[2rem] hover:border-orange-600/50 transition duration-500 overflow-hidden shadow-xl">
                   <div className="w-14 h-14 rounded-2xl bg-orange-600/20 flex items-center justify-center text-orange-500 mb-6 transition group-hover:scale-110">
                     <feat.icon className="w-7 h-7" />
                   </div>
                   <h3 className="text-xl font-black uppercase italic tracking-tighter mb-4 text-white">{feat.title}</h3>
                   <p className="text-sm text-gray-300 leading-relaxed font-medium">{feat.desc}</p>
                 </motion.div>
               ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'products' && (
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
               <div>
                  <h2 className="text-5xl font-black tracking-tighter uppercase italic leading-none mb-2">Hardware <span className="text-orange-600">Inventory</span></h2>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">Precision Security Ecosystem</p>
               </div>

               <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="text"
                      placeholder="Search hardware..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-white/5 rounded-full py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-orange-600/50 transition shadow-inner"
                    />
                  </div>
                  
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#0a0a0a] border border-white/5 rounded-full py-3 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 focus:outline-none"
                  >
                    <option value="latest">Sort: Latest</option>
                    <option value="low">Price: Low to High</option>
                    <option value="high">Price: High to Low</option>
                  </select>
               </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-10">
              {['All', 'Biometric', 'Smart Lock', 'Padlock', 'Accessories'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => { play('click'); setSelectedCategory(cat); }}
                  className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${
                    selectedCategory === cat 
                    ? 'bg-orange-600 border-orange-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)]' 
                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-orange-600/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {loading ? (
                [...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)
              ) : (
                products
                  .filter(p => {
                    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
                    return matchesSearch && matchesCat;
                  })
                  .sort((a, b) => {
                    if (sortBy === 'low') return a.price - b.price;
                    if (sortBy === 'high') return b.price - a.price;
                    return 0;
                  })
                  .map((product, idx) => (
                  <motion.div 
                    key={product.id}
                    onClick={() => { play('click'); setSelectedProduct(product); setCurrentGalleryIndex(0); }}
                    className="group relative bg-[#0a0a0a] border border-white/5 p-8 rounded-[2.5rem] hover:border-orange-600/50 transition duration-500 cursor-pointer overflow-hidden shadow-2xl"
                  >
                     <div className="h-64 mb-8 flex items-center justify-center">
                        <Lock className="w-20 h-20 text-gray-800" />
                     </div>
                     <h3 className="text-2xl font-black italic uppercase tracking-tighter">{product.name}</h3>
                     <div className="flex justify-between items-end">
                        <span className="text-2xl font-black text-orange-500">₹{Number(product.price).toLocaleString('en-IN')}</span>
                        <ScarcityAlert productId={product.id} />
                     </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="py-12 border-t border-white/5 bg-[#020202] text-center">
        <div className="text-3xl font-black tracking-tighter uppercase italic mb-8">Aura<span className="text-orange-600">Lock</span></div>
        <div className="flex justify-center gap-8 text-[10px] font-bold uppercase tracking-widest text-gray-500">
           <Link href="/admin" className="hover:text-orange-600">Admin Control</Link>
           <span className="opacity-20">|</span>
           <button onClick={() => { play('click'); setActiveTab('contact'); }} className="hover:text-orange-600">Intelligence Support</button>
        </div>
      </footer>
    </div>
  );
}
