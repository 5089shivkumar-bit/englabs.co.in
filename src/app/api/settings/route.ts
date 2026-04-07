import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';

export async function GET() {
  const db = getDB();
  return NextResponse.json(db.settings || { email: 'support@englabs.in', phone: '+91 98765 43210' });
}

export async function POST(request: Request) {
  try {
    const newSettings = await request.json();
    const db = getDB();
    db.settings = newSettings;
    saveDB(db);
    return NextResponse.json({ success: true, settings: newSettings });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}
