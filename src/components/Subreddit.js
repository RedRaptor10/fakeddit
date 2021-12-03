import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getFirestore, collection, query, where, doc, getDoc, getDocs } from "firebase/firestore";
import getElapsedTime from "../functions/getElapsedTime";
import getVotes from "../functions/getVotes";
import "../styles/Subreddit.css";

const Subreddit = () => {
	const { slug } = useParams(); // Get subreddit slug from url
	const [subreddit, setSubreddit] = useState({
		title: '',
		banner: '',
		icon: ''
	});
	const [posts, setPosts] = useState([]);
	const { title, banner, icon } = subreddit;
	const [fetched, setFetched] = useState(false);

	// Get Subreddit & posts from database on componentDidMount & componentDidUpdate
	useEffect(() => {
		const getSubreddit = async () => {
			try {
				const db = getFirestore();
				const docRef = doc(db, "subreddits", slug);
				const docSnap = await getDoc(docRef);

				if (docSnap.exists()) {
					return docSnap.data();
				} else {
					return null;
				}
			} catch (error) {
				console.log(error);
			}
		};

		const getPosts = async () => {
			try {
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

				setPosts(postsArray.slice());
			} catch (error) {
				console.log(error);
			}
		};

		// Get Subreddit data from Promise
		if (!fetched) {
			getSubreddit().then(data => {
				setSubreddit(data);
			});
			getPosts();
			setFetched(true);
		}
	}, [fetched, slug]);

	return (
		<div className="subreddit">
			<div className="subreddit-banner" style={{background: 'url(' + banner + ')'}} />
			<div className="subreddit-header">
				<div className="subreddit-header-content">
					<img className="subreddit-icon" url={icon} alt="" />
					<div className="subreddit-title">
						<h1>{title}</h1>
						<div className="subreddit-name">r/{slug}</div>
					</div>
				</div>
			</div>
			<div className="subreddit-main">
				<div className="subreddit-posts-container">
					{posts.length !== 0 ?
						posts.map((post) => {
							return (
								<div key={post.id} className="subreddit-posts">
									<div className="subreddit-posts-votes-container">
										<div className="upvote-btn" />
										<div className="subreddit-posts-votes">
											{getVotes(post)}
										</div>
										<div className="downvote-btn" />
									</div>
									<div className="subreddit-posts-details">
										<div className="subreddit-posts-meta">
											<span className="subreddit-posts-author">Posts by u/{post.author}</span>
											<span className="subreddit-posts-date">{getElapsedTime(post.date.seconds)}</span>
										</div>
										<div className="subreddit-posts-title">
											<h3>{post.title}</h3>
										</div>
										<div className="subreddit-posts-link">
											<a href={post.link}>{post.link}</a>
										</div>
										<div className="subreddit-posts-text">
											{post.text}
										</div>
										<div className="subreddit-posts-btns-container">
											<div className="subreddit-posts-btn">
												{post.comments} comments
											</div>
										</div>
									</div>
								</div>
							);
						})
					: null
					}
				</div>
				<div className="subreddit-sidebar">
					<Link to="submit">Submit Link</Link>
				</div>
			</div>
		</div>
	);
}

export default Subreddit;