import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDjjn14dwlKBkInkiSgM3zfXqJ7KdPN6cU",
  authDomain: "alex-chat-application.firebaseapp.com",
  projectId: "alex-chat-application",
  storageBucket: "alex-chat-application.appspot.com",
  messagingSenderId: "693950030841",
  appId: "1:693950030841:web:088a22718d29bb0f819328"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
