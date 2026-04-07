"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Smartphone, Fingerprint, Unlock } from 'lucide-react';

const steps = [
  {
    id: "01",
    icon: Settings,
    title: "Install Device",
    description: "Mount AuraLock in under 10 minutes with zero drilling required.",
    color: "from-orange-500 to-red-600"
  },
  {
    id: "02",
    icon: Smartphone,
    title: "Connect App",
    description: "Sync with the Aura Intelligence App via encrypted Bluetooth.",
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: "03",
    icon: Fingerprint,
    title: "Configure Bio",
    description: "Scan your fingerprint for neural-speed biometric recognition.",
    color: "from-orange-500 to-red-600"
  },
  {
    id: "04",
    icon: Unlock,
    title: "Seamless Access",
    description: "Your door unlocks automatically as you approach the zone.",
    color: "from-cyan-500 to-blue-600"
  }
];

export default function HowItWorks() {
  React.useEffect(() => {
    console.log(">>> [AuraLock] HowItWorks Mounted");
  }, []);

  return (
    <section id="how-it-works-section" className="py-32 bg-[#020202] relative overflow-hidden opacity-100 visible text-white">
      {/* Structural background lines */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-white"
          >
            Tactical <span className="text-orange-600">Setup</span>
          </motion.h2>
          <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-orange-600 to-transparent mx-auto mt-6" />
          <p className="mt-4 text-gray-500 text-[10px] uppercase tracking-[0.4em] font-bold">From Unboxing to Ultimate Security</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((step, index) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="group relative p-8 bg-[#0a0a0a] border border-white/5 rounded-[3rem] hover:border-orange-600/30 transition-all duration-500 shadow-2xl"
            >
               {/* Numeric high-contrast indicator */}
               <span className="absolute top-8 right-10 text-6xl font-black italic opacity-[0.03] group-hover:opacity-10 transition duration-500 text-white select-none">
                  {step.id}
               </span>

               <div className={`w-20 h-20 rounded-[1.5rem] bg-gradient-to-br ${step.color} p-[2px] mb-10 group-hover:scale-110 transition duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.5)]`}>
                  <div className="w-full h-full bg-[#0a0a0a] rounded-[1.5rem] flex items-center justify-center">
                    <step.icon className={`w-10 h-10 bg-clip-text text-transparent bg-gradient-to-br ${step.color}`} />
                  </div>
               </div>

               <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4 text-white group-hover:text-orange-500 transition duration-300">{step.title}</h3>
               <p className="text-gray-400 text-sm leading-relaxed font-medium pr-4">{step.description}</p>
               
               {/* Visual Connector for Desktop */}
               {index < steps.length - 1 && (
                 <div className="hidden lg:block absolute top-[5.5rem] -right-6 w-12 h-[1px] bg-white/5 z-0">
                    <div className="h-full bg-orange-600 w-0 group-hover:w-full transition-all duration-1000" />
                 </div>
               )}

               {/* Decorative glow corner */}
               <div className="absolute bottom-0 right-0 w-24 h-24 bg-orange-600/5 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
