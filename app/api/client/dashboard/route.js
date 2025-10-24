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

    // TODO: Replace with real data from Firestore
    // This would aggregate data from calls, appointments, leads collections

    // Mock stats for now
    const stats = {
      callsReceived: Math.floor(Math.random() * 50) + 20,
      appointmentsBooked: Math.floor(Math.random() * 20) + 10,
      leadsCaptured: Math.floor(Math.random() * 40) + 15,
      conversionRate: `${(Math.random() * 30 + 40).toFixed(1)}%`,
      avgCallDuration: `${Math.floor(Math.random() * 3) + 2}m ${Math.floor(Math.random() * 60)}s`,
      revenue: `$${(Math.random() * 5000 + 2000).toFixed(0)}`
    };

    return NextResponse.json({
      success: true,
      stats
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
