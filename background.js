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

document.addEventListener('DOMContentLoaded', function() {
    
});

function facebookSignIn() {
    var provider = new firebase.auth.FacebookAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
}
