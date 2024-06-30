// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ping-pal.firebaseapp.com",
  projectId: "ping-pal",
  storageBucket: "ping-pal.appspot.com",
  messagingSenderId: "805187309748",
  appId: "1:805187309748:web:f4348421a37466f8de47e1",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
