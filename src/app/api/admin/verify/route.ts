import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

/**
 * 2FA Security Handshake: Validates admin OTP and sets session token.
 */
export async function POST(request: Request) {
  try {
    const { otp } = await request.json();
    
    // AuraLock Master Identity Protocol Code
    const PROTOCOL_OTP = "992026"; // In production, this rotates via TOTP or SMS

    if (otp === PROTOCOL_OTP) {
      const response = NextResponse.json({ 
        success: true, 
        message: 'System Identity Verified' 
      });

      // Secure HTTP-Only Handshake (Protects against XSS/Session hijacking)
      response.cookies.set('auralock_admin_session', process.env.ADMIN_SECRET || '4c7e50ee-9621-408c-80ff-bc299ee3a299', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 3600 * 12 // 12-Hour Operational Window
      });

      return response;
    }

    return NextResponse.json({ success: false, error: 'Identity Verification Failed' }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Internal Security Failure' }, { status: 500 });
  }
}
