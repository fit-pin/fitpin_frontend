import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDuRjZrFgIDXPJ0etON9fhOOdPhk4crhKY',
  authDomain: 'fitpin-2f2f2.firebaseapp.com',
  projectId: 'fitpin-2f2f2',
  storageBucket: 'fitpin-2f2f2.appspot.com',
  messagingSenderId: '943488852904',
  appId: '1:943488852904:android:b1411da16fd88dd99b739d',
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Auth 초기화
const auth = getAuth(app);

export {auth};
