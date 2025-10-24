import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Mock admin users (in production, this would be in Firestore)
const mockAdmins = [
  {
    id: 'admin-001',
    email: 'admin@arisolutions.com',
    password: 'password123', // In production, this would be hashed
    name: 'Admin User',
    role: 'admin'
  }
];

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // TODO: Replace with Firebase Auth
    // const result = await signInWithEmailAndPassword(auth, email, password);

    // Mock authentication
    const admin = mockAdmins.find(a => a.email === email && a.password === password);

    if (admin) {
      // Generate a simple token (in production, use JWT)
      const token = uuidv4();

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role
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
