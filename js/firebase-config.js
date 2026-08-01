/* ==========================================================
   LENCHOTECH
   FIREBASE CONFIGURATION
========================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

import {
    getAnalytics,
    isSupported
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-analytics.js";


const firebaseConfig = {

    apiKey: "AIzaSyCWiNAdDKVtFQmoZhbaFq1JOVwJnCzWJ8E",

    authDomain: "lenchotech-c2739.firebaseapp.com",

    projectId: "lenchotech-c2739",

    storageBucket: "lenchotech-c2739.firebasestorage.app",

    messagingSenderId: "958484003526",

    appId: "1:958484003526:web:63614fcf661ae508cbb5c7",

    measurementId: "G-ERR6CER5Z0"

};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

let analytics = null;

isSupported().then(supported => {

    if (supported) {

        analytics = getAnalytics(app);

    }

});


export {

    app,

    auth,

    db,

    analytics

};