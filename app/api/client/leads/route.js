import { NextResponse } from 'next/server';
import { getAllLeads, updateLead, addLeadNote } from '@/lib/db/leads';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    
    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'Client ID is required' },
        { status: 400 }
      );
    }
    
    const leads = await getAllLeads(clientId);
    
    return NextResponse.json({
      success: true,
      leads
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { leadId, ...updateData } = await request.json();
    
    if (!leadId) {
      return NextResponse.json(
        { success: false, error: 'Lead ID is required' },
        { status: 400 }
      );
    }
    
    const success = await updateLead(leadId, updateData);
    
    return NextResponse.json({
      success
    });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { leadId, note } = await request.json();
    
    if (!leadId || !note) {
      return NextResponse.json(
        { success: false, error: 'Lead ID and note are required' },
        { status: 400 }
      );
    }
    
    const success = await addLeadNote(leadId, note);
    
    return NextResponse.json({
      success
    });
  } catch (error) {
    console.error('Error adding note:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
