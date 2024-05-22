import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDSM9fbI-K87cjq3H3ebK3l8nL6p9fEUqc",
  authDomain: "virtual-psychiatrist-f6c15.firebaseapp.com",
  projectId: "virtual-psychiatrist-f6c15",
  storageBucket: "virtual-psychiatrist-f6c15.appspot.com",
  messagingSenderId: "101974128331",
  appId: "1:101974128331:web:4b871c1c03ed3576640d4e",
  measurementId: "G-B9BSEF64J0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, firestore, auth, analytics };
