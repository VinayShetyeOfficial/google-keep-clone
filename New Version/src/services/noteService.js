import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc,
  getDoc,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Save a new note to Firestore
 * @param {Object} note - Note object
 * @param {string} userId - User ID
 * @returns {Promise<string>} Note ID
 */
export const saveNote = async (note, userId) => {
  try {
    const noteData = {
      ...note,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'notes'), noteData);
    return docRef.id;
  } catch (error) {
    console.error('Error saving note:', error);
    throw error;
  }
};

/**
 * Get all notes for a specific user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of notes
 */
export const getUserNotes = async (userId) => {
  try {
    const q = query(
      collection(db, 'notes'), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user notes:', error);
    throw error;
  }
};

/**
 * Update an existing note
 * @param {string} noteId - Note ID
 * @param {Object} updatedNote - Updated note data
 * @returns {Promise<void>}
 */
export const updateNote = async (noteId, updatedNote) => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    await updateDoc(noteRef, {
      ...updatedNote,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

/**
 * Delete a note
 * @param {string} noteId - Note ID
 * @returns {Promise<void>}
 */
export const deleteNote = async (noteId) => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    await deleteDoc(noteRef);
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

/**
 * Get a single note by ID
 * @param {string} noteId - Note ID
 * @returns {Promise<Object>} Note object
 */
export const getNoteById = async (noteId) => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    const noteDoc = await getDoc(noteRef);
    
    if (noteDoc.exists()) {
      return {
        id: noteDoc.id,
        ...noteDoc.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting note:', error);
    throw error;
  }
}; 