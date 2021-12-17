import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const Submit = ({user}) => {
	const { slug } = useParams(); // Get subreddit slug from url
	const [title, setTitle] = useState('');
	const [text, setText] = useState('');
	const { flairs } = useLocation().state;
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
		<div className="submit">
			{user ?
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