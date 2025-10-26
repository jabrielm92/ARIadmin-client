import { NextResponse } from 'next/server';
import { createVapiAssistant, purchasePhoneNumber } from '@/lib/vapi/assistant';
import { updateClient } from '@/lib/db/clients';

export async function POST(request) {
  try {
    const { clientId, config, purchasePhone, areaCode } = await request.json();
    
    if (!clientId || !config) {
      return NextResponse.json(
        { success: false, error: 'Client ID and config are required' },
        { status: 400 }
      );
    }

    console.log(`Creating Vapi assistant for client ${clientId}...`);

    // Step 1: Create Vapi Assistant
    const assistant = await createVapiAssistant(clientId, config);
    
    console.log(`Assistant created: ${assistant.id}`);

    // Step 2: Optionally purchase phone number
    let phoneNumber = null;
    if (purchasePhone) {
      console.log('Purchasing phone number...');
      phoneNumber = await purchasePhoneNumber(assistant.id, areaCode);
      console.log(`Phone number purchased: ${phoneNumber.number}`);
    }

    // Step 3: Update client record in MongoDB
    const updateData = {
      'services.aiReceptionist.vapiAssistantId': assistant.id,
      'services.aiReceptionist.setupComplete': true,
      'services.aiReceptionist.config': config,
      'services.aiReceptionist.configuredAt': new Date()
    };

    if (phoneNumber) {
      updateData['services.aiReceptionist.phoneNumber'] = phoneNumber.number;
      updateData['services.aiReceptionist.phoneNumberId'] = phoneNumber.id;
    }

    await updateClient(clientId, updateData);

    return NextResponse.json({
      success: true,
      assistant: {
        id: assistant.id,
        name: assistant.name
      },
      phoneNumber: phoneNumber ? {
        number: phoneNumber.number,
        id: phoneNumber.id
      } : null
    });
  } catch (error) {
    console.error('Error activating AI receptionist:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
