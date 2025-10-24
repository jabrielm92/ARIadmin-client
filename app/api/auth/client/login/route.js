import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Mock client credentials - hardcoded for demo
// In production, these would be in Firestore and passwords would be hashed
const mockClientCredentials = [
  {
    clientId: '5b2732a1-28a5-4dd1-a477-652d847778ce',
    email: 'contact@abchealthcare.com',
    password: 'client123',
    businessName: 'ABC Healthcare'
  },
  {
    clientId: 'test-client-2',
    email: 'info@premierlegal.com',
    password: 'client123',
    businessName: 'Premier Legal Services'
  }
];

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // TODO: Replace with Firebase Auth
    // const result = await signInWithEmailAndPassword(auth, email, password);

    // Check if credentials exist
    const clientCred = mockClientCredentials.find(
      c => c.email === email && c.password === password
    );

    if (clientCred) {
      // Generate a simple token (in production, use JWT)
      const token = uuidv4();

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: clientCred.clientId,
          email: clientCred.email,
          businessName: clientCred.businessName,
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
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
