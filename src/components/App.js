import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirebaseConfig } from "../firebase-config.js";
import { HashRouter, Routes, Route } from "react-router-dom";
import { getAuth } from "firebase/auth";
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

	// Set Logged In observer on componentDidMount
	useEffect(() => {
		const auth = getAuth();
		auth.onAuthStateChanged((user) => {
			if (user) {
				setLoggedIn(true);
			} else {
				setLoggedIn(false);
			}
		});
	});

	return (
		<HashRouter>
			<Header loggedIn={loggedIn} />
			<Routes>
				<Route exact path="/" element={<Home />} />
				<Route exact path="/r/:slug" element={<Subreddit />} />
				<Route exact path="/r/:slug/submit" element={<Submit />} />
			</Routes>
			<Footer />
		</HashRouter>
	);
};

export default App;