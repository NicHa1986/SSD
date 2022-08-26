// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAOjd6gJ42gYTNXkDjFWNNwQT1gFnBCcXo",
    authDomain: "ncsc-2622e.firebaseapp.com",
    databaseURL: "https://ncsc-2622e-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "ncsc-2622e",
    storageBucket: "ncsc-2622e.appspot.com",
    messagingSenderId: "133284636591",
    appId: "1:133284636591:web:f6fc91e128298bb6c4b15a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
