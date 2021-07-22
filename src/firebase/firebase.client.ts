import Firebase from 'firebase/app';
import 'firebase/auth';
import "firebase/firestore";
// import 'firebase/storage'

const FirebaseCredentials = {
    apiKey: "AIzaSyA5l4h3fB_FmRRAnpxa0qnJRxodCgnX2tc",
    authDomain: "fullstack-test-nextjs.firebaseapp.com",
    projectId: "fullstack-test-nextjs",
    databaseURL: "https://fullstack-test-nextjs.firebaseio.com",
    appId: "1:410858974259:web:c01a4a52892fb38b560746",
    storageBucket: "fullstack-test-nextjs.appspot.com",
    messagingSenderId: "410858974259",

}



if (!Firebase.apps.length) {
    Firebase.initializeApp(FirebaseCredentials)
}

export default Firebase;
