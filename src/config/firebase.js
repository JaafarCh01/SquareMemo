import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Replace these with your Firebase config values
  apiKey: "AIzaSyAilMUubFkWq_BjLxxdJtb9mYWVdYYxOoM",
  authDomain: "chess-square-trainer.firebaseapp.com",
  projectId: "chess-square-trainer",
  storageBucket: "chess-square-trainer.firebasestorage.app",
  messagingSenderId: "129000517565",
  appId: "1:129000517565:web:9c627ea377ef0d27032cd4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app; 