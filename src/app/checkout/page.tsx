"use client";
import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { ArrowLeft, LockKeyhole, User, Mail, Phone, MapPin, Building, Map, Hash } from "lucide-react";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId") || "";
  const productName = searchParams.get("name") || "Select a Product";
  const productPrice = searchParams.get("price") ? Number(searchParams.get("price")) : 0;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [processing, setProcessing] = useState(false);
  const [settings, setSettings] = useState({ phone: '+91 98765 43210', email: 'support@englabs.in' });

  React.useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const rzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
      
      if (!rzpKey || !rzpKey.startsWith("rzp_")) {
         alert("SYSTEM PAUSE: Razorpay LIVE API Keys were not detected. Please inject your Razorpay test or live tokens inside a .env.local file to permanently open the GPay / CC modal natively!");
         setProcessing(false);
         return;
      }

      // Call backend to generate generic Razorpay order ID
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: productPrice, currency: "INR" }),
      });
      
      const orderData = await res.json();
      
      if (!orderData.id) {
        alert("Server error: Could not generate order ID. Details: " + JSON.stringify(orderData));
        setProcessing(false);
        return;
      }

      const options = {
        key: rzpKey, 
        amount: productPrice * 100, 
        currency: "INR",
        name: "Englabs Products",
        description: productName,
        order_id: orderData.id,
        handler: async function (response: any) {
          // Payment Success Callback - Save Order
          try {
            const saveRes = await fetch("/api/orders", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({
                  orderId: orderData.id,
                  name: formData.fullName,
                  email: formData.email,
                  phone: formData.phone,
                  address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
                  productName: productName,
                  tier: productName,
                  price: productPrice,
                  paymentStatus: "Completed",
                  paymentId: response.razorpay_payment_id
               })
            });
            const saveResJson = await saveRes.json();
            window.location.href = `/success?order_id=${saveResJson.order.id}&email=${encodeURIComponent(formData.email)}`;
          } catch(err) {
            console.error(err);
            alert("Payment successful but order saving failed. Please contact support.");
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#2563EB"
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      
      razorpay.on('payment.failed', function (response: any) {
         alert(`Payment Failed: ${response.error.description}`);
      });

      razorpay.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong connecting to Razorpay.");
    } finally {
      // NOTE: Razorpay closes itself. If the user dismisses it, we need to unlock the button.
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col pb-10">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      {/* Dynamic Header */}
      <nav className="w-full p-6 lg:px-12 flex justify-between items-center border-b border-gray-800 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <Link href="/" className="text-xl font-bold tracking-tight mb-4 md:mb-0">
          <span className="text-blue-500">Englabs</span> Secure Checkout
        </Link>
        <button onClick={() => window.history.back()} className="text-gray-400 hover:text-white flex items-center gap-2 font-medium text-sm transition">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12 w-full flex-1">
        
        {/* Left Side: Checkout Form */}
        <div className="w-full lg:w-2/3 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <LockKeyhole className="w-6 h-6 text-blue-500" />
            <h1 className="text-3xl font-bold tracking-tight mt-1">Shipping Details</h1>
          </div>
          
          <form onSubmit={handlePayment} className="space-y-6 flex-1 flex flex-col">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 focus:outline-none transition" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 focus:outline-none transition" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-400 ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 focus:outline-none transition" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-400 ml-1">Full Address (House, Street, Area)</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3 w-5 h-5 text-gray-500" />
                <input required type="text" name="address" value={formData.address} onChange={handleChange} placeholder="123 Technology Hub, Sector 4..." className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 focus:outline-none transition" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400 ml-1">City</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input required type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Mumbai" className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 focus:outline-none transition" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400 ml-1">State</label>
                <div className="relative">
                  <Map className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input required type="text" name="state" value={formData.state} onChange={handleChange} placeholder="Maharashtra" className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 focus:outline-none transition" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400 ml-1">Pincode</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input required type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="400001" className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 focus:outline-none transition" />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-900">
               <button disabled={processing} type="submit" className={`w-full bg-blue-600 hover:bg-blue-500 text-white text-center py-4 rounded-xl font-bold text-lg transition shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] ${processing ? 'opacity-50 cursor-wait' : ''}`}>
                 {processing ? "Connecting to Secure Gateway..." : "Pay Securely"}
               </button>
            </div>
          </form>
        </div>

        {/* Right Side: Dynamic Order Summary */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
           <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 sticky top-32">
             <h2 className="text-xl font-bold mb-6 border-b border-gray-800 pb-4">Order Summary</h2>
             
             <div className="flex flex-col gap-3 mb-8">
                <div className="flex justify-between text-gray-300 font-medium">
                  <span className="truncate pr-4">{productName}</span>
                  <span>₹{productPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Shipping & Fulfillment</span>
                  <span className="text-blue-500">Free</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Hardware Taxes</span>
                  <span>Included</span>
                </div>
             </div>

             <div className="flex justify-between items-baseline border-t border-gray-800 pt-6">
                <span className="text-gray-400 font-medium">Total Payable</span>
                <span className="text-3xl font-bold text-white">₹{productPrice.toLocaleString('en-IN')}</span>
             </div>
             
             <div className="mt-8 bg-blue-600/10 border border-blue-500/20 rounded-xl p-4 flex gap-3 text-sm text-blue-400 leading-relaxed">
               <LockKeyhole className="w-5 h-5 flex-shrink-0 mt-0.5" />
               <p>Your connection is 256-bit encrypted. We never store card details on our local servers.</p>
             </div>

             <div className="mt-6 border border-gray-800 rounded-xl p-5 flex flex-col gap-3 text-sm text-gray-400 bg-black shadow-inner">
                <p className="font-bold text-white mb-1 tracking-wide">Need help with your order?</p>
                <p className="flex items-center gap-3 font-medium"><Phone className="w-4 h-4 text-blue-500"/> {settings.phone}</p>
                <p className="flex items-center gap-3 font-medium"><Mail className="w-4 h-4 text-blue-500"/> {settings.email}</p>
             </div>
           </div>
        </div>

      </main>
    </div>
  );
}

// NextJS heavily enforces deeply-coupled client fetching of useSearchParams over Suspense Boundaries.
export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex justify-center items-center font-bold tracking-widest uppercase">Initializing Secure Socket Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
