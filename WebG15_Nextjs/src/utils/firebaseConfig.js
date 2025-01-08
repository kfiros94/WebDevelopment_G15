// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getAuth } from "firebase/auth"; // Import Authentication

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "web-g15.firebaseapp.com",
  projectId: "web-g15",
  storageBucket: "web-g15.appspot.com",
  messagingSenderId: "431260704833",
  appId: "1:431260704833:web:7ed4fc9bb84ba860d926c0",
  measurementId: "G-NEMF7FBLQF",
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Authentication
export const db = getFirestore(app); // Firestore Database
export const auth = getAuth(app); // Firebase Authentication
