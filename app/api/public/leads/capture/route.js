import { NextResponse } from 'next/server';
import { saveLeadData } from '@/lib/db/leads';
import { getCampaignById } from '@/lib/db/campaigns';
import { sendLeadNotification } from '@/lib/notifications';
import { saveToGoogleSheets } from '@/lib/integrations/google-sheets';

export async function POST(request) {
  try {
    const { campaignId, formData, tracking } = await request.json();

    if (!campaignId || !formData) {
      return NextResponse.json(
        { success: false, error: 'Missing required data' },
        { status: 400 }
      );
    }

    // Get campaign details
    const campaign = await getCampaignById(campaignId);
    
    if (!campaign || campaign.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Campaign is not active' },
        { status: 400 }
      );
    }

    // Capture IP address from headers
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Build lead data object
    const leadData = {
      clientId: campaign.clientId,
      campaignId: campaignId,
      name: formData['1'] || formData['name'] || 'Unknown',
      email: formData['2'] || formData['email'] || '',
      phone: formData['3'] || formData['phone'] || '',
      company: formData['4'] || formData['company'] || '',
      source: 'Lead Gen Campaign',
      status: 'new',
      score: 70, // Base score, will be calculated by AI later
      
      // Store all form responses
      formResponses: formData,
      
      // Tracking data for compliance
      tracking: {
        ...tracking,
        ip: ip,
        capturedAt: new Date().toISOString()
      },
      
      timestamp: new Date()
    };

    // Save to MongoDB
    const result = await saveLeadData(leadData);

    // Save to Google Sheets (async, don't wait)
    saveToGoogleSheets(campaign.clientId, result.lead).catch(err => {
      console.error('Google Sheets save failed:', err);
    });

    // Send notifications (async, don't wait)
    if (campaign.landingPage?.notifyOnSubmit) {
      sendLeadNotification(campaign, result.lead).catch(err => {
        console.error('Notification failed:', err);
      });
    }

    return NextResponse.json({
      success: true,
      leadId: result.lead.id,
      message: 'Lead captured successfully'
    });
  } catch (error) {
    console.error('Error capturing lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to capture lead' },
      { status: 500 }
    );
  }
}