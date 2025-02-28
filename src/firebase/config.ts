// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Replace with your app's Firebase project configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCQqZUFncKehGB4hppViNhdTUVv4qBh-3k",
    authDomain: "amel-6f16e.firebaseapp.com",
    projectId: "amel-6f16e",
    storageBucket: "amel-6f16e.firebasestorage.app",
    messagingSenderId: "71765744551",
    appId: "1:71765744551:web:e2ed493cfcf9dc5e60f482",
    measurementId: "G-3GCK39D18D"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { app, db, auth };