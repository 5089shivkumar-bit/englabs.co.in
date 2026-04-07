"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Home, Mail, Hash } from "lucide-react";
import { motion } from "framer-motion";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || "Awaiting Gateway Confirmation";
  const email = searchParams.get("email") || "Customer Email";

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-xl w-full bg-gray-900 border border-gray-800 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden"
      >
        {/* Ambient Success Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.15),transparent_70%)] pointer-events-none" />
        
        {/* Animated Checkmark Bubble */}
        <motion.div 
           initial={{ scale: 0 }}
           animate={{ scale: 1 }}
           transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
           className="relative z-10 w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]"
        >
          <CheckCircle className="w-12 h-12 text-green-500" />
        </motion.div>

        <h1 className="text-4xl font-bold mb-4 relative z-10">Order Confirmed</h1>
        <p className="text-gray-400 mb-10 leading-relaxed text-lg relative z-10">
          Thank you for choosing Englabs. Your digital transaction payload was securely verified via GPay/Razorpay. Our automated dispatch team is now physically staging your encrypted hardware systems for rapid transit.
        </p>

        {/* Dynamic Detail Card */}
        <div className="bg-black/50 border border-gray-800 rounded-2xl p-6 mb-10 text-left space-y-5 relative z-10">
           <div className="flex items-center gap-4">
             <div className="bg-gray-900 p-2.5 text-gray-400 border border-gray-800 rounded-xl">
               <Hash className="w-5 h-5 text-gray-300" />
             </div>
             <div>
               <div className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Secure Transaction ID</div>
               <div className="font-mono text-sm sm:text-base text-gray-200">{orderId}</div>
             </div>
           </div>
           
           <div className="h-px bg-gray-800/80 w-full" />
           
           <div className="flex items-center gap-4">
             <div className="bg-gray-900 p-2.5 text-gray-400 border border-gray-800 rounded-xl">
               <Mail className="w-5 h-5 text-gray-300" />
             </div>
             <div>
               <div className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Encrypted Receipt Target</div>
               <div className="text-sm sm:text-base text-gray-200 truncate">{email}</div>
             </div>
           </div>
        </div>

        <Link 
          href="/" 
          className="relative z-10 w-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transform hover:-translate-y-1"
        >
          <Home className="w-5 h-5" /> Back to Home
        </Link>
      </motion.div>
    </div>
  );
}

// NextJS heavily enforces deeply-coupled client fetching of useSearchParams over Suspense Boundaries.
export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] text-white flex justify-center items-center font-bold tracking-widest text-sm uppercase text-gray-400">Validating Secure Order Tokens...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
