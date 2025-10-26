import { NextResponse } from 'next/server';
import { getAllCampaigns, createCampaign } from '@/lib/db/campaigns';

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

    const campaigns = await getAllCampaigns(clientId);

    return NextResponse.json({
      success: true,
      campaigns
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.clientId || !data.name) {
      return NextResponse.json(
        { success: false, error: 'Client ID and name are required' },
        { status: 400 }
      );
    }

    const result = await createCampaign(data);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}
