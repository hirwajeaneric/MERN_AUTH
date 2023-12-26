// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-79b2d.firebaseapp.com",
  projectId: "mern-auth-79b2d",
  storageBucket: "mern-auth-79b2d.appspot.com",
  messagingSenderId: "77789771724",
  appId: "1:77789771724:web:7b56f4faed76412567cf69"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);