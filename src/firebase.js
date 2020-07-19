import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyD2bVUnvMYuaRZddo6YpYmImpEQn6KYdEw",
    authDomain: "ppp-potluck-party-planner.firebaseapp.com",
    databaseURL: "https://ppp-potluck-party-planner.firebaseio.com",
    projectId: "ppp-potluck-party-planner",
    storageBucket: "ppp-potluck-party-planner.appspot.com",
    messagingSenderId: "222519728165",
    appId: "1:222519728165:web:0015afb799600f10d687cc"
};

firebase.initializeApp(firebaseConfig);

export const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({
    'prompt': 'select_account'
});

export const auth = firebase.auth();

export default firebase;
