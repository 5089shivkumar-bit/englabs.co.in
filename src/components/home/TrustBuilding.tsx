"use client";
import React, { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';
import { Building2, Activity, Target } from 'lucide-react';

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Handling float vs int for the counter
    const isFloat = value % 1 !== 0;
    const controls = animate(0, value, {
      duration: 2.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        if (isFloat) {
          setCount(Number(latest.toFixed(1)));
        } else {
          setCount(Math.floor(latest));
        }
      },
    });
    return () => controls.stop();
  }, [value]);

  return <>{count.toLocaleString()}{suffix}</>;
}

const stats = [
  {
    icon: Building2,
    value: 50,
    suffix: "+",
    label: "Enterprise Zones",
    desc: "Actively securing real-world office and corporate environments.",
    color: "text-orange-500"
  },
  {
    icon: Activity,
    value: 10000,
    suffix: "+",
    label: "Successful Unlocks",
    desc: "Neural-fast entry sequences processed with zero latency.",
    color: "text-cyan-500"
  },
  {
    icon: Target,
    value: 99.9,
    suffix: "%",
    label: "Neural Precision",
    desc: "Multi-factor accuracy maintained across all environments.",
    color: "text-orange-500"
  }
];

export default function TrustBuilding() {
  React.useEffect(() => {
    console.log(">>> [AuraLock] TrustBuilding Mounted");
  }, []);

  return (
    <section id="trust-building-section" className="py-32 bg-[#020202] border-y border-white/5 relative overflow-hidden opacity-100 visible">
      {/* Neural lattice background texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      {/* Cybernetic glow gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-orange-600/10 blur-[120px] rounded-full opacity-50" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center group relative p-10 bg-[#0a0a0a]/50 rounded-[3rem] border border-white/5 hover:border-orange-600/30 transition-all duration-500"
            >
              {/* Animated icon orb */}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-[1.5rem] bg-white/5 border border-white/10 mb-10 transition-all duration-500 group-hover:scale-110 group-hover:bg-orange-600/10 group-hover:shadow-[0_0_40px_rgba(234,88,12,0.2)]">
                <stat.icon className={`w-10 h-10 ${stat.color} transition-transform group-hover:rotate-12`} />
              </div>
              
              <div className="text-5xl lg:text-7xl font-black tracking-tighter italic text-white mb-6 font-sans">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-orange-600 mb-6 group-hover:translate-y-[-4px] transition-transform duration-300">
                {stat.label}
              </h3>
              
              <p className="text-gray-400 text-sm font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                {stat.desc}
              </p>

              {/* Individual glow card accent */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-orange-600/20 to-transparent rounded-[3rem] opacity-0 group-hover:opacity-100 transition duration-500 -z-10" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
