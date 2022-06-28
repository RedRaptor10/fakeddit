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
	const [nightMode, setNightMode] = useState(false);

	// Set Logged In observer on componentDidMount
	useEffect(() => {
		const auth = getAuth();
		auth.onAuthStateChanged(userAuth => {
			if (userAuth) {
				const db = getFirestore();

				// Get user data
				const getUser = async () => {
					const q = query(collection(db, "users"), where("email", "==", auth.currentUser.email));
					const querySnapshot = await getDocs(q);
					querySnapshot.forEach(doc => {
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
			<Header user={user} nightMode={nightMode} setNightMode={setNightMode} />
			<Routes>
				<Route exact path="/" element={<Home user={user} setUser={setUser} nightMode={nightMode} />} />
				<Route path="/search/:searchQuery" element={<Search nightMode={nightMode} />} />
				<Route exact path="/r/:slug" element={<Subreddit user={user} setUser={setUser} nightMode={nightMode} />}>
					{/* Nested route for Post component using relative path */}
					<Route path="comments/:postId/:postTitle" element={<Post user={user} setUser={setUser} nightMode={nightMode} />} />
				</Route>
				<Route path="/r/:slug/submit" element={<Submit user={user} nightMode={nightMode} />} />
			</Routes>
			<Footer nightMode={nightMode} />
		</HashRouter>
	);
};

export default App;