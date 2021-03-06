import React, { useState, useEffect } from "react";
import { useParams, Outlet } from "react-router-dom";
import { getFirestore, collection, query, where, doc, getDoc, getDocs } from "firebase/firestore";
import Sortbar from "./Sortbar";
import PostBox from "./PostBox";
import Sidebar from "./Sidebar";
import { SubredditContext } from "./subredditContext"; // Import Context allows passing of props to child Post component
import "../styles/Subreddit.css";

const Subreddit = ({user, setUser, nightMode}) => {
	const { slug } = useParams(); // Get subreddit slug from url
	const [subreddit, setSubreddit] = useState({
		slug: '',
		title: '',
		banner: '',
		icon: '',
		members: 0,
		color: '',
		flairs: [],
		description: '',
		created: 0
	});
	const [posts, setPosts] = useState([]);
	const [activeFlairs, setActiveFlairs] = useState([]);
	const { title, color } = subreddit;
	const banner = subreddit.banner !== '' ? require(`../assets/${subreddit.banner}`).default : null;
	const icon = subreddit.icon !== '' ? require(`../assets/${subreddit.icon}`).default : null;
	const colors = {
		LightBlue: 'rgb(0, 121, 211)',
		DarkBlue: 'rgb(0, 64, 121)'
	}

	// Get Subreddit & posts from database on componentDidMount & componentDidUpdate
	useEffect(() => {
		const getSubreddit = async () => {
			const db = getFirestore();
			const docRef = doc(db, "subreddits", slug);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				setSubreddit(docSnap.data());
			}
		};

		const getPosts = async () => {
			const db = getFirestore();
			const postsRef = collection(db, "posts");
			const q = query(postsRef, where("subreddit", "==", slug));
			const querySnap = await getDocs(q);
			const postsArray = [];

			// Add fetched posts to posts array
			querySnap.forEach(post => {
				// Push post data along with post id to array
				postsArray.push({
					...post.data(),
					id: post.id
				});
			});

			// Sort posts array by date (desc)
			postsArray.sort((a, b) => {
				return b.date - a.date;
			});

			setPosts(postsArray);
		};

		// Get Subreddit and Posts data
		getSubreddit();
		getPosts();
	}, [slug]);

	// Add/remove flair to active flairs
	const pickFlair = flair => {
		const temp = activeFlairs.slice();

		// If flair already picked, remove flair, otherwise add flair
		if (activeFlairs.includes(flair)) {
			const index = activeFlairs.indexOf(flair);
			temp.splice(index, 1);
		} else {
			temp.push(flair);
		}

		setActiveFlairs(temp);
    };

	// Check if post has an active flair
	const hasActiveFlair = postFlairs => {
		let includes = false;
		postFlairs.forEach(f => {
			if (activeFlairs.includes(f)) {
				includes = true;
			}
		});

		return includes;
	};

	return (
		<main className={!nightMode ? 'subreddit' : 'subreddit dark'}>
			<div className="subreddit-banner" style={{
				backgroundImage: 'url(' + banner + ')',
				backgroundColor: colors[color]
			}} />
			<div className="subreddit-header">
				<div className="subreddit-header-content">
					<img className="subreddit-icon" src={icon} alt="" />
					<div className="subreddit-title">
						<h1>{title}</h1>
						<div className="subreddit-name">r/{slug}</div>
					</div>
				</div>
			</div>
			<div className="subreddit-body">
				<div className="subreddit-posts-container">
					<Sortbar posts={posts} setPosts={setPosts} />
					{posts.length !== 0 ?
						posts.map((post) => {
							return (
								/* Render post if there are no active flairs OR post has an active flair */
								activeFlairs.length === 0 || hasActiveFlair(post.flairs) ?
									<PostBox key={post.id} user={user} setUser={setUser} post={post} posts={posts} setPosts={setPosts}
										activeFlairs={activeFlairs} pickFlair={pickFlair} />
								: null
							);
						})
					: null
					}
				</div>
				<Sidebar user={user} slug={slug} subreddit={subreddit} colors={colors}
					activeFlairs={activeFlairs} pickFlair={pickFlair} />
			</div>
			<SubredditContext.Provider value={{subreddit, colors, posts, setPosts, activeFlairs, pickFlair}}>
				<Outlet /> {/* Nested route for Post component */}
			</SubredditContext.Provider>
		</main>
	);
}

export default Subreddit;