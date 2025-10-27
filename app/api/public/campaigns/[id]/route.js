import { NextResponse } from 'next/server';
import { getCampaignById } from '@/lib/db/campaigns';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const campaign = await getCampaignById(id);

    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Only return public-facing data
    const publicCampaign = {
      id: campaign.id,
      name: campaign.name,
      landingPage: campaign.landingPage,
      status: campaign.status
    };

    return NextResponse.json({
      success: true,
      campaign: publicCampaign
    });
  } catch (error) {
    console.error('Error fetching public campaign:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch campaign' },
      { status: 500 }
    );
  }
}