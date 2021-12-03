import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getFirestore, collection, query, where, doc, getDoc, getDocs } from "firebase/firestore";
import getElapsedTime from "../functions/getElapsedTime";
import formatNumber from "../functions/formatNumber";
import "../styles/Subreddit.css";
import SubSidebar from "./SubSidebar";

const Subreddit = () => {
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
	const [fetched, setFetched] = useState(false);
	const colors = {
		LightBlue: 'rgb(0, 121, 211)'
	}

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
			<div className="subreddit-main">
				<div className="subreddit-posts-container">
					{posts.length !== 0 ?
						posts.map((post) => {
							return (
								<div key={post.id} className="subreddit-posts">
									<div className="subreddit-posts-votes-container">
										<div className="upvote-btn" />
										<div className="subreddit-posts-votes">
											{formatNumber(post.upvotes - post.downvotes)}
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
				<SubSidebar subreddit={subreddit} colors={colors} />
			</div>
			<div>
				<Link to="submit">Submit Link</Link>
			</div>
		</div>
	);
}

export default Subreddit;