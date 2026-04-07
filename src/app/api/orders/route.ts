import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

export async function GET() {
  const db = getDB();
  return NextResponse.json(db.orders);
}

export async function POST(request: Request) {
  const orderDetails = await request.json();
  const db = getDB();
  
  const year = new Date().getFullYear();
  const prefix = `ORD-${year}-`;
  let nextSeq = 1;
  const existingOrders = db.orders.filter((o: any) => o.id?.startsWith(prefix));
  if (existingOrders.length > 0) {
     const maxSeq = Math.max(...existingOrders.map((o: any) => parseInt(o.id.replace(prefix, ''), 10) || 0));
     nextSeq = maxSeq + 1;
  }
  
  const generatedId = `${prefix}${nextSeq.toString().padStart(4, '0')}`;
  
  const newOrder = {
    ...orderDetails,
    id: generatedId,
    razorpayOrderId: orderDetails.orderId,
    paymentStatus: orderDetails.paymentStatus || 'Pending',
    dispatchStatus: 'Pending',
    date: new Date().toISOString()
  };
  
  db.orders.unshift(newOrder); // Add to top
  saveDB(db);
  
  // Asynchronous WhatsApp Dispatch
  try {
     const twilioSid = process.env.TWILIO_ACCOUNT_SID;
     const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
     const twilioPhone = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'; // default Twilio sandbox number
     
     if (twilioSid && twilioAuth && newOrder.phone) {
       const client = twilio(twilioSid, twilioAuth);
       
       // Clean exactly into E.164 string format universally mapping international / Indian standards
       let cleanPhone = newOrder.phone.replace(/[^\d+]/g, '');
       if (!cleanPhone.startsWith('+')) {
          if (cleanPhone.length === 10) cleanPhone = '+91' + cleanPhone; // Fallback mapping native Indian digits
          else cleanPhone = '+' + cleanPhone;
       }

       // Construct native WhatsApp String Template
       const whatsappPayload = 
         `Hello ${newOrder.name || 'Customer'},\n\n` +
         `Your order is confirmed ✅\n\n` +
         `Order ID: ${newOrder.id}\n` +
         `Product: ${newOrder.productName}\n\n` +
         `We will contact you soon for delivery.\n\n` +
         `- Englabs Products`;

       // Fire and Forget Array (Ensure checkout proceeds lightning fast)
       client.messages.create({
          body: whatsappPayload,
          from: twilioPhone.startsWith('whatsapp:') ? twilioPhone : `whatsapp:${twilioPhone}`,
          to: `whatsapp:${cleanPhone}`
       }).catch((err: any) => console.error("Twilio WhatsApp Payload Error:", err));
     } else {
       console.warn("Twilio configuration bypassed: Missing LIVE TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN environment parameters.");
     }
  } catch(err) {
     console.error("Twilio System Module Failure:", err);
  }
  // Asynchronous Nodemailer Broadcast
  try {
     const emailUser = process.env.EMAIL_USER;
     const emailPass = process.env.EMAIL_PASS;
     
     if (emailUser && emailPass && newOrder.email) {
       const transporter = nodemailer.createTransport({
         service: 'gmail',
         auth: {
           user: emailUser,
           pass: emailPass
         }
       });

       const mailOptions = {
         from: `"AuraLock Operations" <${emailUser}>`,
         to: newOrder.email,
         subject: `Order Confirmed: ${newOrder.id} - AuraLock`,
         html: `
           <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: 40px auto; color: #111827; line-height: 1.6; border: 1px solid #e5e7eb; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
             
             <!-- Header -->
             <div style="text-align: center; margin-bottom: 32px;">
               <h1 style="font-size: 24px; font-weight: 700; letter-spacing: -0.5px; margin: 0; color: #000;">Order Confirmed – AuraLock</h1>
               <p style="color: #6b7280; font-size: 15px; margin-top: 8px;">Thank you for your purchase, ${newOrder.name || 'Valued Customer'}.</p>
             </div>

             <!-- Order Details Panel -->
             <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
               <table width="100%" style="font-size: 14px; border-collapse: collapse;">
                 <tr>
                   <td style="padding-bottom: 12px; color: #6b7280; font-weight: 500;">Order ID</td>
                   <td style="padding-bottom: 12px; font-weight: 600; text-align: right; color: #111827;">${newOrder.id}</td>
                 </tr>
                 <tr>
                   <td style="padding-bottom: 12px; color: #6b7280; font-weight: 500;">Product</td>
                   <td style="padding-bottom: 12px; font-weight: 600; text-align: right; color: #111827;">${newOrder.productName}</td>
                 </tr>
                 <tr>
                   <td style="border-top: 1px solid #e5e7eb; padding-top: 12px; color: #6b7280; font-weight: 500;">Total Paid</td>
                   <td style="border-top: 1px solid #e5e7eb; padding-top: 12px; font-weight: 700; text-align: right; color: #111827;">₹${newOrder.price?.toLocaleString('en-IN')}</td>
                 </tr>
               </table>
             </div>

             <!-- Delivery Status -->
             <div style="text-align: center; margin-bottom: 32px;">
               <p style="font-size: 15px; font-weight: 600; color: #059669; margin: 0;">We will contact you soon regarding hardware dispatch and final delivery scheduling.</p>
             </div>

             <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 32px 0;" />

             <!-- Footer/Support -->
             <div style="text-align: center;">
               <p style="font-size: 13px; color: #6b7280; margin: 0;">
                 Need help with your order? Contact our support team at <br/>
                 <a href="mailto:support@englabs.in" style="font-weight: 600; color: #2563EB; text-decoration: none;">support@englabs.in</a>
               </p>
               <p style="font-size: 11px; color: #9ca3af; margin-top: 16px;">
                 © ${new Date().getFullYear()} AuraLock Security Systems. All rights reserved.
               </p>
             </div>

           </div>
         `
       };

       // Fire and forget (don't block securely returning the frontend Success Matrix)
       transporter.sendMail(mailOptions).catch(err => console.error("Email Gateway Error:", err));
     } else {
       console.warn("Nodemailer configuration bypassed: Missing LIVE EMAIL_USER or EMAIL_PASS environment variables.");
     }
  } catch(err) {
     console.error("Nodemailer System Failure:", err);
  }

  return NextResponse.json({ success: true, order: newOrder });
}

export async function PUT(request: Request) {
    const { id, dispatchStatus } = await request.json();
    const db = getDB();
    const orderIndex = db.orders.findIndex((o: any) => o.id === id);
    if (orderIndex > -1) {
        db.orders[orderIndex].dispatchStatus = dispatchStatus;
        saveDB(db);
        return NextResponse.json({ success: true, order: db.orders[orderIndex] });
    }
    return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
}
