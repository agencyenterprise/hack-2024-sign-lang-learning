import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "a",
  authDomain: "a",
  projectId: "a",
  storageBucket: "a",
  messagingSenderId: "a",
  appId: "a",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

export { firebase, auth, db };
