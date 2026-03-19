import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as bcrypt from 'bcryptjs';

// Test-login endpoint - used to verify credentials directly
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found in database',
        userFound: false,
        email: email,
      });
    }
    
    if (!user.passwordHash) {
      return NextResponse.json({
        success: false,
        error: 'User has no password set',
        userId: user.id,
      });
    }
    
    if (user.isSuspended) {
      return NextResponse.json({
        success: false,
        error: `Account suspended: ${user.suspensionReason}`,
      });
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    
    return NextResponse.json({
      success: true,
      valid: isValid,
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      hashLength: user.passwordHash.length,
      providedPassword: password,
    });
  } catch (error) {
    return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
  }
}
