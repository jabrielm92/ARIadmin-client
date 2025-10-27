import { NextResponse } from 'next/server';
import { getCampaignById, updateCampaign, deleteCampaign } from '@/lib/db/campaigns';

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

    return NextResponse.json({
      success: true,
      campaign
    });
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch campaign' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const updateData = await request.json();

    const success = await updateCampaign(id, updateData);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found or update failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Campaign updated successfully'
    });
  } catch (error) {
    console.error('Error updating campaign:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update campaign' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const success = await deleteCampaign(id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found or delete failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Campaign deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete campaign' },
      { status: 500 }
    );
  }
}