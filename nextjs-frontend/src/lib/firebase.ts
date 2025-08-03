import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDwdp8YC0hg-3hrxRkrcXjGCx517Fq1nW0",
  authDomain: "telemedicine-31088.firebaseapp.com",
  projectId: "telemedicine-31088",
  storageBucket: "telemedicine-31088.firebasestorage.app",
  messagingSenderId: "792144509907",
  appId: "1:792144509907:web:2632bfae6ae6c50b078d26",
  measurementId: "G-278E0JEE4L",

};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);