import React, { useState, useEffect } from "react";
import { useParams, Outlet } from "react-router-dom";
import { getFirestore, collection, query, where, doc, getDoc, getDocs } from "firebase/firestore";
import PostBox from "./PostBox";
import SubSidebar from "./SubSidebar";
import "../styles/Subreddit.css";

const Subreddit = ({user, setUser}) => {
	const { slug } = useParams(); // Get subreddit slug from url
	const [subreddit, setSubreddit] = useState({
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
	const { title, banner, icon, color } = subreddit;
	const colors = {
		LightBlue: 'rgb(0, 121, 211)'
	}

	// Get Subreddit & posts from database on componentDidMount & componentDidUpdate
	useEffect(() => {
		const getSubreddit = async () => {
			const db = getFirestore();
			const docRef = doc(db, "subreddits", slug);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				return docSnap.data();
			} else {
				return null;
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
					const postObj = post.data();
					postObj.id = post.id; // Add document id to post object
					postsArray.push(postObj);
				});

				// Sort posts array by date (desc)
				postsArray.sort((a, b) => {
					return b.date - a.date;
				});

				setPosts(postsArray.slice());
		};

		// Get Subreddit data from Promise
		getSubreddit()
		.then((data) => {
			setSubreddit(data);
		})
		.catch((error) => {
			console.log(error);
		});

		getPosts();
	}, [slug]);

	return (
		<div className="subreddit">
			<div className="subreddit-banner" style={
				{
					backgroundImage: 'url(' + banner + ')',
					backgroundColor: colors[color]
				}
			} />
			<div className="subreddit-header">
				<div className="subreddit-header-content">
					<img className="subreddit-icon" url={icon} alt="" />
					<div className="subreddit-title">
						<h1>{title}</h1>
						<div className="subreddit-name">r/{slug}</div>
					</div>
				</div>
			</div>
			<div className="subreddit-body">
				<div className="subreddit-posts-container">
					{posts.length !== 0 ?
						posts.map((post) => {
							return (
								<PostBox user={user} setUser={setUser} post={post} posts={posts} setPosts={setPosts} key={post.id} />
							);
						})
					: null
					}
				</div>
				<SubSidebar user={user} slug={slug} subreddit={subreddit} colors={colors} />
			</div>
			<Outlet /> {/* Nested route for Post component (NOTE: Cannot pass props through Outlet in React v6) */}
		</div>
	);
}

export default Subreddit;