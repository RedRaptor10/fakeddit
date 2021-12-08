import React, { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const Submit = ({loggedIn, user}) => {
	const { slug } = useParams(); // Get subreddit slug from url
	const [title, setTitle] = useState('');
	const [text, setText] = useState('');
	const [submitted, setSubmitted] = useState(false);

	// Dynamically change state from title input
	const handleTitle = event => {
		setTitle(event.target.value);
	};

	// Dynamically change state from title input
	const handleText = event => {
		setText(event.target.value);
	};

	const submitPost = async (title, text) => {
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

	const setError = message => {
        let errorMsg = document.querySelector('.error-msg');
        if (!errorMsg) {
            const submitBtn = document.querySelector('.post-submit-btn');
            errorMsg = document.createElement('div');
            errorMsg.classList.add('error-msg');
            submitBtn.parentNode.insertBefore(errorMsg, submitBtn);
        }

        errorMsg.innerHTML = message;
    };

	return (
		<div className="submit">
			{loggedIn ?
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
					<button className="post-submit-btn" onClick={() => { submitPost(title, text) }}>Post</button>
				</div>
			: null}
		</div>
	);
}

export default Submit;