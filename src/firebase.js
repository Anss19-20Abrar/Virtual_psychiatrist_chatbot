// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);