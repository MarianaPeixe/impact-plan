import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBV2SZmztVNkAmGoK3HIcKFE7g5Ho0K640",
  authDomain: "impact-plan-b6547.firebaseapp.com",
  projectId: "impact-plan-b6547",
  storageBucket: "impact-plan-b6547.firebasestorage.app",
  messagingSenderId: "764832844775",
  appId: "1:764832844775:web:019e9dac86d13056d94b42",
  measurementId: "G-LH26ERYBD0"
};

const firebaseApp = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

provider.setCustomParameters({   
    prompt : "select_account "
});

// base de dados do firebase com as cartas, ods e planos criados pelo utilizador
export const db = getFirestore(firebaseApp);

//autenticação
export const auth = getAuth(firebaseApp);

//login / signup com google
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export const createUserWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);

export const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);