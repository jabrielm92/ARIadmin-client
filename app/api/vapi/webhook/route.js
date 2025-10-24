import { NextRequest, NextResponse } from 'next/server';
import { saveCallTranscript } from '@/lib/db/calls';
import { saveLeadData } from '@/lib/db/leads';
import { createAppointment } from '@/lib/db/appointments';

export async function POST(request) {
  try {
    const payload = await request.json();
    const messageType = payload.message?.type;
    
    console.log(`Received Vapi webhook: ${messageType}`);
    
    // Handle different webhook types
    switch (messageType) {
      case 'end-of-call-report':
        await handleEndOfCallReport(payload);
        break;
      
      case 'function-call':
        return await handleFunctionCall(payload);
      
      case 'transcript':
        await handleTranscript(payload);
        break;
        
      default:
        console.log(`Unhandled message type: ${messageType}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

async function handleEndOfCallReport(payload) {
  try {
    const message = payload.message;
    const call = message.call || {};
    const analysis = message.analysis || {};
    const artifact = message.artifact || {};
    
    // Extract structured data from the call
    const structuredData = analysis.structuredData || {};
    
    // Get clientId from call metadata (you'll set this when making calls)
    const clientId = call.metadata?.clientId || 'unknown';
    
    // Save call transcript
    await saveCallTranscript({
      callId: call.id,
      clientId,
      phoneNumber: call.customer?.number,
      transcript: artifact.transcript,
      summary: analysis.summary,
      leadData: structuredData,
      duration: call.endedAt ? new Date(call.endedAt) - new Date(call.startedAt) : 0,
      status: call.status,
      timestamp: new Date(call.createdAt)
    });
    
    // If lead data is present, save it
    if (structuredData.name || structuredData.email || structuredData.phone) {
      await saveLeadData({
        clientId,
        name: structuredData.name,
        email: structuredData.email,
        phone: structuredData.phone || call.customer?.number,
        company: structuredData.company,
        interest: structuredData.interest,
        budget: structuredData.budget,
        timeline: structuredData.timeline,
        leadQuality: structuredData.leadQuality,
        notes: structuredData.notes || analysis.summary,
        callId: call.id,
        source: 'ai-receptionist',
        score: calculateLeadScore(structuredData),
        timestamp: new Date()
      });
    }
    
    console.log(`Saved call ${call.id} and lead data`);
  } catch (error) {
    console.error('Error handling end of call report:', error);
  }
}

async function handleFunctionCall(payload) {
  const message = payload.message;
  const functionCall = message.functionCall || {};
  const functionName = functionCall.name;
  const parameters = functionCall.parameters || {};
  
  console.log(`Function call: ${functionName}`, parameters);
  
  // Handle different function calls
  let result;
  switch (functionName) {
    case 'check_availability':
      result = await checkAvailability(parameters);
      break;
      
    case 'book_appointment':
      result = await bookAppointment(parameters, message.call);
      break;
      
    case 'generate_quote':
      result = await generateQuote(parameters);
      break;
      
    default:
      result = { error: `Unknown function: ${functionName}` };
  }
  
  return NextResponse.json(result);
}

async function handleTranscript(payload) {
  const message = payload.message;
  const call = message.call || {};
  const transcript = message.transcript;
  
  if (call.id && transcript) {
    const clientId = call.metadata?.clientId || 'unknown';
    await saveCallTranscript({
      callId: call.id,
      clientId,
      transcript: transcript.text,
      timestamp: new Date(),
      isPartial: true
    });
  }
}

// Function implementations
async function checkAvailability(params) {
  // Mock availability check - in production, check real calendar
  const date = new Date(params.date);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  
  return {
    available: true,
    message: `We have availability on ${dayName}`,
    slots: [
      { time: '9:00 AM', available: true },
      { time: '10:00 AM', available: true },
      { time: '11:00 AM', available: false },
      { time: '2:00 PM', available: true },
      { time: '3:00 PM', available: true },
      { time: '4:00 PM', available: true }
    ]
  };
}

async function bookAppointment(params, call) {
  try {
    const clientId = call.metadata?.clientId || 'unknown';
    
    const appointment = await createAppointment({
      clientId,
      name: params.name,
      email: params.email,
      phone: params.phone || call.customer?.number,
      date: params.date,
      time: params.time,
      service: params.service || 'General Consultation',
      callId: call.id,
      status: 'scheduled'
    });
    
    return {
      success: true,
      message: `Appointment booked for ${params.name} on ${params.date} at ${params.time}`,
      appointment: appointment.appointment
    };
  } catch (error) {
    return {
      success: false,
      message: 'Sorry, there was an error booking your appointment. Let me transfer you to a team member.'
    };
  }
}

async function generateQuote(params) {
  // Simple quote generation logic
  const baseRate = {
    'standard': 500,
    'premium': 1000,
    'enterprise': 2500
  };
  
  const rate = baseRate[params.service?.toLowerCase()] || 500;
  const quantity = params.quantity || 1;
  const total = rate * quantity;
  
  return {
    success: true,
    quote: {
      service: params.service,
      quantity,
      unitPrice: rate,
      total,
      validFor: '30 days'
    },
    message: `Based on your requirements, the quote is $${total}. This quote is valid for 30 days.`
  };
}

function calculateLeadScore(data) {
  let score = 50; // Base score
  
  if (data.email) score += 10;
  if (data.phone) score += 10;
  if (data.budget) score += 15;
  if (data.timeline) score += 15;
  
  if (data.leadQuality === 'hot') score += 20;
  else if (data.leadQuality === 'warm') score += 10;
  
  return Math.min(score, 100);
}
