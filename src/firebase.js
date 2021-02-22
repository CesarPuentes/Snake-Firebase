import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/firestore';

const app = firebase.initializeApp({
  apiKey: "AIzaSyDZMbLoqMWvePjewWHAbfzrZwLP4O25SUA",
  authDomain: "bullet-hell-98a4c.firebaseapp.com",
  databaseURL: "https://bullet-hell-98a4c-default-rtdb.firebaseio.com",
  projectId: "bullet-hell-98a4c",
  storageBucket: "bullet-hell-98a4c.appspot.com",
  messagingSenderId: "786210436538",
  appId: "1:786210436538:web:17a2f60be6c3ccb3765983"
});


export const db = app.firestore();
export const auth = app.auth();
export default app;
