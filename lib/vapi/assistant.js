// Vapi.ai Server SDK Helper Functions
import { getClientById } from '@/lib/db/clients';

const VAPI_BASE_URL = 'https://api.vapi.ai';
const VAPI_PRIVATE_TOKEN = process.env.VAPI_PRIVATE_TOKEN;

/**
 * Create a Vapi assistant for a client
 */
export async function createVapiAssistant(clientId, config) {
  try {
    const client = await getClientById(clientId);
    
    if (!client) {
      throw new Error('Client not found');
    }

    // Build system prompt from client configuration
    const systemPrompt = buildSystemPrompt(client, config);
    
    // Build structured data schema for lead extraction
    const structuredDataSchema = {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'The caller\'s full name' },
        email: { type: 'string', description: 'The caller\'s email address' },
        phone: { type: 'string', description: 'The caller\'s phone number' },
        company: { type: 'string', description: 'The caller\'s company name' },
        interest: { type: 'string', description: 'What service the caller is interested in' },
        budget: { type: 'string', description: 'The caller\'s budget range' },
        timeline: { type: 'string', description: 'When the caller needs the service' },
        leadQuality: { type: 'string', enum: ['hot', 'warm', 'cold'], description: 'Assessment of lead quality' },
        notes: { type: 'string', description: 'Any additional important information' }
      }
    };

    // Build function tools
    const functions = [];
    
    if (config.bookingEnabled) {
      functions.push({
        name: 'check_availability',
        description: 'Check available appointment slots',
        parameters: {
          type: 'object',
          properties: {
            date: { type: 'string', description: 'Date to check (YYYY-MM-DD)' },
            service: { type: 'string', description: 'Service type needed' }
          },
          required: ['date']
        }
      });
      
      functions.push({
        name: 'book_appointment',
        description: 'Book an appointment',
        parameters: {
          type: 'object',
          properties: {
            date: { type: 'string', description: 'Appointment date (YYYY-MM-DD)' },
            time: { type: 'string', description: 'Appointment time (e.g., "10:00 AM")' },
            name: { type: 'string', description: 'Customer name' },
            email: { type: 'string', description: 'Customer email' },
            phone: { type: 'string', description: 'Customer phone number' },
            service: { type: 'string', description: 'Service requested' }
          },
          required: ['date', 'time', 'name']
        }
      });
    }
    
    if (config.quoteEnabled) {
      functions.push({
        name: 'generate_quote',
        description: 'Generate a price quote',
        parameters: {
          type: 'object',
          properties: {
            service: { type: 'string', description: 'Service type' },
            quantity: { type: 'number', description: 'Quantity or scope' },
            requirements: { type: 'string', description: 'Specific requirements' }
          },
          required: ['service']
        }
      });
    }

    // Create assistant via Vapi API
    const assistantData = {
      name: `${client.businessName} - AI Receptionist`,
      model: {
        provider: 'openai',
        model: 'gpt-4-turbo',
        temperature: 0.7,
        systemPrompt
      },
      voice: {
        provider: config.voiceProvider || 'openai',
        voiceId: config.voiceId || 'alloy'
      },
      firstMessage: config.greetingMessage || 'Hello! Thank you for calling. How can I help you today?',
      serverUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/vapi/webhook`,
      serverUrlSecret: process.env.VAPI_WEBHOOK_SECRET || 'vapi-webhook-secret',
      endCallFunctionEnabled: false,
      recordingEnabled: true,
      hipaaEnabled: false,
      clientMessages: ['transcript', 'hang', 'function-call', 'speech-update', 'metadata', 'conversation-update'],
      serverMessages: ['end-of-call-report', 'status-update', 'hang', 'function-call'],
      silenceTimeoutSeconds: 30,
      maxDurationSeconds: 1800, // 30 minutes max
      backgroundSound: 'off',
      backchannelingEnabled: false,
      backgroundDenoisingEnabled: true,
      modelOutputInMessagesEnabled: true,
      transportConfigurations: [
        {
          provider: 'twilio',
          timeout: 60,
          record: true,
          recordingChannels: 'dual'
        }
      ],
      analysisPlan: {
        summaryPrompt: 'Provide a concise summary of this call, highlighting key points discussed, any actions taken, and follow-up items.',
        structuredDataPrompt: 'Extract the caller information and lead details from this conversation.',
        structuredDataSchema,
        successEvaluationPrompt: 'Was this call successful? Did we capture the lead information and address the caller\'s needs?',
        successEvaluationRubric: 'NumericScale'
      }
    };

    // Add functions if any
    if (functions.length > 0) {
      assistantData.model.functions = functions;
    }

    const response = await fetch(`${VAPI_BASE_URL}/assistant`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VAPI_PRIVATE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(assistantData)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Vapi API error: ${error}`);
    }

    const assistant = await response.json();
    return assistant;
  } catch (error) {
    console.error('Error creating Vapi assistant:', error);
    throw error;
  }
}

