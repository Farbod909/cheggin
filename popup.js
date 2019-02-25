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
			
			db.collection("chegged-in-users")
			.where("uid", "==", firebase.auth().currentUser.uid)
			.orderBy('timestamp', 'desc')
			.limit(1)
			.get().then(function(querySnapshot) {
				if (querySnapshot.empty) {
					firebase.auth().currentUser.isCheggedIn = false;
				} else {
					firebase.auth().currentUser.isCheggedIn = true;
					querySnapshot.forEach(function(doc) {
						firebase.auth().currentUser.cheggedInSince = doc.data().timestamp;
					})
				}
				updateUIState();
		});
	
    } else {
			initializeLoggedOutUIState();
    }
  });

	document.getElementById('login-button').addEventListener('click', startSignIn, false);
	document.getElementById('logout-button').addEventListener('click', startSignOut, false);
	document.getElementById('action-button').addEventListener('click', toggleCheggIn, false);
	
};

function updateUIState() {

	document.getElementById('main-page-content').classList.remove('hidden');
	document.getElementById('login-page-content').classList.add('hidden');

	if (firebase.auth().currentUser.isCheggedIn) {
		initCheggedIn();
	} else {
		initCheggedOut();
	}

	db.collection("chegged-in-users")
		.where("group", "==", "dspuci")
		.orderBy('timestamp', 'desc')
		.limit(3)
		.get().then(function(querySnapshot) {

			var infoMessageContent = ""
			if (firebase.auth().currentUser.isCheggedIn) {
				var minutes = 0
				if ('toDate' in firebase.auth().currentUser.cheggedInSince) {
					minutes = (new Date() - firebase.auth().currentUser.cheggedInSince.toDate()) / 1000 / 60
				} else {
					minutes = (new Date() - firebase.auth().currentUser.cheggedInSince) / 1000 / 60
				}
				infoMessageContent = "You've been Chegged in for " + parseInt(minutes, 10) + " minutes"
			} else {
				if (querySnapshot.size >= 3) {
					infoMessageContent = "Queue is full :("
					document.getElementById('action-button').classList.add('disabled');
					document.getElementById('action-button').disabled = true;
				} else if (querySnapshot.size >= 0) {
					infoMessageContent = 3 - querySnapshot.size + " available spots"
					document.getElementById('action-button').classList.remove('disabled');
					document.getElementById('action-button').disabled = false;
				}
			}
			document.getElementById('info-message').textContent = infoMessageContent;	

			var imageSources = [];
			querySnapshot.forEach(function(doc) {
				imageSources.push(doc.data().photoURL + "?height=240");
			})

			var imageElements = document.getElementById('cheggedin-user-photos').getElementsByTagName('img');
			for(var i = 0; i < imageElements.length; i++) {
				var imageElement = imageElements[i];
				if (imageSources[i] != null) {
					imageElement.src = imageSources[i];
				} else {
					imageElement.src = chrome.extension.getURL('assets/none.png')
				}
			}

	});

}

function initializeLoggedOutUIState() {
	document.getElementById('login-button').disabled = false;
	document.getElementById('login-page-content').classList.remove('hidden');
	document.getElementById('main-page-content').classList.add('hidden');
}

function startSignIn() {
	document.getElementById('login-button').disabled = true;
	if (!firebase.auth().currentUser) {
		var bgPage = chrome.extension.getBackgroundPage();
		bgPage.facebookSignIn();
	}	
}

function startSignOut() {
  if (firebase.auth().currentUser) {
		cheggOut(function() {
			firebase.auth().signOut();
		})
  }
}

function initCheggedIn() {
	// initialize UI if the user is chegged in
	var action_button = document.getElementById('action-button')
	// set button to "Chegg Out"
	action_button.classList.remove('chegg-in')
	action_button.classList.add('chegg-out')
	action_button.textContent = 'Chegg Out'
}

function initCheggedOut() {
	// initialize UI if the user is chegged out
	var action_button = document.getElementById('action-button')
	// set button to "Chegg In"
	action_button.classList.remove('chegg-out')
	action_button.classList.add('chegg-in')
	action_button.textContent = 'Chegg In'
}

function toggleCheggIn() {
	var action_button = document.getElementById('action-button')
	if (action_button.classList.contains('chegg-in')) {
		cheggIn(function(docRef) {
			updateUIState();
		});
	} else if (action_button.classList.contains('chegg-out')) {
		cheggOut(function() {
			updateUIState();
		});
	}
}

function cheggIn(callback) {
	if (firebase.auth().currentUser) {
		db.collection("chegged-in-users").add({
			group: "dspuci",
			uid: firebase.auth().currentUser.uid,
			displayName: firebase.auth().currentUser.displayName,
			photoURL: firebase.auth().currentUser.photoURL,
			timestamp: new Date()
		})
		.then(function(docRef) {
			firebase.auth().currentUser.isCheggedIn = true;
			firebase.auth().currentUser.cheggedInSince = new Date();
			callback(docRef);
		})
		.catch(function(error) {
			console.error("Error adding document: ", error);
			callback();
		});
	}
}

function cheggOut(callback) {
	if (firebase.auth().currentUser) {
		db.collection("chegged-in-users")
			.where("uid", "==", firebase.auth().currentUser.uid)
			.get().then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					doc.ref.delete().then(function() {
						firebase.auth().currentUser.isCheggedIn = false;
						callback();
					}).catch(function(error) {
						console.error("Error deleting document: ", error);
						callback();
					});
				});
		});
	} else {
		callback();
	}
}