import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';

export async function GET() {
  const db = getDB();
  return NextResponse.json(db.products);
}

export async function POST(request: Request) {
  const newProduct = await request.json();
  const db = getDB();
  const productWithId = { id: Date.now().toString(), ...newProduct };
  db.products.push(productWithId);
  saveDB(db);
  return NextResponse.json({ success: true, product: productWithId });
}

export async function PUT(request: Request) {
  const updatedProduct = await request.json();
  const db = getDB();
  const index = db.products.findIndex((p: any) => p.id === updatedProduct.id);
  if (index > -1) {
    db.products[index] = { ...db.products[index], ...updatedProduct };
    saveDB(db);
    return NextResponse.json({ success: true, product: db.products[index] });
  }
  return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const db = getDB();
  const initialLength = db.products.length;
  db.products = db.products.filter((p: any) => p.id !== id);
  if (db.products.length < initialLength) {
    saveDB(db);
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
}
