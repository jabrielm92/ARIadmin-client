import { NextResponse } from 'next/server';
import { listAvailablePhoneNumbers, purchasePhoneNumber } from '@/lib/vapi/assistant';
import { updateClient, getClientById } from '@/lib/db/clients';

// GET available phone numbers
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const areaCode = searchParams.get('areaCode');
    
    const numbers = await listAvailablePhoneNumbers(areaCode);
    
    return NextResponse.json({
      success: true,
      numbers
    });
  } catch (error) {
    console.error('Error listing phone numbers:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST purchase phone number
export async function POST(request) {
  try {
    const { clientId, areaCode } = await request.json();
    
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

    const assistantId = client.services?.aiReceptionist?.vapiAssistantId;
    
    if (!assistantId) {
      return NextResponse.json(
        { success: false, error: 'AI Receptionist not configured yet' },
        { status: 400 }
      );
    }

    // Purchase phone number
    const phoneNumber = await purchasePhoneNumber(assistantId, areaCode);

    // Update client record
    await updateClient(clientId, {
      'services.aiReceptionist.phoneNumber': phoneNumber.number,
      'services.aiReceptionist.phoneNumberId': phoneNumber.id
    });

    return NextResponse.json({
      success: true,
      phoneNumber: {
        number: phoneNumber.number,
        id: phoneNumber.id
      }
    });
  } catch (error) {
    console.error('Error purchasing phone number:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
