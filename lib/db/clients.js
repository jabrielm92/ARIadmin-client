import { getDatabase } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

function generatePassword(length = 12) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  const randomBytes = crypto.randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    password += charset[randomBytes[i] % charset.length];
  }
  
  return password;
}

export async function createClient(clientData) {
  try {
    const db = await getDatabase();
    const collection = db.collection('clients');
    
    const password = generatePassword();
    const clientId = uuidv4();
    
    const client = {
      clientId,
      businessName: clientData.businessName,
      contactName: clientData.contactName,
      email: clientData.email,
      phone: clientData.phone,
      industry: clientData.industry || '',
      website: clientData.website || '',
      address: clientData.address || '',
      contactTitle: clientData.contactTitle || '',
      contactEmail: clientData.contactEmail,
      contactPhone: clientData.contactPhone || '',
      loginEmail: clientData.email,
      password, // In production, this should be hashed
      services: {
        aiReceptionist: {
          enabled: clientData.services?.aiReceptionist || false,
          phoneNumber: '',
          vapiAssistantId: '',
          setupComplete: false
        },
        bookingAccelerator: {
          enabled: clientData.services?.bookingAccelerator || false,
          landingPageUrl: '',
          setupComplete: false
        },
        leadGen: {
          enabled: clientData.services?.leadGen || false,
          campaigns: [],
          setupComplete: false
        }
      },
      apiKeys: {
        vapiPublicKey: '',
        vapiPrivateToken: '',
      },
      status: 'active',
      notes: clientData.notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await collection.insertOne(client);
    
    return {
      success: true,
      client: {
        ...client,
        temporaryPassword: password // Return password only on creation
      }
    };
  } catch (error) {
    console.error('Error creating client:', error);
    return { success: false, error: error.message };
  }
}

export async function getClientById(clientId) {
  try {
    const db = await getDatabase();
    const collection = db.collection('clients');
    const client = await collection.findOne({ clientId });
    
    if (client) {
      // Remove password from response
      const { password, ...clientWithoutPassword } = client;
      return clientWithoutPassword;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting client:', error);
    throw error;
  }
}

export async function getAllClients() {
  try {
    const db = await getDatabase();
    const collection = db.collection('clients');
    const clients = await collection.find({}).toArray();
    
    // Remove passwords from all clients
    return clients.map(({ password, ...client }) => client);
  } catch (error) {
    console.error('Error getting all clients:', error);
    throw error;
  }
}

export async function updateClient(clientId, updateData) {
  try {
    const db = await getDatabase();
    const collection = db.collection('clients');
    
    const result = await collection.updateOne(
      { clientId },
      { 
        $set: { 
          ...updateData,
          updatedAt: new Date()
        }
      }
    );
    
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
}

export async function deleteClient(clientId) {
  try {
    const db = await getDatabase();
    const collection = db.collection('clients');
    const result = await collection.deleteOne({ clientId });
    
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
}

export async function authenticateClient(email, password) {
  try {
    const db = await getDatabase();
    const collection = db.collection('clients');
    const client = await collection.findOne({ loginEmail: email, password });
    
    if (client) {
      const { password: _, ...clientWithoutPassword } = client;
      return clientWithoutPassword;
    }
    
    return null;
  } catch (error) {
    console.error('Error authenticating client:', error);
    throw error;
  }
}
