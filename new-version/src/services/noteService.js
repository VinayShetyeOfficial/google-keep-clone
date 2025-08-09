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
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * Save a new note to Firestore
 * @param {Object} note - Note object
 * @param {string} userId - User ID
 * @returns {Promise<string>} Note ID
 */
export const saveNote = async (note, userId) => {
  try {
    console.log("Saving note to Firestore:", { note, userId });

    const noteData = {
      ...note,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    console.log("Note data to save:", noteData);
    const docRef = await addDoc(collection(db, "notes"), noteData);
    console.log("Note saved successfully with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving note:", error);
    console.error("Error details:", error.code, error.message);
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
    console.log("Getting notes for user:", userId);

    const q = query(
      collection(db, "notes"),
      where("userId", "==", userId)
      // Temporarily removed orderBy to avoid index requirement
      // orderBy("createdAt", "desc")
    );

    console.log("Query created:", q);
    const querySnapshot = await getDocs(q);
    console.log("Query snapshot:", querySnapshot);
    console.log("Number of docs:", querySnapshot.docs.length);

    const notes = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      // Remove the internal id field to avoid conflicts with Firestore document ID
      const { id: internalId, ...noteData } = data;
      return {
        id: doc.id, // Use Firestore document ID
        ...noteData,
      };
    });

    // Sort notes by createdAt timestamp (newest first) to avoid Firestore index requirement
    notes.sort((a, b) => {
      const timeA = a.createdAt?.toDate?.() || new Date(0);
      const timeB = b.createdAt?.toDate?.() || new Date(0);
      return timeB - timeA; // Descending order (newest first)
    });

    console.log("Mapped notes:", notes);
    return notes;
  } catch (error) {
    console.error("Error getting user notes:", error);
    console.error("Error details:", error.code, error.message);
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
    const noteRef = doc(db, "notes", noteId);
    await updateDoc(noteRef, {
      ...updatedNote,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating note:", error);
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
    console.log("Deleting note from Firestore:", noteId);
    const noteRef = doc(db, "notes", noteId);
    console.log("Document reference created:", noteRef);
    await deleteDoc(noteRef);
    console.log("Note deleted successfully from Firestore");
  } catch (error) {
    console.error("Error deleting note:", error);
    console.error("Error details:", error.code, error.message);
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
    const noteRef = doc(db, "notes", noteId);
    const noteDoc = await getDoc(noteRef);

    if (noteDoc.exists()) {
      return {
        id: noteDoc.id,
        ...noteDoc.data(),
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting note:", error);
    throw error;
  }
};
