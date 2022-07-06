import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import Sortbar from "./Sortbar";
import PostBox from "./PostBox";
import { sortByHot } from "../functions/sorts";
import "../styles/Home.css";

const Home = ({user, setUser, nightMode}) => {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		const getPosts = async () => {
			const db = getFirestore();
			const querySnapshot = await getDocs(collection(db, "posts"));
			const postsArray = [];

			// Add fetched posts to posts array
			querySnapshot.forEach(post => {
				// Push post data along with post id to array
				postsArray.push({
					...post.data(),
					id: post.id
				});
			});

			// Sort posts array by hot (desc)
			sortByHot(postsArray);

			setPosts(postsArray.slice());
		};

		getPosts();
	}, []);

	return (
		<div className={!nightMode ? "home" : "home home-dark"}>
			<div className="home-header">
				Popular posts
			</div>
			<div className="home-body">
				<div className="home-posts-container">
					<Sortbar posts={posts} setPosts={setPosts} nightMode={nightMode} />
					{posts.length !== 0 ?
						posts.map((post) => {
							return (
								<PostBox key={post.id} user={user} propSlug={post.subreddit} setUser={setUser}
									post={post} posts={posts} setPosts={setPosts} nightMode={nightMode} />
							);
						})
					: null
					}
				</div>
				<div className="home-sidebar">
					<div className="home-sidebar-section">
						<div className="home-sidebar-section-header">About</div>
						<div className="home-sidebar-section-content">
							Fakeddit is a clone of a popular social media website.
							<br /><br />
							View source code <a href="https://github.com/RedRaptor10/fakeddit" target="_blank" rel="noreferrer">here</a>.
						</div>
					</div>
					<div className="home-sidebar-section">
						<div className="home-sidebar-section-header">Features</div>
						<div className="home-sidebar-section-content">
							<ul>
								<li>Create / delete account</li>
								<li>Log in / log out account</li>
								<li>Toggle night mode</li>
								<li>Browse different subfakeddits</li>
								<li>Create / delete posts & comments</li>
								<li>Upvote / downvote posts & comments</li>
								<li>Collapse comments</li>
								<li>Sort posts / comments</li>
								<li>Filter posts by flairs</li>
								<li>Search posts</li>
							</ul>
						</div>
					</div>
					<div className="home-sidebar-section">
						<div className="home-sidebar-section-header">Technologies</div>
						<div className="home-sidebar-section-content">
							<ul>
								<li>React</li>
								<li>Firebase</li>
								<li>JavaScript</li>
								<li>HTML</li>
								<li>CSS</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Home;