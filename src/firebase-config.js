// Firebase Configuration
const firebaseConfig = {
	apiKey: "AIzaSyDVf2ofyD_gruQEYKvwsTnjF5B55bqtswE",
	authDomain: "fakeddit-c2fc2.firebaseapp.com",
	projectId: "fakeddit-c2fc2",
	storageBucket: "fakeddit-c2fc2.appspot.com",
	messagingSenderId: "615056824169",
	appId: "1:615056824169:web:929502b979e546b2f80ff8"
};

export function getFirebaseConfig() {
	if (!firebaseConfig || !firebaseConfig.apiKey) {
		throw new Error('No Firebase configuration object provided.');
	} else {
		return firebaseConfig;
	}
}