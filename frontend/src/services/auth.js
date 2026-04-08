import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyABHJ25XyCJCQ_Ai9e1gohizVw11Wua3ys",
  authDomain: "depression-detection-c514a.firebaseapp.com",
  projectId: "depression-detection-c514a",
  storageBucket: "depression-detection-c514a.firebasestorage.app",
  messagingSenderId: "393659042362",
  appId: "1:393659042362:web:d3dcdcdbeca818d7e70303",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Auth setup
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 🚀 Google Login
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

// 🚪 Logout
export const logoutUser = async () => {
  await signOut(auth);
};