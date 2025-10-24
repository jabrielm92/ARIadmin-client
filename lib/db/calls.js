import { getDatabase } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

export async function saveCallTranscript(data) {
  try {
    const db = await getDatabase();
    const collection = db.collection('call_transcripts');
    
    if (data.isPartial && data.callId) {
      // Update existing transcript
      await collection.updateOne(
        { callId: data.callId },
        { 
          $set: { 
            transcript: data.transcript,
            updatedAt: new Date()
          }
        },
        { upsert: true }
      );
    } else {
      // Create new transcript
      const transcript = {
        id: uuidv4(),
        callId: data.callId,
        clientId: data.clientId,
        phoneNumber: data.phoneNumber,
        transcript: data.transcript,
        summary: data.summary,
        leadData: data.leadData,
        duration: data.duration,
        status: data.status || 'completed',
        createdAt: data.timestamp || new Date(),
        updatedAt: new Date()
      };
      
      await collection.insertOne(transcript);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error saving call transcript:', error);
    throw error;
  }
}

export async function getCallTranscript(callId) {
  try {
    const db = await getDatabase();
    const collection = db.collection('call_transcripts');
    return await collection.findOne({ callId });
  } catch (error) {
    console.error('Error getting call transcript:', error);
    throw error;
  }
}

export async function getAllCallTranscripts(clientId) {
  try {
    const db = await getDatabase();
    const collection = db.collection('call_transcripts');
    
    const query = clientId ? { clientId } : {};
    const transcripts = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    return transcripts;
  } catch (error) {
    console.error('Error getting all transcripts:', error);
    throw error;
  }
}
