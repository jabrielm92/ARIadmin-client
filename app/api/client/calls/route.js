import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'Client ID required' },
        { status: 400 }
      );
    }

    // TODO: Replace with real data from Firestore calls collection

    // Mock calls for now
    const mockCalls = [
      {
        id: 1,
        callerName: 'John Smith',
        callerNumber: '+1-555-0123',
        duration: '3m 45s',
        outcome: 'appointment-booked',
        timestamp: '2 hours ago',
        hasRecording: true,
        hasTranscript: true,
        sentiment: 'positive',
        recordingUrl: '',
        transcript: 'Sample transcript...'
      },
      {
        id: 2,
        callerName: 'Jane Doe',
        callerNumber: '+1-555-0456',
        duration: '2m 15s',
        outcome: 'question-answered',
        timestamp: '5 hours ago',
        hasRecording: true,
        hasTranscript: true,
        sentiment: 'neutral',
        recordingUrl: '',
        transcript: 'Sample transcript...'
      },
      {
        id: 3,
        callerName: 'Bob Johnson',
        callerNumber: '+1-555-0789',
        duration: '5m 30s',
        outcome: 'transferred',
        timestamp: '1 day ago',
        hasRecording: true,
        hasTranscript: true,
        sentiment: 'positive',
        recordingUrl: '',
        transcript: 'Sample transcript...'
      }
    ];

    return NextResponse.json({
      success: true,
      calls: mockCalls
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
