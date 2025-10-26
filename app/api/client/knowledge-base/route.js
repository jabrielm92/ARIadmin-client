import { NextResponse } from 'next/server';
import { updateClient, getClientById } from '@/lib/db/clients';

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

    const client = await getClientById(clientId);
    
    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      knowledgeBase: client.services?.aiReceptionist?.knowledgeBase || { faqs: [], services: [], staff: [] }
    });
  } catch (error) {
    console.error('Error fetching knowledge base:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { clientId, knowledgeBase } = await request.json();
    
    if (!clientId || !knowledgeBase) {
      return NextResponse.json(
        { success: false, error: 'Client ID and knowledge base are required' },
        { status: 400 }
      );
    }

    // Update client with knowledge base
    const updateData = {
      'services.aiReceptionist.knowledgeBase': knowledgeBase,
      'updatedAt': new Date()
    };

    const success = await updateClient(clientId, updateData);
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Knowledge base saved successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to save knowledge base' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error saving knowledge base:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
