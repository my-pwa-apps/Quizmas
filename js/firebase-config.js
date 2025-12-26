// ==========================================
// QUIZMAS - Firebase Configuration
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBsXl43fqEpSKjWcY3Gh2N0bDOADrnAJkA",
    authDomain: "quizmas-b2d1b.firebaseapp.com",
    databaseURL: "https://quizmas-b2d1b-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "quizmas-b2d1b",
    storageBucket: "quizmas-b2d1b.firebasestorage.app",
    messagingSenderId: "645890216152",
    appId: "1:645890216152:web:2775f6bbc3e260a44987ad",
    measurementId: "G-GTR2RF7N25"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, database, firestore, auth };
