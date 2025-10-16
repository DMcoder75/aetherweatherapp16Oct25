import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase configuration for aetherweathercomapp
const firebaseConfig = {
  apiKey: "AIzaSyDnBFxk8y2uZCBiwrpjiKZrNN7DCSlop1M",
  authDomain: "aetherweathercomapp.firebaseapp.com",
  projectId: "aetherweathercomapp",
  storageBucket: "aetherweathercomapp.firebasestorage.app",
  messagingSenderId: "239643520563",
  appId: "1:239643520563:web:fbac3f8f88b7be5d42bd46",
  measurementId: "G-2LL06G2XS6"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app

