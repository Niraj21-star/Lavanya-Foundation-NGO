// firebase-init.js
import { firebaseConfig } from './firebase-config.js';

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

export { db, auth };
