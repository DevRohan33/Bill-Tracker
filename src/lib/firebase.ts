// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFCY8TMjgu5hr3wX7g1qJnYpxZn9jTFUI",
  authDomain: "bill-tracker-37c2a.firebaseapp.com",
  projectId: "bill-tracker-37c2a",
  storageBucket: "bill-tracker-37c2a.firebasestorage.app",
  messagingSenderId: "168081841095",
  appId: "1:168081841095:web:c97af9a0853fb92e66d7e2",
  measurementId: "G-S2BCXKW6FZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);