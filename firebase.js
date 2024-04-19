import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_VITE_FIREBASE_KEY,
    authDomain: process.env.NEXT_PUBLIC_VITE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_VITE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_VITE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_VITE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_VITE_APP_ID
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);