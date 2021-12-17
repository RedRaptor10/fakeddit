import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirebaseConfig } from "../firebase-config.js";
import { HashRouter, Routes, Route } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import Header from "./Header";
import Home from "./Home";
import Search from "./Search";
import Footer from "./Footer";
import Subreddit from "./Subreddit";
import Submit from "./Submit";
import Post from "./Post";
import "../styles/index.css";

const App = () => {
	const firebaseAppConfig = getFirebaseConfig();
	initializeApp(firebaseAppConfig);

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
							id: doc.id, // Add document id to user object
							email: doc.data().email,
							username: doc.data().username,
							password: doc.data().password,
							upvoted: doc.data().upvoted,
							downvoted: doc.data().downvoted
						});
					});
				};

				getUser();
			} else {
				setUser(null);
			}
		});
	}, []);

	return (
		<HashRouter>
			<Header user={user} />
			<Routes>
				<Route exact path="/" element={<Home />} />
				<Route exact path="/search/:searchQuery" element={<Search />} />
				<Route path="/r/:slug" element={<Subreddit user={user} setUser={setUser} />}>
					{/* Nested route for Post component using relative path */}
					<Route exact path="comments/:postId/:postTitle" element={<Post user={user} setUser={setUser} />} />
				</Route>
				<Route exact path="/r/:slug/submit" element={<Submit user={user} />} />
			</Routes>
			<Footer />
		</HashRouter>
	);
};

export default App;