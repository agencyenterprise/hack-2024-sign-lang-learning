import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCP6DN_7w7O5bRPv7K2Y5rPVVX81woHoEw",
  authDomain: "sign-language-test-e2e59.firebaseapp.com",
  projectId: "sign-language-test-e2e59",
  storageBucket: "sign-language-test-e2e59.firebasestorage.app",
  messagingSenderId: "833934936859",
  appId: "1:833934936859:web:d1ebe2138010cdc204e1be",
  measurementId: "G-6QXD8MDGV9",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

export { firebase, auth, db };
