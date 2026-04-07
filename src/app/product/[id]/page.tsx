"use client";
import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Gracefully handle dynamic routing params in Next.js 15
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch directly from the Englabs backend products list
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        const found = data.find((p: any) => p.id === id);
        setProduct(found);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch product data", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
           <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
           <p className="text-gray-400 tracking-widest uppercase text-sm font-medium">Loading Architecture...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-400 mb-8">The hardware you are looking for does not exist or has been discontinued.</p>
        <Link href="/" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold transition">
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-10">
      
      {/* Dynamic Header */}
      <nav className="w-full p-6 lg:px-12 flex justify-between items-center border-b border-gray-800 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <Link href="/" className="text-xl font-bold tracking-tight mb-4 md:mb-0">
          <span className="text-blue-500">Englabs</span> {product.name}
        </Link>
        <Link href="/" className="text-gray-400 hover:text-white flex items-center gap-2 font-medium text-sm transition">
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* Left Side: Dynamic Image Gallery */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-1/2 flex flex-col gap-6"
        >
          <div className="bg-black border border-gray-800 rounded-3xl p-8 md:p-12 flex items-center justify-center relative overflow-hidden group h-[400px] md:h-[500px]">
            {product.image || product.images?.[0] ? (
              <img src={product.images?.[0] || product.image} alt={product.name} className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-105 transition duration-700 ease-out" />
            ) : (
              <div className="text-gray-600">No Image Available</div>
            )}
            <div className="absolute top-6 left-6 bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
              In Stock
            </div>
          </div>
          
          {/* Sub Gallery */}
          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
               {product.images.slice(1).map((img: string, i: number) => (
                 <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl h-24 p-2 flex items-center justify-center hover:border-blue-500/50 transition">
                   <img src={img} alt={`${product.name} View ${i + 2}`} className="w-full h-full object-contain" />
                 </div>
               ))}
            </div>
          )}
        </motion.div>


        {/* Right Side: Product Details & Checkout */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full lg:w-1/2 flex flex-col"
        >
          <div className="uppercase tracking-widest text-blue-500 text-xs font-bold mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Authentic Englabs Hardware
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{product.name}</h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            {product.description || "The ultimate architectural smart lock. Engineered with multi-vector AI recognition to secure what matters most. Built precisely to fit."}
          </p>
          
          <div className="text-5xl font-bold tracking-tight text-white mb-8 border-b border-gray-900 pb-8 flex items-baseline gap-4">
             ₹{Number(product.price).toLocaleString('en-IN')}
             <span className="text-base text-gray-500 font-medium">Inclusive of all taxes</span>
          </div>

          <div className="mb-10 flex-1">
            <h3 className="font-bold text-xl mb-4 text-white">Technical Specifications</h3>
            {product.features && product.features.length > 0 ? (
                <ul className="space-y-4">
                  {product.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex gap-4 text-gray-300 items-start p-4 bg-gray-900/40 border border-gray-800/50 rounded-xl">
                       <div className="bg-blue-600/20 p-1.5 rounded-md mt-0.5 border border-blue-500/20">
                         <ArrowRight className="w-4 h-4 text-blue-400 flex-shrink-0" />
                       </div>
                       <span className="leading-snug">{feature.trim()}</span>
                    </li>
                  ))}
                </ul>
            ) : (
                <p className="text-gray-600 italic">No detailed specifications logged.</p>
            )}
          </div>

          <div className="mt-auto flex flex-col gap-4">
            
            {/* Primary Buy Now / Checkout Component */}
            <Link 
              href={`/checkout?productId=${product.id}&name=${encodeURIComponent(product.name)}&price=${product.price}`}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white text-center py-5 rounded-2xl font-bold text-xl transition shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transform hover:-translate-y-1"
            >
              Buy Now
            </Link>
            
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-900">
               <div className="flex items-center gap-3 text-sm text-gray-400">
                 <Truck className="w-5 h-5 text-gray-500" /> Free Dispatch directly to site
               </div>
               <div className="flex items-center gap-3 text-sm text-gray-400">
                 <RotateCcw className="w-5 h-5 text-gray-500" /> 7-Day Replacement
               </div>
            </div>
          </div>

        </motion.div>
      </main>
    </div>
  );
}
