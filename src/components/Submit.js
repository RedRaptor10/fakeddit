import React, { useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import "../styles/Submit.css";

const Submit = ({user, nightMode}) => {
	const { slug } = useParams(); // Get subreddit slug from url
	const [title, setTitle] = useState('');
	const [text, setText] = useState('');
	const location = useLocation(); // Get location object to be used for flairs
	const [activeFlairs, setActiveFlairs] = useState([]);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	// Dynamically change state from title input
	const handleTitle = event => {
		setTitle(event.target.value);
	};

	// Dynamically change state from title input
	const handleText = event => {
		setText(event.target.value);
	};

	const pickFlair = event => {
		const flair = event.target.innerHTML;
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

	const submitPost = async () => {
		if (title !== '' && text !== '') {
			const db = getFirestore();
			await addDoc(collection(db, "posts"), {
				author: user.username,
				comments: 0,
				date: new Date(),
				downvotes: 0,
				flairs: activeFlairs,
				subreddit: slug,
				text: text,
				title: title,
				upvotes: 1
			})
			.then(() => {
				navigate("/r/" + slug);
			});
		} else {
			setError('All fields required.');
		}
	};

	return (
		user && location.state ?
			<div className={!nightMode ? "submit" : "submit submit-dark"}>
				<h3>Create a post</h3>
				<div className="submit-subreddit">
					Subfakeddit: <Link to={`/r/${slug}`}>r/{slug}</Link>
				</div>
				<div className="submit-title">
					<div className="submit-label">Title</div>
					<input type="text" placeholder="My first post" onChange={handleTitle} />
				</div>
				<div className="submit-text">
					<div className="submit-label">Text</div>
					<textarea onChange={handleText} />
				</div>
				{error !== '' ?
					<div className="error-msg">{error}</div>
				: null}
				<div className="submit-flairs-container">
					<div className="submit-label">Flairs</div>
					<div className="submit-flairs">
						{location.state.map((flair, i) => {
							return (
								<div key={i} className={`submit-flair ${activeFlairs.includes(flair) ? `submit-flair-active` : null}`}
								onClick={pickFlair}>{flair}</div>
							);
						})}
					</div>
				</div>
				<button className="submit-btn" onClick={submitPost}>Post</button>
			</div>
		: null
	);
}

export default Submit;