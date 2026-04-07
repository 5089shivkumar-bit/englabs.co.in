"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search, Package, MapPin, Phone, User, Mail, CreditCard, X } from "lucide-react";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("orderId") || "";
  
  const [orderIdQuery, setOrderIdQuery] = useState(initialOrderId);
  const [phoneQuery, setPhoneQuery] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const performFetch = async (id: string, phone: string, isAutoFetch = false) => {
    if (!id.trim() && !isAutoFetch) return;
    if (!phone.trim() && !isAutoFetch) return;
    
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    setOrder(null);

    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      
      const foundOrder = data.find((o: any) => {
         const matchId = o.id === id.trim().toUpperCase() || (o.orderId && o.orderId === id.trim());
         const rawPhone = o.phone || o.customerPhone || "";
         const dbPhone = rawPhone.replace(/[^\d]/g, '');
         const queryPhone = phone.trim().replace(/[^\d]/g, '');
         const matchPhone = dbPhone.includes(queryPhone) && queryPhone.length >= 10;
         
         return matchId && (matchPhone || isAutoFetch);
      });

      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        setErrorMsg(`Order not found. We couldn't securely verify any active order matching ID "${id}". Ensure your parameters are strictly correct.`);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to connect to tracking servers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
       performFetch(initialOrderId, "", true);
    }
  }, [initialOrderId]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    performFetch(orderIdQuery, phoneQuery, false);
  };

  const cancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to completely cancel this order? This action cannot be undone.")) return;
    
    try {
      setLoading(true);
      const res = await fetch('/api/orders', {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ id: orderId, dispatchStatus: 'Cancelled' })
      });
      if (res.ok) {
         setOrder({ ...order, dispatchStatus: 'Cancelled' });
         setSuccessMsg("Your order has been successfully cancelled and completely voided from our dispatch queue.");
      } else {
         setErrorMsg("Failed to cancel order. Please contact support.");
      }
    } catch (err) {
      setErrorMsg("Failed to connect to servers while cancelling. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col pb-10">
      
      {/* Tracker Header Node */}
      <nav className="w-full p-6 lg:px-12 flex justify-between items-center border-b border-gray-800 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <Link href="/" className="text-xl font-bold tracking-tight mb-4 md:mb-0">
          <span className="text-blue-500">Englabs</span> Tracking
        </Link>
        <button onClick={() => window.history.back()} className="text-gray-400 hover:text-white flex items-center gap-2 font-medium text-sm transition">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12 flex flex-col w-full flex-1 items-center">
        
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-center">Track Your Hardware</h1>
        <p className="text-gray-400 mb-10 text-center max-w-xl">
          To protect data security, please supply both your securely generated Order ID and corresponding registered Mobile Number below.
        </p>

        {/* Dual Verification Tracking Form */}
        <form onSubmit={handleTrack} className="w-full max-w-2xl mb-12 space-y-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="relative">
               <Package className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
               <input 
                 type="text" 
                 value={orderIdQuery}
                 onChange={(e) => setOrderIdQuery(e.target.value.toUpperCase())}
                 placeholder="Order ID (e.g. ORD-2026...)" 
                 className="w-full bg-gray-900 border border-gray-800 rounded-2xl py-4 pl-14 pr-4 text-white focus:border-blue-500 focus:outline-none transition shadow-[0_0_20px_rgba(0,0,0,0.3)]" 
                 required
               />
             </div>
             <div className="relative">
               <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
               <input 
                 type="tel" 
                 value={phoneQuery}
                 onChange={(e) => setPhoneQuery(e.target.value)}
                 placeholder="Registered Phone / WhatsApp" 
                 className="w-full bg-gray-900 border border-gray-800 rounded-2xl py-4 pl-14 pr-4 text-white focus:border-blue-500 focus:outline-none transition shadow-[0_0_20px_rgba(0,0,0,0.3)]" 
                 required
               />
             </div>
           </div>
           
           <button 
             type="submit" 
             disabled={loading}
             className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:opacity-50"
           >
             {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Track Securely"}
           </button>
        </form>

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="w-full max-w-2xl bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl text-center leading-relaxed font-medium mb-6">
            {errorMsg}
          </div>
        )}

        {/* Global Success Banner */}
        {successMsg && (
          <div className="w-full max-w-2xl bg-green-500/10 border border-green-500/20 text-green-400 p-6 rounded-2xl text-center leading-relaxed font-bold mb-6">
            {successMsg}
          </div>
        )}

        {/* Live Result Output Frame */}
        {order && (
          <div className="w-full bg-gray-900 border border-gray-800 rounded-3xl p-8 md:p-10 shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-500">
             
             {/* Dynamic Status Badges Matrix */}
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-gray-800 pb-8">
               <div>
                  <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Englabs Order</div>
                  <div className="text-2xl font-mono text-white">{order.id}</div>
               </div>
               <div className="flex gap-4">
                  <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${order.paymentStatus === 'Completed' || order.paymentStatus === 'Paid' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'}`}>
                    <CreditCard className="w-4 h-4" /> {order.paymentStatus || 'Pending'}
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border ${
                     order.dispatchStatus === 'Cancelled' ? 'bg-red-500/20 text-red-500 border-red-500/30' :
                     order.dispatchStatus === 'Delivered' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                     order.dispatchStatus === 'Shipped' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                     order.dispatchStatus === 'Processing' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                     'bg-orange-500/20 text-orange-400 border-orange-500/30'
                  }`}>
                    <Package className="w-4 h-4" /> {order.dispatchStatus || 'Pending'}
                  </div>
                  
                  {(order.dispatchStatus === 'Pending' || order.dispatchStatus === 'Processing' || !order.dispatchStatus) && (
                     <button 
                       onClick={() => cancelOrder(order.id)}
                       disabled={loading}
                       className="px-4 py-2 bg-red-900/40 hover:bg-red-900/80 text-red-500 hover:text-red-400 font-bold rounded-xl transition text-sm flex items-center gap-2 disabled:opacity-50 border border-red-500/30"
                     >
                        <X className="w-4 h-4" /> Cancel Order
                     </button>
                  )}
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               {/* Left Half: Specifications & Recipient Information */}
               <div>
                 <h3 className="text-lg font-bold mb-4 text-white">Hardware Specification</h3>
                 <div className="bg-black border border-gray-800 rounded-2xl p-6">
                    <div className="font-bold text-xl mb-1 text-blue-400">{order.productName || order.tier || "Custom Configuration"}</div>
                    <div className="text-gray-400 font-medium mb-4">Total: ₹{Number(order.price || order.amount || 0).toLocaleString('en-IN')}</div>
                    
                    <div className="space-y-3 pt-4 border-t border-gray-900">
                       <p className="flex items-center gap-3 text-sm text-gray-300">
                         <User className="w-4 h-4 text-gray-500 flex-shrink-0" /> {order.name || order.customerName || "Customer Record"}
                       </p>
                       <p className="flex items-center gap-3 text-sm text-gray-300">
                         <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" /> +91 {order.phone || order.customerPhone}
                       </p>
                       <p className="flex items-center gap-3 text-sm text-gray-300">
                         <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" /> {order.email || order.customerEmail || "No Email Provided"}
                       </p>
                    </div>
                 </div>
               </div>
               
               {/* Right Half: Live Delivery Vectoring */}
               <div>
                 <h3 className="text-lg font-bold mb-4 text-white">Fulfillment Destination</h3>
                 <div className="bg-black border border-gray-800 rounded-2xl p-6 h-[calc(100%-2.5rem)] flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-gray-500 flex-shrink-0 mt-1" />
                    <p className="text-gray-300 leading-relaxed text-sm">
                      {order.address || "Address parsing error. Please contact logistics personnel immediately."}
                    </p>
                 </div>
               </div>
             </div>

          </div>
        )}

      </main>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex justify-center items-center">Loading Secure Tracker...</div>}>
       <TrackOrderContent />
    </Suspense>
  );
}
