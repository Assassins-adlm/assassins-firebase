import * as firebase from 'firebase'
import * as firebaseui from 'firebaseui'

var config = {
	apiKey: 'AIzaSyAFYb47n-YcDhRxHivbFM9f66VT5p6X46g',
	authDomain: 'assassins-aldm.firebaseapp.com',
	databaseURL: 'https://assassins-aldm.firebaseio.com',
	projectId: 'assassins-aldm',
	storageBucket: 'assassins-aldm.appspot.com',
	messagingSenderId: '510113560850'
}

firebase.initializeApp(config)
export const ui = new firebaseui.auth.AuthUI(firebase.auth())
const messaging = firebase.messaging();

messaging.requestPermission()
.then(function() {
  console.log('Notification permission granted.');
	return messaging.getToken();
})
.then( token => {
	console.log('token', token)

	sendTokenToServer(token)
})
.catch(function(err) {
  console.log('Unable to get permission to notify.', err);
})

messaging.onMessage(function(payload) {
  console.log('onMessage firebase.js', payload)
})

function sendTokenToServer(currentToken) {
  if (!isTokenSentToServer()) {
    console.log('Sending token to server...');
    setTokenSentToServer(currentToken);
  } else {
    console.log('Token already sent to server so won\'t send it again ' +
        'unless it changes');
  }
}

function isTokenSentToServer() {
  return window.localStorage.getItem('localUserToken') == 1;
}

function setTokenSentToServer(token) {
  window.localStorage.setItem('localUserToken', token ? token : 0);
}

  messaging.getToken()
  .then(function(currentToken) {
    if (currentToken) {
      sendTokenToServer(currentToken);
     // updateUIForPushEnabled(currentToken);
    } else {
      // Show permission request.
      console.log('No Instance ID token available. Request permission to generate one.');
      // Show permission UI.
    //  updateUIForPushPermissionRequired();
      setTokenSentToServer(false);
    }
  })
  .catch(function(err) {
    console.log('An error occurred while retrieving token. ', err);
   // showToken('Error retrieving Instance ID token. ', err);
    setTokenSentToServer(false);
	})

function resetUI(){
messaging.onTokenRefresh(function() {
	messaging.getToken()
	.then(function(refreshedToken) {
		console.log('Token refreshed.');
		// Indicate that the new Instance ID token has not yet been sent to the
		// app server.
		setTokenSentToServer(false);
		// Send Instance ID token to app server.
		sendTokenToServer(refreshedToken);
	})
	.catch(function(err) {
		console.log('Unable to retrieve refreshed token ', err);
		// showToken('Unable to retrieve refreshed token ', err);
 	});
 });
}

export default firebase
