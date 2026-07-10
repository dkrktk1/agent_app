import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBNJs6rTvmdPAYAQujtziOos-zRojGQscK",
  authDomain: "agent-app-ee052.firebaseapp.com",
  projectId: "agent-app-ee052",
  storageBucket: "agent-app-ee052.firebasestorage.app",
  messagingSenderId: "998141872128",
  appId: "1:998141872128:web:ea24facf99fb1c742ef0e5"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


