import { NextResponse } from 'next/server';
import { getAllCallTranscripts } from '@/lib/db/calls';

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
    
    const calls = await getAllCallTranscripts(clientId);
    
    return NextResponse.json({
      success: true,
      calls
    });
  } catch (error) {
    console.error('Error fetching calls:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
