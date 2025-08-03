import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRUAXFVysDo2pu_EfDrvr634MoqR1hqZA",
  authDomain: "keep-clone-16bc4.firebaseapp.com",
  projectId: "keep-clone-16bc4",
  storageBucket: "keep-clone-16bc4.firebasestorage.app",
  messagingSenderId: "193898314092",
  appId: "1:193898314092:web:71cae873de039904249b49",
  measurementId: "G-7VS1MXV812",
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
