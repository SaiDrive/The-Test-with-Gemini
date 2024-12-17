// firebase.config.js
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  getDoc,
} = require("firebase/firestore");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");

// Initialize Firebase
const app = initializeApp(require("./config"));
const db = getFirestore(app);
const storage = getStorage(app);

module.exports = {
  app,
  db,
  storage,
  getDocs,
  collection,
  addDoc,
  doc,
  setDoc,
  ref,
  uploadBytes,
  getDownloadURL,
  updateDoc,
  getDoc,
};
