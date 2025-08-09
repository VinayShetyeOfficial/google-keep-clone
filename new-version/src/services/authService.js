import { 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';

/**
 * Sign in with Google
 * @returns {Promise<Object>} User object
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Save user data to Firestore
    await saveUserData(user);
    
    return user;
  } catch (error) {
    console.error('Sign-in error:', error);
    throw error;
  }
};

/**
 * Sign out user
 * @returns {Promise<void>}
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign-out error:', error);
    throw error;
  }
};

/**
 * Save user data to Firestore
 * @param {Object} user - Firebase user object
 * @returns {Promise<void>}
 */
export const saveUserData = async (user) => {
  try {
    const userData = {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      lastLogin: new Date(),
      createdAt: new Date()
    };

    // Use merge to update existing data or create new
    await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

/**
 * Get user data from Firestore
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User data
 */
export const getUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

/**
 * Get error message for authentication errors
 * @param {Object} error - Firebase error object
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error) => {
  switch (error.code) {
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled. Please try again.';
    case 'auth/popup-blocked':
      return 'Pop-up was blocked. Please allow pop-ups and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    case 'auth/too-many-requests':
      return 'Too many sign-in attempts. Please try again later.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/operation-not-allowed':
      return 'Google sign-in is not enabled. Please contact support.';
    default:
      return 'An error occurred during sign-in. Please try again.';
  }
};

/**
 * Listen to authentication state changes
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
}; 