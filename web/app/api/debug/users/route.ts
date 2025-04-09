import { NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/auth';

export async function GET() {
  try {
    // Check if admin user exists
    const adminUser = await findUserByEmail('admin@example.com');
    const adminExists = !!adminUser;
    
    // Return debugging information
    return NextResponse.json({
      adminUserExists: adminExists,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      { error: 'Error during debugging' },
      { status: 500 }
    );
  }
} 