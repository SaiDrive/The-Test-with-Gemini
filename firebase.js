// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlfKp0BOdXe9DcEbsesFZwrfEG5JFYkAU",
  authDomain: "funandlearn-4eea7.firebaseapp.com",
  projectId: "funandlearn-4eea7",
  storageBucket: "funandlearn-4eea7.firebasestorage.app",
  messagingSenderId: "775008570838",
  appId: "1:775008570838:web:79e963178ffd704b4e2877",
  measurementId: "G-TW2RVPR93T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);