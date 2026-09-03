import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBOsoaNWZpcZMf0b4ZSWzuxyJEH_U2-XJg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "student-leave-management-25b72.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "student-leave-management-25b72",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "student-leave-management-25b72.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "881275528872",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:881275528872:web:680b041fb6b839d814c49d"
};

export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey
);

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.warn("Firebase initialization skipped or failed. Falling back to local state engine.", error);
  }
}

export { app, auth, db, storage };
