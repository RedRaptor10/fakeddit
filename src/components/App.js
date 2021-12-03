import React from "react";
import { initializeApp } from "firebase/app";
import { getFirebaseConfig } from "../firebase-config.js";
import { HashRouter, Routes, Route } from "react-router-dom";
import Header from "./Header";
//import Footer from "./Footer";
import Home from "./Home";
import Footer from "./Footer";
import Subreddit from "./Subreddit";
import Submit from "./Submit";
import "../styles/index.css";

const App = () => {
	const firebaseAppConfig = getFirebaseConfig();
	initializeApp(firebaseAppConfig);

	return (
		<HashRouter>
			<Header />
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