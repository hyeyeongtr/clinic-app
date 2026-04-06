import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLaWemR6C3FnFEWxLHNp45FSWAqVUV-yk",
  authDomain: "ella-clinic-62111.firebaseapp.com",
  projectId: "ella-clinic-62111",
  storageBucket: "ella-clinic-62111.firebasestorage.app",
  messagingSenderId: "99089364451",
  appId: "1:99089364451:web:44ccc6b5108a50b6e69cd6",
  measurementId: "G-WYL77F9R52"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
