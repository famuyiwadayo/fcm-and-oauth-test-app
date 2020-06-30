import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBt1zUA7bz_rhmd4aITlS0zdEHCz9DR5wQ",
  authDomain: "aegle-healthcare.firebaseapp.com",
  databaseURL: "https://aegle-healthcare.firebaseio.com",
  projectId: "aegle-healthcare",
  storageBucket: "aegle-healthcare.appspot.com",
  messagingSenderId: "756985957982",
  appId: "1:756985957982:web:2b7df6c18dcb00d1072ecf",
  measurementId: "G-J1TPHYN3NH",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.usePublicVapidKey(
  "BJzwFM48BQn87wD0JQGm9dvSRLm4ka0z2NdatKn_ZBleRuONQiTaXVkGkZ7Hj4uY6CZRa7xsKQv175kfbkBqamg"
);
export { messaging };
