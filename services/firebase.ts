import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

// Firebase configuration provided for the Kiosk App project.
const firebaseConfig = {
  apiKey: "AIzaSyDaxXOrVCXn2T8nzxy05RZLNB8rVcuhYjg",
  authDomain: "teacherkiosk.firebaseapp.com",
  databaseURL: "https://teacherkiosk-default-rtdb.firebaseio.com",
  projectId: "teacherkiosk",
  storageBucket: "teacherkiosk.firebasestorage.app",
  messagingSenderId: "572519882920",
  appId: "1:572519882920:web:63f5a7af3527cc029c629d",
  measurementId: "G-Z71GFPD20D"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();
export const visitsRef = database.ref('visits');

export default firebase;
