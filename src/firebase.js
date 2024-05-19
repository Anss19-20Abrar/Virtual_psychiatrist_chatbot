// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';




const firebaseConfig = {
  apiKey: "AIzaSyBL6-YNhNLJ2nrKxDqLPeoXE3YBbT2w82U",
  authDomain: "virtual-psychiatrist-3ae55.firebaseapp.com",
  projectId: "virtual-psychiatrist-3ae55",
  storageBucket: "virtual-psychiatrist-3ae55.appspot.com",
  messagingSenderId: "864257435254",
  appId: "1:864257435254:web:e5fea796b97e384055a157",
  measurementId: "G-PS9J0J0NV7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth();

