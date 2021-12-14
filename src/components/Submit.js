import React, { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const Submit = ({user}) => {
	const { slug } = useParams(); // Get subreddit slug from url
	const [title, setTitle] = useState('');
	const [text, setText] = useState('');
	const [submitted, setSubmitted] = useState(false);
	const [error, setError] = useState('');

	// Dynamically change state from title input
	const handleTitle = event => {
		setTitle(event.target.value);
	};

	// Dynamically change state from title input
	const handleText = event => {
		setText(event.target.value);
	};

	const submitPost = async () => {
		if (title !== '' && text !== '') {
			const db = getFirestore();
			await addDoc(collection(db, "posts"), {
				author: user.username,
				comments: 0,
				date: new Date(),
				downvotes: 0,
				link: '',
				subreddit: slug,
				text: text,
				title: title,
				upvotes: 1
			})
			.then(() => {
				setSubmitted(true);
			});
		} else {
			setError('All fields required.');
		}
	};

	return (
		<div className="submit">
			{user ?
				submitted ?
					<Navigate to={`/r/${slug}`} />
				:
				<div>
					<h3>Create a post</h3>
					<div>r/{slug}</div>
					<div>
						<input type="text" placeholder="My first post" onChange={handleTitle} />
					</div>
					<div>
						<textarea onChange={handleText} />
					</div>
					{error !== '' ?
                        <div className="error-msg">{error}</div>
                    : null}
					<button className="post-submit-btn" onClick={submitPost}>Post</button>
				</div>
			: null}
		</div>
	);
}

export default Submit;