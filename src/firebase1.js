import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import firestore from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDSSVi6JmOEOo7o3J9rJhr2tTK9jtYOs_g",
  authDomain: "instagram-clone-react-ee880.firebaseapp.com",
  projectId: "instagram-clone-react-ee880",
  storageBucket: "instagram-clone-react-ee880.appspot.com",
  messagingSenderId: "1087660359055",
  appId: "1:1087660359055:web:bac9735d5c0f8629635ffa",
  measurementId: "G-ECEFMQK1FQ",
};

const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth = getAuth(app);
// export const storage = firebase.storage();

export default app;
