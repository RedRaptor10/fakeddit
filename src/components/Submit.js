import React, { useState } from "react";
import { useParams, Navigate, useLocation } from "react-router-dom";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const Submit = ({user}) => {
	const { slug } = useParams(); // Get subreddit slug from url
	const [title, setTitle] = useState('');
	const [text, setText] = useState('');
	const { flairs } = useLocation().state;
	const [flairsPicked, setFlairsPicked] = useState([]);
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

	const pickFlair = event => {
		const flair = event.target.innerHTML;
		const temp = flairsPicked.slice();

		// If flair already picked, remove flair, otherwise add flair
		if (flairsPicked.includes(flair)) {
			const index = flairsPicked.indexOf(flair);
			temp.splice(index, 1);
		} else {
			temp.push(event.target.innerHTML);
		}

		setFlairsPicked(temp);
	};

	const submitPost = async () => {
		if (title !== '' && text !== '') {
			const db = getFirestore();
			await addDoc(collection(db, "posts"), {
				author: user.username,
				comments: 0,
				date: new Date(),
				downvotes: 0,
				flairs: flairsPicked,
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
					{flairs.map((flair, i) => {
						return (
							<div key={i} className="flair" onClick={pickFlair}>{flair}</div>
						);
					})}
					<button className="post-submit-btn" onClick={submitPost}>Post</button>
				</div>
			: null}
		</div>
	);
}

export default Submit;