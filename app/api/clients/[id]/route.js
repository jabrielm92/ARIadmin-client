import { NextResponse } from 'next/server';
import { getClientById, updateClient, deleteClient } from '@/lib/db/clients';

// GET - Get single client
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const client = await getClientById(id);
    
    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      client
    });
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update client
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    
    const success = await updateClient(id, data);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Client not found or update failed' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete client
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    const success = await deleteClient(id);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Client not found or delete failed' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
