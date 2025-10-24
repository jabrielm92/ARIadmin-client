import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Mock database - In production, this would be Firestore
let mockClients = [
  {
    id: uuidv4(),
    businessName: 'ABC Healthcare',
    industry: 'healthcare',
    website: 'https://abchealthcare.com',
    email: 'contact@abchealthcare.com',
    phone: '+1-555-0123',
    address: '123 Medical Center Dr, Boston, MA',
    contactName: 'Dr. Sarah Johnson',
    contactTitle: 'CEO',
    contactEmail: 'sarah@abchealthcare.com',
    contactPhone: '+1-555-0124',
    aiReceptionist: true,
    bookingAccelerator: true,
    monthlyFee: '750',
    notes: 'High-volume clinic, needs 24/7 coverage',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    businessName: 'Premier Legal Services',
    industry: 'legal',
    website: 'https://premierlegal.com',
    email: 'info@premierlegal.com',
    phone: '+1-555-0456',
    address: '456 Law Plaza, New York, NY',
    contactName: 'John Mitchell',
    contactTitle: 'Managing Partner',
    contactEmail: 'john@premierlegal.com',
    contactPhone: '+1-555-0457',
    aiReceptionist: true,
    bookingAccelerator: false,
    monthlyFee: '500',
    notes: 'Specializes in corporate law',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    businessName: 'Elite Real Estate Group',
    industry: 'real-estate',
    website: 'https://eliterealestate.com',
    email: 'team@eliterealestate.com',
    phone: '+1-555-0789',
    address: '789 Property Lane, Miami, FL',
    contactName: 'Maria Rodriguez',
    contactTitle: 'Broker',
    contactEmail: 'maria@eliterealestate.com',
    contactPhone: '+1-555-0790',
    aiReceptionist: false,
    bookingAccelerator: true,
    monthlyFee: '600',
    notes: 'Luxury properties focus',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET - Get all clients
export async function GET() {
  try {
    // TODO: Replace with Firestore query
    // const result = await getAllClients();
    
    return NextResponse.json({
      success: true,
      clients: mockClients
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new client
export async function POST(request) {
  try {
    const data = await request.json();
    
    // TODO: Replace with Firestore creation
    // const result = await createClient(data);
    
    const newClient = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockClients.push(newClient);
    
    return NextResponse.json({
      success: true,
      client: newClient
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
