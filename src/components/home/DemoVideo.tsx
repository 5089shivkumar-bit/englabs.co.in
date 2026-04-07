"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, ShieldCheck, ScanFace, Fingerprint } from 'lucide-react';

export default function DemoVideo() {
  const [isOpen, setIsOpen] = useState(false);

  React.useEffect(() => {
    console.log(">>> [AuraLock] DemoVideo Mounted");
  }, []);

  return (
    <section id="demo-video-section" className="relative py-24 bg-black overflow-hidden opacity-100 visible">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-white"
          >
            See AuraLock in <span className="text-orange-600">Action</span>
          </motion.h2>
          <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-orange-600 to-transparent mx-auto mt-6" />
          <p className="mt-4 text-gray-500 text-[10px] uppercase tracking-[0.4em] font-bold">Neural Unlock Sequence Demonstration</p>
        </div>

        {/* Video Thumbnail / Play Trigger */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="relative group aspect-video w-full max-w-5xl mx-auto rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,1)] bg-[#0a0a0a]"
        >
          {/* Neural Scan Tech Background */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-20" />
          
          <video 
            autoPlay loop muted playsInline
            className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition duration-1000 scale-[1.01]"
          >
            <source src="https://www.shutterstock.com/shutterstock/videos/3419084777/preview/stock-footage-futuristic-face-recognition-id-safety-system-biometric-identification-for-personal-access-digital.webm" type="video/webm" />
          </video>

          {/* Interactive UI Layers */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-transparent to-black/20 group-hover:bg-orange-600/5 transition duration-500">
             <motion.button
               whileHover={{ scale: 1.15, boxShadow: "0 0 70px rgba(234, 88, 12, 0.4)" }}
               whileTap={{ scale: 0.9 }}
               onClick={() => setIsOpen(true)}
               className="relative w-24 h-24 flex items-center justify-center rounded-full bg-orange-600 shadow-[0_0_30px_rgba(234,88,12,0.8)] border-4 border-white/20 group/btn z-20"
             >
                <Play className="w-8 h-8 text-white fill-white ml-1 group-hover/btn:scale-110 transition" />
                {/* Pulse Rings */}
                <div className="absolute inset-0 rounded-full border-2 border-orange-600 animate-ping opacity-40" />
                <div className="absolute inset-[-15px] rounded-full border border-white/5 animate-pulse" />
             </motion.button>
          </div>

          {/* Floating Biometric Indicators */}
          <div className="absolute bottom-12 left-12 flex flex-col md:flex-row gap-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700">
             <div className="flex items-center gap-3 px-5 py-3 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 text-[10px] uppercase tracking-widest font-black shadow-2xl">
                <div className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
                <ScanFace className="w-4 h-4 text-orange-500" /> 
                <span>Neural Face Match: <span className="text-orange-500">99.8%</span></span>
             </div>
             <div className="flex items-center gap-3 px-5 py-3 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 text-[10px] uppercase tracking-widest font-black shadow-2xl">
                <div className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse" />
                <Fingerprint className="w-4 h-4 text-cyan-500" /> 
                <span>Bio-Authentication: <span className="text-cyan-500">READY</span></span>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Cinematic Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12 overflow-hidden"
          >
             {/* Background tech texture for modal */}
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

             <button 
               onClick={() => setIsOpen(false)}
               className="absolute top-10 right-10 p-5 rounded-full bg-white/5 hover:bg-orange-600 transition duration-300 text-white z-[1100]"
             >
                <X className="w-7 h-7" />
             </button>
             
             <motion.div 
               initial={{ scale: 0.9, y: 50 }}
               animate={{ scale: 1, y: 0 }}
               exit={{ scale: 0.9, y: 50 }}
               className="w-full max-w-6xl aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(234,88,12,0.3)] relative"
             >
                <iframe 
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/SzhG_41XmH8?autoplay=1&mute=0" 
                  title="AuraLock Product Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
