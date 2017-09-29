import firebase from 'firebase'

var config = {
  apiKey: "AIzaSyAFYb47n-YcDhRxHivbFM9f66VT5p6X46g",
  authDomain: "assassins-aldm.firebaseapp.com",
  databaseURL: "https://assassins-aldm.firebaseio.com",
  projectId: "assassins-aldm",
  storageBucket: "assassins-aldm.appspot.com",
  messagingSenderId: "510113560850"
};
var fire = firebase.initializeApp(config);

export default fire
