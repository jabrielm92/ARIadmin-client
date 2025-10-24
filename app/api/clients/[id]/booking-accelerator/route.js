import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Mock Booking Accelerator configurations
let mockConfigs = {};

// Default configuration template
const getDefaultConfig = (clientId) => ({
  clientId,
  landingPage: {
    template: 'professional',
    hero: {
      headline: 'Book Your Appointment Today',
      subheadline: 'Schedule a consultation with our expert team',
      ctaText: 'Book Now',
      backgroundImage: '',
      showVideo: false,
      videoUrl: ''
    },
    benefits: [
      { id: 1, icon: 'check', title: 'Fast & Easy', description: 'Book in under 2 minutes' },
      { id: 2, icon: 'calendar', title: 'Flexible Scheduling', description: 'Choose time that works for you' },
      { id: 3, icon: 'shield', title: 'Secure & Private', description: 'Your data is protected' }
    ],
    testimonials: [],
    socialProof: {
      showTrustBadges: true,
      showClientLogos: false,
      clientLogos: []
    },
    branding: {
      logo: '',
      primaryColor: '#1e3a8a',
      secondaryColor: '#14b8a6',
      fontFamily: 'Inter'
    },
    seo: {
      title: '',
      description: '',
      ogImage: ''
    }
  },
  formFields: [
    { id: 1, type: 'text', label: 'Full Name', required: true, placeholder: 'John Doe' },
    { id: 2, type: 'email', label: 'Email', required: true, placeholder: 'john@example.com' },
    { id: 3, type: 'tel', label: 'Phone', required: true, placeholder: '+1 (555) 000-0000' }
  ],
  formSettings: {
    layout: 'single-column',
    submitButtonText: 'Book Appointment',
    successMessage: 'Thank you! We\'ll be in touch soon.',
    redirectUrl: '',
    multiStep: false,
    showProgressBar: false
  },
  qualification: {
    enabled: false,
    criteria: [],
    scoringEnabled: false,
    qualificationThreshold: 50,
    disqualificationRules: []
  },
  calendar: {
    provider: 'calendly',
    apiKey: '',
    calendarId: '',
    availability: {
      bufferTime: 15,
      maxPerDay: 10,
      advanceBooking: 30,
      minimumNotice: 24
    },
    meetingTypes: []
  },
  automation: {
    emailSequences: {
      confirmation: {
        enabled: true,
        subject: 'Your appointment is confirmed',
        body: ''
      },
      reminder: {
        enabled: true,
        timing: '24h',
        subject: 'Reminder: Your appointment is tomorrow',
        body: ''
      },
      followUp: {
        enabled: false,
        timing: '1d',
        subject: 'Thank you for your time',
        body: ''
      }
    },
    smsSequences: {
      confirmation: { enabled: false, message: '' },
      reminder: { enabled: false, message: '' }
    },
    workflows: []
  },
  leadManagement: {
    statuses: ['new', 'contacted', 'qualified', 'appointment-set', 'converted', 'lost'],
    assignmentRules: {
      enabled: false,
      roundRobin: false,
      assignees: []
    },
    notifications: {
      email: [],
      slack: ''
    }
  },
  publicUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/book/${clientId}`,
  analytics: {
    enabled: true,
    googleAnalytics: '',
    facebookPixel: ''
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// GET - Get Booking Accelerator config
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // TODO: Replace with Firestore query
    
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

// PUT - Update Booking Accelerator config
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    
    // TODO: Replace with Firestore update
    
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
