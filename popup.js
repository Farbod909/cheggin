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
      document.getElementById('quickstart-button').textContent = 'Sign out';
      document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
      document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
      // [END_EXCLUDE]
    } else {
      // [START_EXCLUDE]
      document.getElementById('quickstart-button').textContent = 'Sign-in with Facebook';
      document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
      document.getElementById('quickstart-account-details').textContent = 'null';
      // [END_EXCLUDE]
    }
    document.getElementById('quickstart-button').disabled = false;
  });
  // [END authstatelistener]

	document.getElementById('quickstart-button').addEventListener('click', startSignIn, false);
	
};

function startSignIn() {
  document.getElementById('quickstart-button').disabled = true;
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  } else {
		var bgPage = chrome.extension.getBackgroundPage();
		bgPage.facebookSignIn();
  }
}