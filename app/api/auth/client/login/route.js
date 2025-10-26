import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { authenticateClient } from '@/lib/db/clients';

// Mock client credentials as fallback
const mockClients = [
  {
    clientId: 'demo-client-001',
    loginEmail: 'client@example.com',
    email: 'client@example.com',
    password: 'client123',
    businessName: 'Demo Business'
  }
];

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    console.log('Client login attempt:', email);

    // Try MongoDB authentication first
    let client = null;
    try {
      client = await authenticateClient(email, password);
      console.log('MongoDB auth result:', client ? 'found' : 'not found');
    } catch (dbError) {
      console.error('MongoDB auth error:', dbError.message);
    }

    // If MongoDB auth fails, try mock credentials as fallback
    if (!client) {
      console.log('Trying mock credentials...');
      const mockClient = mockClients.find(
        c => c.email === email && c.password === password
      );
      
      if (mockClient) {
        console.log('Mock client found:', mockClient.email);
        client = mockClient;
      } else {
        console.log('Mock client not found for:', email);
      }
    }

    if (client) {
      // Generate a simple token (in production, use JWT)
      const token = uuidv4();

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: client.clientId,
          email: client.email || client.loginEmail,
          businessName: client.businessName,
          role: 'client'
        }
      });
    } else {
      console.log('Login failed for:', email);
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
