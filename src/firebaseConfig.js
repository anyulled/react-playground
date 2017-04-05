import firebase from "firebase";

const config = {
    apiKey: "AIzaSyBMaCvAJ5ZE6OO5LfJcjier4dvbnX75WVs",
    authDomain: "je-ne-sais-pas-f5d40.firebaseapp.com",
    databaseURL: "https://je-ne-sais-pas-f5d40.firebaseio.com",
    projectId: "je-ne-sais-pas-f5d40",
    storageBucket: "je-ne-sais-pas-f5d40.appspot.com",
    messagingSenderId: "704136918908"
};
export const firebaseApp = firebase.initializeApp(config);
export const firebaseAuth = firebaseApp.auth();
export const firebaseDb = firebaseApp.database();
