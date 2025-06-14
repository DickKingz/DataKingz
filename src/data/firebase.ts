import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAoBxW05ZFfrgkcWm6QirS6a2YSH0-6Vek",
  authDomain: "illuvilytics.firebaseapp.com",
  databaseURL: "https://illuvilytics-default-rtdb.firebaseio.com",
  projectId: "illuvilytics",
  storageBucket: "illuvilytics.firebasestorage.app",
  messagingSenderId: "240545491699",
  appId: "1:240545491699:web:381abb89189005ccb4a586",
  measurementId: "G-CDPGMBG7MS"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 