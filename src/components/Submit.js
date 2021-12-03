import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const Submit = () => {
	const { slug } = useParams(); // Get subreddit slug from url
	const [title, setTitle] = useState('');
	const [text, setText] = useState('');

	// Dynamically change state from title input
	const handleTitle = event => {
		setTitle(event.target.value);
	};

	// Dynamically change state from title input
	const handleText = event => {
		setText(event.target.value);
	};

	const submitPost = async (title, text) => {
		const db = getFirestore();
		await addDoc(collection(db, "posts"), {
			author: 'author',
			comments: 0,
			date: new Date(),
			downvotes: 0,
			link: '',
			subreddit: slug,
			text: text,
			title: title,
			upvotes: 1
		});
	};

	return (
		<div className="submit">
			<h3>Create a post</h3>
			<div>r/{slug}</div>
			<div>
				<input type="text" placeholder="My first post" onChange={handleTitle} />
			</div>
			<div>
				<textarea onChange={handleText} />
			</div>
			<button onClick={() => { submitPost(title, text) }}>Post</button>
		</div>
	);
}

export default Submit;