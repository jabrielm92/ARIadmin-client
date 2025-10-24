import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { authenticateClient } from '@/lib/db/clients';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Authenticate with MongoDB
    const client = await authenticateClient(email, password);

    if (client) {
      // Generate a simple token (in production, use JWT)
      const token = uuidv4();

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: client.clientId,
          email: client.loginEmail,
          businessName: client.businessName,
          role: 'client'
        }
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
