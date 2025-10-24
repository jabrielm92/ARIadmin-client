import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Import mock storage
import { mockClientCredentials } from '../../client/login/route';

// Generate random password
function generatePassword(length = 12) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

export async function POST(request) {
  try {
    const { clientId, email, businessName } = await request.json();

    // Generate credentials
    const password = generatePassword();
    const credentialId = uuidv4();

    // TODO: Replace with Firebase Auth user creation
    // const result = await createUserWithEmailAndPassword(auth, email, password);

    // Store credentials (in production, password would be hashed)
    mockClientCredentials[clientId] = {
      id: credentialId,
      clientId,
      email,
      password,
      businessName,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      credentials: {
        email,
        password,
        loginUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/client/login`
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// GET - Check if client has credentials
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'Client ID required' },
        { status: 400 }
      );
    }

    const hasCredentials = !!mockClientCredentials[clientId];
    const credentials = mockClientCredentials[clientId];

    return NextResponse.json({
      success: true,
      hasCredentials,
      credentials: hasCredentials ? {
        email: credentials.email,
        createdAt: credentials.createdAt
      } : null
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
