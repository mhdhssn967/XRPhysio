// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDSH--CmSiAsKm_7bAPhrDFEuhkrOz0buk",
  authDomain: "xrphysio.firebaseapp.com",
  projectId: "xrphysio",
  storageBucket: "xrphysio.firebasestorage.app",
  messagingSenderId: "1098335903276",
  appId: "1:1098335903276:web:7af2078f975202fec27b89",
  measurementId: "G-21F7VHD3SC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const firestore = getFirestore(app);

export { auth, db, firebaseConfig, firestore };