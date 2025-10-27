import { getDatabase } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

export async function saveLeadData(data) {
  try {
    const db = await getDatabase();
    const collection = db.collection('leads');
    
    const lead = {
      id: uuidv4(),
      clientId: data.clientId,
      campaignId: data.campaignId || null,
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      interest: data.interest,
      budget: data.budget,
      timeline: data.timeline,
      leadQuality: data.leadQuality || 'warm',
      notes: data.notes,
      status: data.status || 'new',
      source: data.source || 'ai-receptionist',
      callId: data.callId,
      score: data.score || 70,
      
      // Form responses (for Lead Gen campaigns)
      formResponses: data.formResponses || null,
      
      // Tracking data for compliance
      tracking: data.tracking || null,
      
      createdAt: data.timestamp || new Date(),
      updatedAt: new Date()
    };
    
    await collection.insertOne(lead);
    
    return { success: true, lead };
  } catch (error) {
    console.error('Error saving lead data:', error);
    throw error;
  }
}

export async function getLeadById(id) {
  try {
    const db = await getDatabase();
    const collection = db.collection('leads');
    return await collection.findOne({ id });
  } catch (error) {
    console.error('Error getting lead:', error);
    throw error;
  }
}

export async function getAllLeads(clientId) {
  try {
    const db = await getDatabase();
    const collection = db.collection('leads');
    
    const query = clientId ? { clientId } : {};
    const leads = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    return leads;
  } catch (error) {
    console.error('Error getting all leads:', error);
    throw error;
  }
}

export async function updateLead(id, updateData) {
  try {
    const db = await getDatabase();
    const collection = db.collection('leads');
    
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
    console.error('Error updating lead:', error);
    throw error;
  }
}

export async function addLeadNote(id, note) {
  try {
    const db = await getDatabase();
    const collection = db.collection('leads');
    
    const result = await collection.updateOne(
      { id },
      { 
        $push: { 
          notes: {
            text: note,
            addedAt: new Date()
          }
        },
        $set: {
          updatedAt: new Date()
        }
      }
    );
    
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error adding lead note:', error);
    throw error;
  }
}
