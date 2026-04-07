"use client";
import React, { useEffect, useState } from "react";
import { 
  Download,
  ExternalLink,
  MessageCircle,
  Phone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-black" />;

  return (
    <div className="fixed inset-0 bg-black overflow-hidden flex flex-col">
      {/* Dynamic Header */}
      <header className="h-16 bg-black/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center">
             <span className="text-white font-bold text-xs">E</span>
          </div>
          <span className="text-lg font-black tracking-tighter uppercase italic text-white leading-none">
            Eng<span className="text-orange-600">labs</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a 
            href="/brochure.pdf" 
            target="_blank" 
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(234,88,12,0.4)]"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Original</span>
          </a>
          <a 
            href="/brochure.pdf" 
            download
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all border border-white/10"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </a>
        </div>
      </header>

      {/* Full-screen PDF Viewer */}
      <main className="flex-1 w-full bg-[#111] relative">
        <iframe 
          src="/brochure.pdf#toolbar=0&navpanes=0&scrollbar=0" 
          className="w-full h-full border-none"
          title="Englabs Brochure"
        />
        
        {/* Floating Contact Action */}
        <div className="absolute bottom-8 right-8 flex flex-col gap-4 z-[100]">
          <motion.a 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            href="https://wa.me/919878407934"
            target="_blank"
            className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-2xl transition-colors hover:bg-green-600"
          >
            <MessageCircle className="w-7 h-7 text-white" />
          </motion.a>
          <motion.a 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            href="tel:+919878407934"
            className="w-14 h-14 bg-orange-600 rounded-full flex items-center justify-center shadow-2xl transition-colors hover:bg-orange-700"
          >
            <Phone className="w-7 h-7 text-white" />
          </motion.a>
        </div>
      </main>

      <footer className="h-10 bg-black border-t border-white/5 flex items-center justify-center px-6">
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">
          © 2026 Englabs India Pvt Ltd. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
