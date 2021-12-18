import React, { useState, useEffect } from "react";
import { useParams, Outlet } from "react-router-dom";
import { getFirestore, collection, query, where, doc, getDoc, getDocs } from "firebase/firestore";
import Sortbar from "./Sortbar";
import PostBox from "./PostBox";
import SubSidebar from "./SubSidebar";
import { SubredditContext } from "./subredditContext"; // Import Context allows passing of props to child Post component
import "../styles/Subreddit.css";

const Subreddit = ({user, setUser}) => {
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

	// Add/remove flair to active flairs
	const pickFlair = (flair) => {
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
	const hasActiveFlair = (postFlairs) => {
		let includes = false;
		postFlairs.forEach((f) => {
			if (activeFlairs.includes(f)) {
				includes = true;
			}
		});

		return includes;
	};

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
				<SubSidebar user={user} slug={slug} subreddit={subreddit} colors={colors}
					activeFlairs={activeFlairs} pickFlair={pickFlair} />
			</div>
			<SubredditContext.Provider value={{subreddit, colors, posts, setPosts, activeFlairs, pickFlair}}>
				<Outlet /> {/* Nested route for Post component */}
			</SubredditContext.Provider>
		</div>
	);
}

export default Subreddit;