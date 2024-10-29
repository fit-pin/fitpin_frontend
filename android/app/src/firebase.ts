// firebase.ts
import {initializeApp, getApps, getApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDuRjZrFgIDXPJ0etON9fhOOdPhk4crhKY',
  authDomain: 'fitpin-2f2f2.firebaseapp.com',
  projectId: 'fitpin-2f2f2',
  storageBucket: 'fitpin-2f2f2.appspot.com',
  messagingSenderId: '943488852904',
  appId: '1:943488852904:android:b1411da16fd88dd99b739d',
};

// 이미 초기화된 앱이 있는지 확인 후 가져오기
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export {auth};
