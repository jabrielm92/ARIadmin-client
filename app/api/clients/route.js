import { NextResponse } from 'next/server';
import { createClient, getAllClients } from '@/lib/db/clients';

// GET all clients
export async function GET() {
  try {
    const clients = await getAllClients();
    
    return NextResponse.json({
      success: true,
      clients
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST create new client
export async function POST(request) {
  try {
    const data = await request.json();
    
    const result = await createClient(data);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
