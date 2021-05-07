import firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBVhP2cvIan9KWbmx67RFYMpOtyzGNBAs4",
    authDomain: "first-baby-20f25.firebaseapp.com",
    projectId: "first-baby-20f25",
    storageBucket: "first-baby-20f25.appspot.com",
    messagingSenderId: "1045914740821",
    appId: "1:1045914740821:web:a78d2d7de084854e69ccdc",
    measurementId: "G-7X5MFW7CNG"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  const storage = firebase.storage();
  const PAYPAL_CLIENT_ID = "AX8q3eq7eAn4nVVQk9IE8hdFdSba9JmZmZeenQZ1QiDSekarf2J1tCcruW7rRJyI19KNEhaer8umhjim";
  const SERVER_URL = "http://192.168.1.172:8083/payment"

export{auth,db,storage,PAYPAL_CLIENT_ID,SERVER_URL}