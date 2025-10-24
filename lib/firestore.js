import { collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, doc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { v4 as uuidv4 } from 'uuid';

// Client CRUD operations
export const createClient = async (clientData) => {
  try {
    const clientId = uuidv4();
    const docRef = doc(db, 'clients', clientId);
    await setDoc(docRef, {
      ...clientData,
      id: clientId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, id: clientId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getClient = async (clientId) => {
  try {
    const docRef = doc(db, 'clients', clientId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: 'Client not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getAllClients = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'clients'));
    const clients = [];
    querySnapshot.forEach((doc) => {
      clients.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: clients };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateClient = async (clientId, clientData) => {
  try {
    const docRef = doc(db, 'clients', clientId);
    await updateDoc(docRef, {
      ...clientData,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteClient = async (clientId) => {
  try {
    await deleteDoc(doc(db, 'clients', clientId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
