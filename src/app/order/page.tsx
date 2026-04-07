"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Shield, Info, Lock } from 'lucide-react';

export default function OrderPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [settings, setSettings] = useState({ email: '', phone: '' });
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', email: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  // Fetch available products and global settings dynamically
  useEffect(() => {
    fetch('/api/products').then(res => res.json()).then(data => {
      setProducts(data);
      if (data.length > 0) setSelectedProductId(data[0].id);
    });
    fetch('/api/settings').then(res => res.json()).then(setSettings);
  }, []);

  const selectedProduct = products.find((p: any) => p.id === selectedProductId);

  // Flow: Customer -> Razorpay (Create Order) -> Razorpay Modal -> JSON DB -> Admin Panel
  const handlePayment = async () => {
    if (!selectedProduct) return;
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      alert("Please fill in all shipping details.");
      return;
    }
    
    setIsProcessing(true);
    try {
      // 1. Create a secure Razorpay order utilizing the dynamically loaded price
      const orderRes = await fetch('/api/razorpay', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: selectedProduct.price, currency: 'INR' })
      });
      const order = await orderRes.json();
      
      // 2. Initialize the Razorpay Frontend Popup
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_dummy",
        amount: order.amount,
        currency: "INR",
        name: "AuraLock",
        description: selectedProduct.name,
        order_id: order.id,
        handler: async function (response: any) {
          // 3. Save dynamic order properties mapped directly to what was chosen
          const saveRes = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
              tier: selectedProduct.name, 
              price: selectedProduct.price,
              paymentStatus: 'Paid', 
              razorpay_payment_id: response.razorpay_payment_id
            })
          });
          
          const saveData = await saveRes.json();
          // 4. Redirect
          if(saveData.success) {
            router.push(`/success?orderId=${saveData.order.id}&email=${encodeURIComponent(formData.email)}`);
          } else {
             alert("Payment successful, but failed to record order. Please contact support.");
          }
        },
        prefill: { name: formData.name, email: formData.email, contact: formData.phone },
        theme: { color: "#00F0FF" } 
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();

      rzp.on('payment.failed', function (response: any) {
        alert(`Payment Failed: ${response.error.description}`);
        setIsProcessing(false);
      });

    } catch (error) {
       alert("Error initializing payment. Check your connection.");
       setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Global Navbar Strip reading dynamic settings */}
      <div className="w-full bg-blue-600 text-xs font-bold py-2 text-center flex justify-center items-center gap-4 uppercase tracking-widest">
        <span><Lock className="w-3 h-3 inline mr-1" /> Secure Hardware Checkout</span>
        {settings.phone && <span className="hidden md:inline">| Support: {settings.phone}</span>}
      </div>

      <div className="flex-1 py-16 px-6">
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left Column: Dynamic Product Selection */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Choose Your AuraLock</h1>
              <p className="text-gray-400 text-lg">Select the hardware tier. Prices and specifications are synchronized with our exact manufacturing capacities.</p>
            </div>

            <div className="space-y-4">
              {products.map((product: any) => {
                const isActive = selectedProductId === product.id;
                return (
                  <div 
                    key={product.id}
                    onClick={() => setSelectedProductId(product.id)}
                    className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex gap-6 items-center ${
                      isActive ? 'border-blue-500 bg-blue-900/10 shadow-[0_0_30px_rgba(0,123,255,0.15)]' : 'border-gray-800 bg-gray-900/50 hover:border-gray-600'
                    }`}
                  >
                    {isActive && <div className="absolute top-4 right-4 bg-blue-600 text-white p-1 rounded-full"><Check className="w-4 h-4" /></div>}
                    
                    {/* Dynamic Image Gallery Wrapper */}
                    {(product.images?.length > 0 || product.image) && (
                      <div className="flex-shrink-0 flex gap-2 overflow-x-auto hidden sm:flex max-w-[200px] xl:max-w-[300px] pb-1 scrollbar-hide">
                        {(product.images?.length > 0 ? product.images : [product.image]).map((img: string, i: number) => (
                           <div key={i} className="w-24 h-24 flex-shrink-0 bg-black rounded-xl overflow-hidden shadow-inner border border-gray-800">
                             <img src={img} alt={`${product.name} ${i+1}`} className="w-full h-full object-cover" />
                           </div>
                        ))}
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-2xl font-bold mb-1">{product.name}</h3>
                      <p className="text-blue-400 font-medium text-xl mb-4">₹{Number(product.price).toLocaleString('en-IN')}</p>
                      
                      <ul className="space-y-2">
                        {product.features?.map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-center text-gray-300 text-sm">
                            <Shield className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" /> {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
              {products.length === 0 && (
                <div className="p-8 text-center text-gray-500 border border-gray-800 rounded-2xl">
                   No products are currently available for ordering.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Dynamic Checkout Form */}
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl h-fit sticky top-24 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              Shipping & Payment
            </h2>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black border border-gray-700 px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 transition" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                   <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                     className="w-full bg-black border border-gray-700 px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 transition" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                   <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                     className="w-full bg-black border border-gray-700 px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 transition" />
                 </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Full Delivery Address</label>
                <textarea rows={3} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-black border border-gray-700 px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 transition" />
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6 mb-6">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Amount:</span>
                <span className="text-blue-400 text-2xl">₹{(selectedProduct?.price || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button 
              onClick={handlePayment} 
              disabled={isProcessing || !selectedProduct}
              className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              {isProcessing ? "Processing..." : `Pay ₹${(selectedProduct?.price || 0).toLocaleString('en-IN')}`}
            </button>
            
            <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
               <Shield className="w-3 h-3" /> Secured by Razorpay 256-bit Encryption
            </p>
          </div>

        </div>
      </div>
      
      {/* Dynamic Global Footer */}
      <footer className="border-t border-gray-800 bg-black py-12 text-center text-gray-500">
         <p className="mb-2 uppercase tracking-widest text-xs font-bold">AuraLock Engineering</p>
         {settings.email && <p className="text-sm flex items-center justify-center gap-2"><Info className="w-4 h-4" /> Need help? Contact us at {settings.email}</p>}
      </footer>
    </div>
  );
}
