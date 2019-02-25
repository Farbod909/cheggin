// Initialize Firebase
var config = {
	apiKey: "AIzaSyDYNOO7xv3cSCBSy8Y0XGUeL6mdU1nvi3M",
	authDomain: "cheggin-extension.firebaseapp.com",
	databaseURL: "https://cheggin-extension.firebaseio.com",
	projectId: "cheggin-extension",
	storageBucket: "cheggin-extension.appspot.com",
	messagingSenderId: "557752221584"
};
firebase.initializeApp(config);
var db = firebase.firestore();

window.onload = function() {

	firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      // [START_EXCLUDE]			
			document.getElementById('main-page-content').classList.remove('hidden');
			document.getElementById('login-page-content').classList.add('hidden');
      // [END_EXCLUDE]
    } else {
      // [START_EXCLUDE]			
			document.getElementById('login-page-content').classList.remove('hidden');
			document.getElementById('main-page-content').classList.add('hidden');
      // [END_EXCLUDE]
    }
    document.getElementById('login-button').disabled = false;
  });
  // [END authstatelistener]

	document.getElementById('login-button').addEventListener('click', startSignIn, false);
	document.getElementById('logout-button').addEventListener('click', startSignOut, false);
	
};

function startSignIn() {
  document.getElementById('login-button').disabled = true;
  if (!firebase.auth().currentUser) {
		var bgPage = chrome.extension.getBackgroundPage();
		bgPage.facebookSignIn();
  }
}

function startSignOut() {
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  }
}