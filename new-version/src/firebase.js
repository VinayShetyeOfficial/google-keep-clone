import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjt03AjtvXGNIeuTZ7GEo8e51VFYBvSzk",
  authDomain: "keep-clone-bc199.firebaseapp.com",
  projectId: "keep-clone-bc199",
  storageBucket: "keep-clone-bc199.firebasestorage.app",
  messagingSenderId: "42705631170",
  appId: "1:42705631170:web:dc3fd1972c878cc2fcc85b",
  measurementId: "G-BCW1NQYX03",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: "select_account", // Forces account selection
});

// Add scopes to get user profile information
googleProvider.addScope("profile");
googleProvider.addScope("email");

export default app;
