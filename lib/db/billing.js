import { getDatabase } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

export async function createBillingRecord(data) {
  try {
    const db = await getDatabase();
    const collection = db.collection('billing');
    
    const record = {
      id: uuidv4(),
      clientId: data.clientId,
      type: data.type, // 'upfront-fee', 'per-lead', 'per-appointment', 'subscription'
      
      // Upfront Fee
      upfrontFee: data.upfrontFee || 0,
      upfrontPaid: data.upfrontPaid || false,
      
      // Per Lead Pricing
      perLeadRate: data.perLeadRate || 0,
      leadsDelivered: 0,
      leadsInvoiced: 0,
      
      // Tracking
      totalRevenue: 0,
      lastInvoiceDate: null,
      
      // Status
      status: 'active', // active, paused, completed
      
      // Metadata
      notes: data.notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await collection.insertOne(record);
    
    return { success: true, record };
  } catch (error) {
    console.error('Error creating billing record:', error);
    throw error;
  }
}

export async function getBillingByClientId(clientId) {
  try {
    const db = await getDatabase();
    const collection = db.collection('billing');
    
    return await collection.findOne({ clientId, status: 'active' });
  } catch (error) {
    console.error('Error getting billing:', error);
    throw error;
  }
}

export async function updateBillingRecord(id, updateData) {
  try {
    const db = await getDatabase();
    const collection = db.collection('billing');
    
    const result = await collection.updateOne(
      { id },
      { 
        $set: { 
          ...updateData,
          updatedAt: new Date()
        }
      }
    );
    
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error updating billing:', error);
    throw error;
  }
}

export async function trackLeadDelivery(clientId, leadId) {
  try {
    const db = await getDatabase();
    const collection = db.collection('billing');
    
    // Increment leads delivered
    const result = await collection.updateOne(
      { clientId, status: 'active' },
      { 
        $inc: { leadsDelivered: 1 },
        $set: { updatedAt: new Date() }
      }
    );
    
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error tracking lead delivery:', error);
    throw error;
  }
}

export async function calculateInvoiceAmount(clientId) {
  try {
    const billing = await getBillingByClientId(clientId);
    
    if (!billing) {
      return { success: false, error: 'No billing record found' };
    }
    
    // Calculate unbilled leads
    const unbilledLeads = billing.leadsDelivered - billing.leadsInvoiced;
    const amount = unbilledLeads * billing.perLeadRate;
    
    return {
      success: true,
      unbilledLeads,
      perLeadRate: billing.perLeadRate,
      amount,
      upfrontFee: billing.upfrontFee,
      upfrontPaid: billing.upfrontPaid
    };
  } catch (error) {
    console.error('Error calculating invoice:', error);
    throw error;
  }
}