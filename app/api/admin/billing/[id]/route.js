import { NextResponse } from 'next/server';
import { getBillingByClientId, createBillingRecord, updateBillingRecord } from '@/lib/db/billing';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const billing = await getBillingByClientId(id);

    return NextResponse.json({
      success: true,
      billing
    });
  } catch (error) {
    console.error('Error fetching billing:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch billing' },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    // Check if billing record already exists
    const existing = await getBillingByClientId(id);

    if (existing) {
      // Update existing
      await updateBillingRecord(existing.id, data);
    } else {
      // Create new
      await createBillingRecord({
        ...data,
        clientId: id
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Billing configuration saved'
    });
  } catch (error) {
    console.error('Error saving billing:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save billing' },
      { status: 500 }
    );
  }
}
