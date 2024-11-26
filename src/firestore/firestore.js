
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "@firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCWQXIsNdwYSyoahuSg09K3n0V6mCh6FyA",
  authDomain: "signing-app-d8045.firebaseapp.com",
  projectId: "signing-app-d8045",
  storageBucket: "signing-app-d8045.appspot.com",
  messagingSenderId: "155186864464",
  appId: "1:155186864464:web:78794d9bb0c4b6ff488c55",
  measurementId: "G-LCX40W78RL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore=getFirestore(app);
export const storage = getStorage(app);
