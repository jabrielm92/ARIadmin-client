import { getDatabase } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

export async function createCampaign(data) {
  try {
    const db = await getDatabase();
    const collection = db.collection('campaigns');
    
    const campaign = {
      id: uuidv4(),
      clientId: data.clientId,
      name: data.name,
      description: data.description,
      type: data.type || 'lead-capture', // lead-capture, lead-magnet, webinar, etc.
      status: data.status || 'draft', // draft, active, paused, completed
      
      // Campaign Configuration
      targetAudience: data.targetAudience || {},
      leadMagnet: data.leadMagnet || null,
      landingPage: data.landingPage || {},
      thankYouPage: data.thankYouPage || {},
      
      // Form Configuration
      form: data.form || {
        fields: [],
        submitText: 'Submit',
        successMessage: 'Thank you for your interest!'
      },
      
      // Email Configuration
      autoResponder: data.autoResponder || {
        enabled: false,
        subject: '',
        body: ''
      },
      
      // Tracking
      stats: {
        views: 0,
        submissions: 0,
        conversions: 0,
        conversionRate: 0
      },
      
      // Settings
      settings: {
        leadScoring: data.settings?.leadScoring || true,
        autoQualify: data.settings?.autoQualify || false,
        assignToSalesRep: data.settings?.assignToSalesRep || null,
        notifyOnSubmit: data.settings?.notifyOnSubmit || true
      },
      
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: null
    };
    
    await collection.insertOne(campaign);
    
    return { success: true, campaign };
  } catch (error) {
    console.error('Error creating campaign:', error);
    throw error;
  }
}

export async function getCampaignById(id) {
  try {
    const db = await getDatabase();
    const collection = db.collection('campaigns');
    return await collection.findOne({ id });
  } catch (error) {
    console.error('Error getting campaign:', error);
    throw error;
  }
}

export async function getAllCampaigns(clientId) {
  try {
    const db = await getDatabase();
    const collection = db.collection('campaigns');
    
    const query = clientId ? { clientId } : {};
    const campaigns = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    return campaigns;
  } catch (error) {
    console.error('Error getting all campaigns:', error);
    throw error;
  }
}

export async function updateCampaign(id, updateData) {
  try {
    const db = await getDatabase();
    const collection = db.collection('campaigns');
    
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
    console.error('Error updating campaign:', error);
    throw error;
  }
}

export async function deleteCampaign(id) {
  try {
    const db = await getDatabase();
    const collection = db.collection('campaigns');
    
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting campaign:', error);
    throw error;
  }
}

export async function updateCampaignStats(id, stats) {
  try {
    const db = await getDatabase();
    const collection = db.collection('campaigns');
    
    const result = await collection.updateOne(
      { id },
      { 
        $set: { 
          'stats': stats,
          updatedAt: new Date()
        }
      }
    );
    
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error updating campaign stats:', error);
    throw error;
  }
}

export async function publishCampaign(id) {
  try {
    const db = await getDatabase();
    const collection = db.collection('campaigns');
    
    const result = await collection.updateOne(
      { id },
      { 
        $set: { 
          status: 'active',
          publishedAt: new Date(),
          updatedAt: new Date()
        }
      }
    );
    
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error publishing campaign:', error);
    throw error;
  }
}

export async function pauseCampaign(id) {
  try {
    const db = await getDatabase();
    const collection = db.collection('campaigns');
    
    const result = await collection.updateOne(
      { id },
      { 
        $set: { 
          status: 'paused',
          updatedAt: new Date()
        }
      }
    );
    
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error pausing campaign:', error);
    throw error;
  }
}
