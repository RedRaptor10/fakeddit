import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirebaseConfig } from "../firebase-config.js";
import { HashRouter, Routes, Route } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import Header from "./Header";
import Home from "./Home";
import Footer from "./Footer";
import Subreddit from "./Subreddit";
import Submit from "./Submit";
import "../styles/index.css";

const App = () => {
	const firebaseAppConfig = getFirebaseConfig();
	initializeApp(firebaseAppConfig);

	const [loggedIn, setLoggedIn] = useState(false);
	const [user, setUser] = useState();

	// Set Logged In observer on componentDidMount
	useEffect(() => {
		const auth = getAuth();
		auth.onAuthStateChanged((userAuth) => {
			if (userAuth) {
				const db = getFirestore();

				// Get user data
				const getUser = async () => {
					const q = query(collection(db, "users"), where("email", "==", auth.currentUser.email));
					const querySnapshot = await getDocs(q);
					querySnapshot.forEach((doc) => {
						setUser({
							email: doc.data().email,
							username: doc.data().username,
							password: doc.data().password
						});
					});
				};

				getUser();
				setLoggedIn(true);
			} else {
				setLoggedIn(false);
				setUser(null);
			}
		});
	}, []);

	return (
		<HashRouter>
			<Header loggedIn={loggedIn} />
			<Routes>
				<Route exact path="/" element={<Home />} />
				<Route exact path="/r/:slug" element={<Subreddit loggedIn={loggedIn} />} />
				<Route exact path="/r/:slug/submit" element={<Submit loggedIn={loggedIn} user={user} />} />
			</Routes>
			<Footer />
		</HashRouter>
	);
};

export default App;