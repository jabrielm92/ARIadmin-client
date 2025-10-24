import { NextResponse } from 'next/server';

// Mock database reference (imported from main route)
import { GET as getAllClients } from '../route';

// GET - Get single client
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // TODO: Replace with Firestore query
    // const result = await getClient(id);
    
    // For now, get from mock data
    const allClientsResponse = await getAllClients();
    const allClients = await allClientsResponse.json();
    const client = allClients.clients.find(c => c.id === id);
    
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
    
    // TODO: Replace with Firestore update
    // const result = await updateClient(id, data);
    
    // For mock: Find and update client
    const allClientsResponse = await getAllClients();
    const allClients = await allClientsResponse.json();
    const clientIndex = allClients.clients.findIndex(c => c.id === id);
    
    if (clientIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }
    
    // Update client data
    allClients.clients[clientIndex] = {
      ...allClients.clients[clientIndex],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      client: allClients.clients[clientIndex]
    });
  } catch (error) {
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
    
    // TODO: Replace with Firestore deletion
    // const result = await deleteClient(id);
    
    // For mock: Remove client from array
    const allClientsResponse = await getAllClients();
    const allClients = await allClientsResponse.json();
    const clientIndex = allClients.clients.findIndex(c => c.id === id);
    
    if (clientIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }
    
    allClients.clients.splice(clientIndex, 1);
    
    return NextResponse.json({
      success: true
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
