import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Mock AI Receptionist configurations
let mockConfigs = {};

// Default configuration template
const getDefaultConfig = (clientId) => ({
  clientId,
  basicInfo: {
    businessName: '',
    receptionistName: 'Sarah',
    timezone: 'America/New_York',
    language: 'english',
    businessHours: {
      monday: { open: '09:00', close: '17:00', status: 'open' },
      tuesday: { open: '09:00', close: '17:00', status: 'open' },
      wednesday: { open: '09:00', close: '17:00', status: 'open' },
      thursday: { open: '09:00', close: '17:00', status: 'open' },
      friday: { open: '09:00', close: '17:00', status: 'open' },
      saturday: { open: '09:00', close: '13:00', status: 'closed' },
      sunday: { open: '09:00', close: '17:00', status: 'closed' }
    }
  },
  voice: {
    provider: 'vapi',
    type: 'female-professional',
    accent: 'american',
    personality: 'professional',
    speed: 1,
    tone: 'neutral'
  },
  knowledgeBase: {
    services: [],
    faqs: [],
    customResponses: {
      greeting: '',
      closing: '',
      afterHours: '',
      onHold: '',
      voicemail: ''
    }
  },
  callRouting: {
    forwardNumber: '',
    forwardTimeout: '30',
    voicemailEnabled: true,
    duringHoursAction: 'ai-only',
    afterHoursAction: 'voicemail',
    afterHoursNumber: '',
    emergencyDetection: false,
    emergencyNumber: '',
    vipNumbers: '',
    recordCalls: true,
    transcribeCalls: true,
    callWhisper: false
  },
  appointmentBooking: {
    enabled: false,
    provider: 'calendly',
    apiKey: '',
    appointmentTypes: '',
    defaultDuration: '30',
    bufferTime: '0',
    sendConfirmation: true,
    sendSMS: false,
    confirmationTemplate: '',
    maxPerDay: '',
    advanceBooking: '30',
    minimumNotice: '2'
  },
  quoteGeneration: {
    enabled: false,
    strategy: 'fixed',
    basePricing: '',
    taxRate: '',
    volumeDiscounts: '',
    seasonalDiscounts: '',
    promoCodes: '',
    autoApproveLimit: '',
    requireApproval: false,
    approvalEmail: '',
    emailSubject: '',
    emailTemplate: '',
    autoSendEmail: true,
    followUpEnabled: false,
    followUpSchedule: ''
  },
  phoneNumber: {
    twilioSID: '',
    twilioToken: '',
    number: '',
    displayOption: 'twilio',
    recordCalls: true,
    transcribe: true,
    storage: 'twilio',
    retention: '90',
    callScreening: false,
    spamProtection: true,
    allowInternational: false,
    musicOnHold: 'default'
  },
  integrations: {
    crm: 'none',
    crmApiKey: '',
    autoCreateContacts: false,
    syncCallHistory: false,
    webhookUrl: '',
    webhookSecret: '',
    slackEnabled: false,
    slackWebhook: '',
    notificationEmails: '',
    emailFrequency: 'immediate',
    includeTranscripts: false,
    zapierEnabled: false
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// GET - Get AI Receptionist config
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // TODO: Replace with Firestore query
    // const result = await getAIReceptionistConfig(id);
    
    // For now, return default or existing config
    if (!mockConfigs[id]) {
      mockConfigs[id] = getDefaultConfig(id);
    }
    
    return NextResponse.json({
      success: true,
      config: mockConfigs[id]
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update AI Receptionist config
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    
    // TODO: Replace with Firestore update
    // const result = await updateAIReceptionistConfig(id, data);
    
    mockConfigs[id] = {
      ...data,
      clientId: id,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      config: mockConfigs[id]
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
