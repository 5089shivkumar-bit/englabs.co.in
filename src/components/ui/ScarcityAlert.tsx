"use client";
import React, { useState, useEffect } from "react";
import { Users, AlertTriangle, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ScarcityAlertProps {
  productId: string;
  baseStock?: number;
}

/**
 * AuraLock Scarcity Engine:
 * Drives conversions using social proof and inventory pressure.
 */
export default function ScarcityAlert({ productId, baseStock = 5 }: ScarcityAlertProps) {
  const [viewers, setViewers] = useState(0);
  const [stock, setStock] = useState(baseStock);

  useEffect(() => {
    // Simulate real-time activity (2026 Production Standard)
    const initialViewers = Math.floor(Math.random() * 5) + 3;
    setViewers(initialViewers);

    const interval = setInterval(() => {
      setViewers(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newVal = prev + change;
        return newVal < 2 ? 2 : newVal > 12 ? 12 : newVal;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-2 mt-4">
      <AnimatePresence mode="wait">
        <motion.div 
          key={viewers}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          className="flex items-center gap-2 text-[10px] font-bold text-orange-400 uppercase tracking-widest bg-orange-500/5 px-3 py-1.5 rounded-full border border-orange-500/10 w-fit"
        >
          <Users className="w-3.5 h-3.5" />
          <span>{viewers} People viewing this now</span>
        </motion.div>
      </AnimatePresence>

      {stock <= 5 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-500/5 px-3 py-1.5 rounded-full border border-rose-500/10 w-fit animate-pulse"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>High Demand: Only {stock} units left</span>
        </motion.div>
      )}
    </div>
  );
}
