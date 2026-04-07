"use client";
import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, ShoppingCart, CreditCard, Clock, Truck, BarChart3 } from 'lucide-react';

export default function AdminPanel() {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [settings, setSettings] = useState({ email: '', phone: '' });
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'settings'>('dashboard');

  // Product Editing State
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") setIsAuthenticated(true);
    else alert("Incorrect password");
  };

  const loadData = () => {
    fetch('/api/products').then(res => res.json()).then(setProducts);
    fetch('/api/orders').then(res => res.json()).then(setOrders);
    fetch('/api/settings').then(res => res.json()).then(setSettings);
  };

  useEffect(() => {
    if (isAuthenticated) loadData();
  }, [isAuthenticated]);

  // Orders Flow
  const updateOrderStatus = async (id: string, newStatus: string) => {
    await fetch('/api/orders', {
      method: 'PUT',
      body: JSON.stringify({ id, dispatchStatus: newStatus }),
      headers: { 'Content-Type': 'application/json' }
    });
    setOrders(orders.map((o: any) => o.id === id ? { ...o, dispatchStatus: newStatus } : o));
  };

  // Products Flow
  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingProduct.id ? 'PUT' : 'POST';
    await fetch('/api/products', {
      method,
      body: JSON.stringify(editingProduct),
      headers: { 'Content-Type': 'application/json' }
    });
    setEditingProduct(null);
    loadData();
  };

  const deleteProduct = async (id: string) => {
    if(confirm("Are you sure you want to delete this specific product?")) {
      await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      loadData();
    }
  };

  // Settings Flow
  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
      headers: { 'Content-Type': 'application/json' }
    });
    alert("Settings saved successfully!");
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.name || order.customerName || "").toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      (order.phone || order.customerPhone || "").includes(orderSearchQuery) ||
      (order.email || order.customerEmail || "").toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      (order.id || "").toLowerCase().includes(orderSearchQuery.toLowerCase());
      
    const matchesStatus = orderStatusFilter === "All" || order.dispatchStatus === orderStatusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a: any, b: any) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <form onSubmit={login} className="p-8 bg-gray-900 rounded-2xl border border-gray-800 space-y-4 shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Console</h1>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} 
          className="w-full bg-black border border-gray-700 p-4 rounded-xl focus:outline-none focus:border-blue-500 transition" placeholder="Password (admin123)" />
        <button className="w-full bg-blue-600 p-4 rounded-xl hover:bg-blue-500 font-bold transition">Login Securely</button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white tracking-tight">AuraLock <span className="text-blue-500">Admin</span></h1>
          <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800">
            {['dashboard', 'orders', 'products', 'settings'].map(tab => (
              <button key={tab} 
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2 rounded-md font-medium capitalize transition ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                {tab}
              </button>
            ))}
          </div>
        </header>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
             <h2 className="text-2xl font-bold flex items-center gap-3"><BarChart3 className="w-8 h-8 text-blue-500"/> Performance Dashboard</h2>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex items-center gap-6 shadow-xl border-t-4 border-t-white relative overflow-hidden hover:-translate-y-1 transition duration-300">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                 <div className="bg-white/10 p-4 rounded-xl z-10">
                   <ShoppingCart className="w-8 h-8 text-white" />
                 </div>
                 <div className="z-10">
                   <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Orders</p>
                   <p className="text-4xl font-black text-white">{orders.length}</p>
                 </div>
               </div>

               <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex items-center gap-6 shadow-xl border-t-4 border-t-blue-500 relative overflow-hidden hover:-translate-y-1 transition duration-300">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                 <div className="bg-blue-500/20 p-4 rounded-xl z-10">
                   <CreditCard className="w-8 h-8 text-blue-500" />
                 </div>
                 <div className="z-10">
                   <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Revenue</p>
                   <p className="text-4xl font-black text-white">₹{orders.reduce((sum, order) => sum + Number(order.price || order.amount || 0), 0).toLocaleString('en-IN')}</p>
                 </div>
               </div>

               <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex items-center gap-6 shadow-xl border-t-4 border-t-orange-500 relative overflow-hidden hover:-translate-y-1 transition duration-300">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                 <div className="bg-orange-500/20 p-4 rounded-xl z-10">
                   <Clock className="w-8 h-8 text-orange-500" />
                 </div>
                 <div className="z-10">
                   <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Pending</p>
                   <p className="text-4xl font-black text-white">{orders.filter((o: any) => o.dispatchStatus === 'Pending' || o.dispatchStatus === 'Processing').length}</p>
                 </div>
               </div>

               <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex items-center gap-6 shadow-xl border-t-4 border-t-green-500 relative overflow-hidden hover:-translate-y-1 transition duration-300">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                 <div className="bg-green-500/20 p-4 rounded-xl z-10">
                   <Truck className="w-8 h-8 text-green-500" />
                 </div>
                 <div className="z-10">
                   <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Shipped</p>
                   <p className="text-4xl font-black text-white">{orders.filter((o: any) => o.dispatchStatus === 'Shipped' || o.dispatchStatus === 'Delivered').length}</p>
                 </div>
               </div>
             </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-gray-800 pb-6">
              <h2 className="text-2xl font-bold">Orders Ecosystem</h2>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                 <div className="relative w-full sm:w-64">
                   <input 
                     type="text" 
                     placeholder="Search Name, Phone, or ID" 
                     value={orderSearchQuery}
                     onChange={e => setOrderSearchQuery(e.target.value)}
                     className="w-full bg-black border border-gray-700 px-4 py-2 text-sm rounded-xl focus:outline-none focus:border-blue-500 transition"
                   />
                 </div>
                 <select 
                   value={orderStatusFilter}
                   onChange={e => setOrderStatusFilter(e.target.value)}
                   className="bg-black border border-gray-700 px-4 py-2 rounded-xl focus:outline-none focus:border-blue-500 text-sm transition cursor-pointer"
                 >
                   <option value="All">All Dispatches</option>
                   <option value="Pending">Pending</option>
                   <option value="Processing">Processing</option>
                   <option value="Shipped">Shipped</option>
                   <option value="Delivered">Delivered</option>
                   <option value="Cancelled">Cancelled</option>
                 </select>
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredOrders.map((order: any) => (
                <div key={order.id} className="p-6 bg-black border border-gray-800 rounded-xl hover:border-gray-700 transition">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="font-bold text-xl flex items-center gap-3">
                        {order.id} 
                        <span className="text-xs font-medium text-gray-400 bg-gray-900/80 border border-gray-700 px-3 py-1 rounded-full whitespace-nowrap">
                          {order.date ? new Date(order.date).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Historical Access'}
                        </span>
                      </h3>
                      <p className="text-blue-400 font-medium mt-1">{order.tier} - ₹{order.price?.toLocaleString('en-IN')}</p>
                      <div className="mt-2 text-sm text-gray-400 grid grid-cols-2 gap-x-8">
                         <p>Name: <span className="text-white">{order.name}</span></p>
                         <p>Contact: <span className="text-white">{order.phone}</span></p>
                         <p>Email: <span className="text-white">{order.email}</span></p>
                      </div>
                      <p className="text-gray-500 text-sm mt-2 max-w-xl bg-gray-900 p-2 rounded">{order.address}</p>
                    </div>
                    
                    <div className="text-right flex flex-col items-end gap-2">
                       <button 
                         onClick={() => setSelectedOrder(order)} 
                         className="text-xs bg-gray-800 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-lg font-bold transition flex items-center justify-center border border-gray-700">
                         View Details
                       </button>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.paymentStatus === 'Paid' || order.paymentStatus === 'Completed' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                        Payment: {order.paymentStatus}
                      </span>
                      <select 
                        value={order.dispatchStatus} 
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="bg-gray-900 border border-gray-700 px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:border-blue-500 transition cursor-pointer text-gray-300">
                        <option value="Pending">Dispatch: Pending</option>
                        <option value="Processing">Dispatch: Processing</option>
                        <option value="Shipped">Dispatch: Shipped</option>
                        <option value="Delivered">Dispatch: Delivered</option>
                        <option value="Cancelled">Dispatch: Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              {filteredOrders.length === 0 && <p className="text-gray-500 py-8 text-center italic">No orders found matching your search matrix.</p>}
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Hardware Catalog</h2>
                <button 
                  onClick={() => setEditingProduct({ name: '', price: 0, features: [], image: '' })}
                  className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </div>
              
              {products.map((product: any) => (
                <div key={product.id} className="p-6 bg-gray-900 border border-gray-800 rounded-2xl flex justify-between items-center hover:border-gray-700 transition">
                  <div className="flex items-center gap-6">
                    {product.image ? (
                       <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-lg bg-black p-2" />
                    ) : (
                       <div className="w-24 h-24 bg-black rounded-lg flex items-center justify-center text-xs text-gray-600">No Image</div>
                    )}
                    <div>
                      <h3 className="font-bold text-2xl">{product.name}</h3>
                      <p className="text-blue-400 font-bold mb-2">₹{Number(product.price).toLocaleString('en-IN')}</p>
                      <p className="text-xs text-gray-500">{product.features?.join(' • ')}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => setEditingProduct(product)} className="text-gray-400 hover:text-white bg-black px-4 py-2 rounded-lg border border-gray-800 flex items-center gap-2">
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <button onClick={() => deleteProduct(product.id)} className="text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-lg text-left flex items-center gap-2">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit / Build Form Sidebar */}
            {editingProduct && (
              <div className="bg-gray-900 border border-blue-500/30 p-8 rounded-2xl shadow-[0_0_30px_rgba(0,123,255,0.05)] h-fit sticky top-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-xl">{editingProduct.id ? 'Edit Product' : 'New Product'}</h3>
                  <button onClick={() => setEditingProduct(null)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                
                <form onSubmit={saveProduct} className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-widest font-bold">Display Name</label>
                    <input required type="text" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                      className="w-full bg-black border border-gray-800 p-3 rounded-xl mt-1 focus:border-blue-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-widest font-bold">Price (INR)</label>
                    <input required type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                      className="w-full bg-black border border-gray-800 p-3 rounded-xl mt-1 focus:border-blue-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-widest font-bold">Product Images</label>
                    <div className="mt-1 flex flex-wrap items-center gap-4">
                      {(editingProduct.images || (editingProduct.image ? [editingProduct.image] : [])).map((imgUrl: string, idx: number) => (
                        <div key={idx} className="relative">
                          <img src={imgUrl} alt={`Preview ${idx}`} className="w-16 h-16 object-cover rounded-lg border border-gray-800 bg-black" />
                          <button type="button" onClick={() => {
                             const currentImages = editingProduct.images || (editingProduct.image ? [editingProduct.image] : []);
                             const newImages = currentImages.filter((_: any, i: number) => i !== idx);
                             setEditingProduct({...editingProduct, images: newImages, image: newImages[0] || ''});
                          }} className="absolute -top-2 -right-2 bg-red-500 rounded-full text-white p-1 hover:bg-red-400 transition shadow-[0_0_10px_rgba(255,0,0,0.5)]">
                             <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      
                      <label className="flex flex-col items-center justify-center w-16 h-16 border-2 border-gray-800 border-dashed rounded-xl cursor-pointer hover:border-blue-500 transition hover:bg-blue-900/10">
                        <Plus className="w-6 h-6 text-gray-400" />
                        <input type="file" multiple className="hidden" accept="image/*" onChange={async (e) => {
                           const files = Array.from(e.target.files || []);
                           const base64Promises = files.map(file => new Promise<string>((resolve) => {
                             const reader = new FileReader();
                             reader.onloadend = () => resolve(reader.result as string);
                             reader.readAsDataURL(file);
                           }));
                           const newImages = await Promise.all(base64Promises);
                           const currentImages = editingProduct.images || (editingProduct.image ? [editingProduct.image] : []);
                           const updatedImages = [...currentImages, ...newImages];
                           setEditingProduct({
                              ...editingProduct, 
                              images: updatedImages,
                              image: updatedImages[0] || '' // Fallback for backwards compatibility
                           });
                        }} />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-widest font-bold">Features (Comma Separated)</label>
                    <textarea rows={3} value={(editingProduct.features || []).join(', ')} onChange={e => setEditingProduct({...editingProduct, features: e.target.value.split(',').map(f => f.trim()).filter(f => f)})}
                      className="w-full bg-black border border-gray-800 p-3 rounded-xl mt-1 focus:border-blue-500 focus:outline-none" placeholder="Face Unlock, Fingerprint, Remote..." />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 p-4 rounded-xl font-bold mt-4 flex justify-center items-center gap-2">
                    <Check className="w-5 h-5" /> Save Product
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Global Contact Information</h2>
            <form onSubmit={saveSettings} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-400 block mb-2">Support Email Address</label>
                <input required type="email" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})}
                  className="w-full bg-black border border-gray-700 p-4 rounded-xl focus:border-blue-500 focus:outline-none transition" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400 block mb-2">Support Phone Number</label>
                <input required type="tel" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})}
                  className="w-full bg-black border border-gray-700 p-4 rounded-xl focus:border-blue-500 focus:outline-none transition" />
              </div>
              <button type="submit" className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-gray-200 transition">
                Apply Global Settings
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Order Details Modal Overlay */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6" onClick={() => setSelectedOrder(null)}>
           <div 
             onClick={(e) => e.stopPropagation()}
             className="bg-[#0a0a0a] border border-gray-800 w-full max-w-2xl rounded-3xl overflow-hidden flex flex-col shadow-2xl relative animate-in zoom-in-95 duration-200"
           >
              <div className="flex justify-between items-center border-b border-gray-800 p-6 bg-black">
                <div>
                   <h2 className="text-2xl font-bold">Secure Order Details</h2>
                   <p className="text-gray-500 text-sm font-mono mt-1">{selectedOrder.id}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="bg-gray-900 border border-gray-800 hover:bg-gray-800 hover:text-white text-gray-400 p-2 rounded-full transition">
                   <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
                 <div>
                   <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Customer Demographics</h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-900/50 p-6 rounded-2xl border border-gray-800/50">
                     <div>
                       <p className="text-xs text-gray-500 mb-1">Full Name</p>
                       <p className="font-medium text-white">{selectedOrder.name || selectedOrder.customerName}</p>
                     </div>
                     <div>
                       <p className="text-xs text-gray-500 mb-1">Registered Phone</p>
                       <p className="font-medium text-white">{selectedOrder.phone || selectedOrder.customerPhone}</p>
                     </div>
                     <div className="sm:col-span-2">
                       <p className="text-xs text-gray-500 mb-1">Verified Email Address</p>
                       <p className="font-medium text-white break-all">{selectedOrder.email || selectedOrder.customerEmail}</p>
                     </div>
                   </div>
                 </div>

                 <div>
                   <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Fulfillment Destination</h3>
                   <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800/50">
                     <p className="text-gray-300 leading-relaxed text-sm">
                       {selectedOrder.address || "No strict address provided during checkout."}
                     </p>
                   </div>
                 </div>

                 <div>
                   <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Financial & Hardware Summary</h3>
                   <div className="flex flex-col sm:flex-row justify-between items-center bg-blue-900/10 p-6 rounded-2xl border border-blue-500/20 gap-4">
                     <div>
                       <p className="text-xs text-blue-400/70 mb-1">Encrypted Payload</p>
                       <p className="font-bold text-xl text-blue-400">{selectedOrder.tier || selectedOrder.productName}</p>
                     </div>
                     <div className="text-left sm:text-right">
                       <p className="text-xs text-blue-400/70 mb-1">Total Exited Amount</p>
                       <p className="font-bold text-2xl text-white">₹{Number(selectedOrder.price || selectedOrder.amount || 0).toLocaleString('en-IN')}</p>
                     </div>
                   </div>
                 </div>
                 
                 {selectedOrder.paymentId && (
                   <div className="text-xs text-green-500/70 bg-green-500/10 p-3 rounded-lg border border-green-500/20 text-center font-mono font-bold tracking-widest">
                     PAYMENT ID: {selectedOrder.paymentId}
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
