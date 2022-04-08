import firebase from "firebase/compat/app";
import "firebase/compat/database";

var config = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
};

const firebaseApp = firebase.initializeApp(config);

export { firebaseApp }
