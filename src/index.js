import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase'

const config = {
    apiKey: "********************",
    authDomain: "mibascula-davidjl.firebaseapp.com",
    databaseURL: "https://mibascula-davidjl.firebaseio.com",
    projectId: "mibascula-davidjl",
    storageBucket: "",
    messagingSenderId: "**********"
};

firebase.initializeApp(config);
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const firebaseAuth = firebase.auth;

ReactDOM.render(<App/>, document.getElementById('root'));
serviceWorker.unregister();
