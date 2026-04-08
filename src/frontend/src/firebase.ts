import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJZy9ox2Ga4jJJt1_f0wM3OXi1jNiEc4Y",
  authDomain: "pulse-ai-a456b.firebaseapp.com",
  projectId: "pulse-ai-a456b",
  storageBucket: "pulse-ai-a456b.firebasestorage.app",
  messagingSenderId: "420231595078",
  appId: "1:420231595078:web:b141db319e556cb2373647",
  measurementId: "G-F13PY66CVK",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
