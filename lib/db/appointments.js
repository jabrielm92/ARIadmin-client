import { getDatabase } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

export async function createAppointment(data) {
  try {
    const db = await getDatabase();
    const collection = db.collection('appointments');
    
    const appointment = {
      id: uuidv4(),
      clientId: data.clientId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      date: data.date,
      time: data.time,
      service: data.service,
      notes: data.notes || '',
      status: data.status || 'scheduled',
      callId: data.callId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await collection.insertOne(appointment);
    
    return { success: true, appointment };
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
}

export async function getAllAppointments(clientId) {
  try {
    const db = await getDatabase();
    const collection = db.collection('appointments');
    
    const query = clientId ? { clientId } : {};
    const appointments = await collection
      .find(query)
      .sort({ date: -1 })
      .toArray();
    
    return appointments;
  } catch (error) {
    console.error('Error getting appointments:', error);
    throw error;
  }
}

export async function updateAppointment(id, updateData) {
  try {
    const db = await getDatabase();
    const collection = db.collection('appointments');
    
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
    console.error('Error updating appointment:', error);
    throw error;
  }
}
