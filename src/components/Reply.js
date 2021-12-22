import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, addDoc, collection, doc, updateDoc } from "firebase/firestore";
import LogIn from "./LogIn";
import "../styles/Reply.css";

const Reply = ({user, post, setPost, parent, nightMode}) => {
    const { slug } = useParams(); // Get subreddit slug from url
    const [reply, setReply] = useState('');
    const [error, setError] = useState('');
    const [logInForm, setLogInForm] = useState(false);
	const [signUpForm, setSignUpForm] = useState(false);

    // Dynamically change state from reply input
	const handleReply = event => {
		setReply(event.target.value);
    };

    const submitReply = async () => {
        if (reply !== '') {
			const db = getFirestore();
			await addDoc(collection(db, "comments"), {
				author: user.username,
				date: new Date(),
                downvotes: 0,
                parentId: parent,
                postId: post.id,
                replies: [],
                subreddit: slug,
				text: reply,
				upvotes: 1
			})
			.then(() => {
                // Clear reply input
                const replyInputs = document.querySelectorAll('.reply-input');
                replyInputs.forEach((replyInput) => {
                    replyInput.value = '';
                });
                setReply('');
                setError('');
            })
            .then(() => {
                // Increment comment count in database
                const postRef = doc(db, "posts", post.id);
                (async () => {
                    await updateDoc(postRef, {
                        comments: post.comments + 1
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                })();

                // Increment comment count in post object
                setPost(
                    {
                        ...post,
                        comments: post.comments + 1
                    }
                );
            });
		} else {
			setError('All fields required.');
		}
    };

    return (
        <div className={!nightMode ? "reply" : "reply reply-dark"}>
            {user ?
                <div className={`reply-form ${parent === '' ? `reply-form-post` : ''}`}>
                    <textarea className="reply-input" placeholder="Comment on this post" onChange={handleReply} />
                    {error !== '' ?
                        <div className="error-msg">{error}</div>
                    : null}
                    <button className="reply-submit-btn" onClick={submitReply}>Reply</button>
                </div>
            :
            <div>
                <span>Log in or Sign up to leave a comment</span>
                <button className="login-btn" onClick={() => {setLogInForm(true)}}>Log In</button>
				<button className="signup-btn" onClick={() => {setSignUpForm(true)}}>Sign Up</button>
            </div>}
            {logInForm ?
				<LogIn setLogInForm={setLogInForm} setSignUpForm={setSignUpForm} logIn={true} nightMode={nightMode} />
			: null}
			{signUpForm ?
				<LogIn setLogInForm={setLogInForm} setSignUpForm={setSignUpForm} logIn={false} nightMode={nightMode} />
			: null}
        </div>
    );
}

export default Reply;