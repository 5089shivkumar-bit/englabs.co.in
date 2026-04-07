import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpayFallback = {
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
};

export async function POST(request: Request) {
  const { amount, currency } = await request.json();
  const options = {
    amount: amount * 100, // paise
    currency,
    receipt: `rcpt_${Date.now()}`
  };
  
  try {
    if (razorpayFallback.key_id === 'dummy_key' || !razorpayFallback.key_id.startsWith('rzp_')) {
       console.log("Mocking Razorpay Order generation since no valid live keys were found.");
       return NextResponse.json({
         id: `order_mock_${Date.now()}`,
         entity: "order",
         amount: options.amount,
         currency: options.currency,
         receipt: options.receipt,
         status: "created"
       });
    }

    const razorpay = new Razorpay(razorpayFallback);
    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (err) {
    console.error("Razorpay API Key Rejection:", err);
    return NextResponse.json({ error: 'Failed to create order', details: String(err) }, { status: 500 });
  }
}