/**
 * Purchase a phone number via Vapi
 */
export async function purchasePhoneNumber(assistantId, areaCode = null) {
  try {
    const requestBody = {
      assistantId,
      name: `Phone for ${assistantId}`
    };

    if (areaCode) {
      requestBody.areaCode = areaCode;
    }

    const response = await fetch(`${VAPI_BASE_URL}/phone-number/buy`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VAPI_PRIVATE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Vapi API error: ${error}`);
    }

    const phoneNumber = await response.json();
    return phoneNumber;
  } catch (error) {
    console.error('Error purchasing phone number:', error);
    throw error;
  }
}

/**
 * List available phone numbers
 */
export async function listAvailablePhoneNumbers(areaCode = null) {
  try {
    let url = `${VAPI_BASE_URL}/phone-number/available`;
    
    if (areaCode) {
      url += `?areaCode=${areaCode}`;
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${VAPI_PRIVATE_TOKEN}`
      }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Vapi API error: ${error}`);
    }

    const numbers = await response.json();
    return numbers;
  } catch (error) {
    console.error('Error listing phone numbers:', error);
    throw error;
  }
}

/**
 * Get assistant details
 */
export async function getAssistant(assistantId) {
  try {
    const response = await fetch(`${VAPI_BASE_URL}/assistant/${assistantId}`, {
      headers: {
        'Authorization': `Bearer ${VAPI_PRIVATE_TOKEN}`
      }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Vapi API error: ${error}`);
    }

    const assistant = await response.json();
    return assistant;
  } catch (error) {
    console.error('Error getting assistant:', error);
    throw error;
  }
}

/**
 * Update assistant configuration
 */
export async function updateAssistant(assistantId, updates) {
  try {
    const response = await fetch(`${VAPI_BASE_URL}/assistant/${assistantId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${VAPI_PRIVATE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Vapi API error: ${error}`);
    }

    const assistant = await response.json();
    return assistant;
  } catch (error) {
    console.error('Error updating assistant:', error);
    throw error;
  }
}

/**
 * Build system prompt from client configuration
 */
function buildSystemPrompt(client, config) {
  let prompt = `You are a professional and ${config.aiPersonality || 'friendly'} AI phone receptionist for ${config.businessName || client.businessName}.\n\n`;
  
  // Business hours
  prompt += 'BUSINESS HOURS:\n';
  Object.entries(config.businessHours || {}).forEach(([day, hours]) => {
    if (hours.closed) {
      prompt += `${day}: Closed\n`;
    } else {
      prompt += `${day}: ${hours.open} - ${hours.close}\n`;
    }
  });
  prompt += '\n';

  // Services
  if (config.services || config.primaryServices) {
    prompt += 'SERVICES WE OFFER:\n';
    prompt += config.services || config.primaryServices;
    prompt += '\n\n';
  }

  // Pricing
  if (config.pricingInfo) {
    prompt += 'PRICING INFORMATION:\n';
    prompt += config.pricingInfo;
    prompt += '\n\n';
  }

  // Capabilities
  prompt += 'YOUR CAPABILITIES:\n';
  prompt += '- Answer questions about our services and pricing\n';
  prompt += '- Take messages for the team\n';
  
  if (config.bookingEnabled) {
    prompt += '- Book appointments using the check_availability and book_appointment functions\n';
  }
  
  if (config.quoteEnabled) {
    prompt += '- Generate price quotes using the generate_quote function\n';
  }
  
  if (config.forwardTo) {
    prompt += `- Transfer calls to ${config.forwardTo} when requested\n`;
  }
  
  prompt += '\n';

  // Instructions
  prompt += 'INSTRUCTIONS:\n';
  prompt += '1. Always be polite, professional, and helpful\n';
  prompt += '2. Collect caller information (name, email, phone, needs) for lead capture\n';
  prompt += '3. Answer questions accurately based on the information provided\n';
  prompt += '4. If you don\'t know something, be honest and offer to have someone call back\n';
  prompt += '5. Summarize the call and confirm next steps with the caller\n';
  prompt += '6. Keep responses concise and conversational\n';
  
  return prompt;
}
