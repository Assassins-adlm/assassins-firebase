importScripts('https://www.gstatic.com/firebasejs/4.1.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.1.1/firebase-messaging.js');
// importScripts('https://www.gstatic.com/firebasejs/4.1.1/firebase.js');
// import {firebase_pw} from './src/secrets.js';
// import firebase from './src/firebase';
// const firebasePW = require('./src/firebase');


var config = {
    apiKey: 'AIzaSyDeV8rKrgGHtr0AwqY36l9a9Ca7cHVGyV8',
    // apiKey: firebasePW,
    authDomain: 'deets-76612.firebaseapp.com',
    databaseURL: 'https://deets-76612.firebaseio.com',
    projectId: 'deets-76612',
    storageBucket: 'deets-76612.appspot.com',
    messagingSenderId: '1050650539302'
};

console.log('firebase message service worker')

firebase.initializeApp(config);
const messaging = firebase.messaging();


// messaging.requestPermission()
//   .then(() => {
//     console.log('have permission');
//     return messaging.getToken()
//   })
//   .then(token => console.log('token', token))
//   .catch((err) => {
//     console.log('no permission')
//     console.log(err)
//   });

messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'
    };

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});
