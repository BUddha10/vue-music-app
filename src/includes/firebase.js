import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc, doc, setDoc } from "firebase/firestore/lite";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6lTKKubDeRck-_-sYJrP0oQzj997NBTA",
  authDomain: "vue-music-app-10ed7.firebaseapp.com",
  projectId: "vue-music-app-10ed7",
  storageBucket: "vue-music-app-10ed7.appspot.com",
  appId: "1:770970574257:web:f0c3f6f44f441fa7e6b190",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
//  eslint-disable max-len
export { app, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, db, collection, getDocs, addDoc, doc, setDoc, onAuthStateChanged }; // eslint-disable-line
