import React, { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { getFirestore, doc, updateDoc, deleteField, deleteDoc } from "firebase/firestore";
import formatNumber from "../functions/formatNumber";
import getElapsedTime from "../functions/getElapsedTime";
import "../styles/PostBox.css";

const PostBox = ({user, setUser, propSlug, post, setPost, posts, setPosts, activeFlairs, pickFlair, postPage}) => {
    let { slug } = useParams(); // Get subreddit slug from url
    if (propSlug) { slug = propSlug; } // If propSlug passed from Home component, set slug to propSlug
    const [upvoted, setUpvoted] = useState(false);
    const [downvoted, setDownvoted] = useState(false);
    const [deleted, setDeleted] = useState(false);

    // Set Upvoted & Downvoted on componentDidMount & componentDidUpdate
    useEffect(() => {
        if (user && user.upvoted.includes(post.id)) {
            setUpvoted(true);
        } else  {
            setUpvoted(false);
        }

        if (user && user.downvoted.includes(post.id)) {
            setDownvoted(true);
        } else  {
            setDownvoted(false);
        }
    }, [user, post.id]);

    const vote = async (direction) => {
        const db = getFirestore();
        const postRef = doc(db, "posts", post.id);
        const userRef = doc(db, "users", user.id);

        // Clone user's upvoted/downvoted arrays
        const upvotedClone = user.upvoted.slice();
        const downvotedClone = user.downvoted.slice();

        // If not already upvoted/downvoted, add post id to user's upvoted/downvoted array
        if (direction === 'up' && !upvoted) {
            upvotedClone.push(post.id);
        } else if (direction === 'down' && !downvoted) {
            downvotedClone.push(post.id);
        }

        // If already upvoted/downvoted, remove post id from user's upvoted/downvoted array
        if (upvoted) {
            const index = user.upvoted.indexOf(post.id);
            upvotedClone.splice(index, 1);
        } else if (downvoted) {
            const index = user.downvoted.indexOf(post.id);
            downvotedClone.splice(index, 1);
        }

        // Set user's upvoted/downvoted array
        setUser({
            ...user,
            upvoted: upvotedClone,
            downvoted: downvotedClone
        });

        // Get new upvotes/downvotes count
        let newUpvotes = post.upvotes;
        let newDownvotes = post.downvotes;
        if (direction === 'up') {
            upvoted ? newUpvotes-- : newUpvotes++;
            if (downvoted) {
                newDownvotes--;
            }
        } else {
            downvoted ? newDownvotes-- : newDownvotes++;
            if (upvoted) {
                newUpvotes--;
            }
        }

        // Update database
        await updateDoc(postRef, {
            upvotes: newUpvotes,
            downvotes: newDownvotes
        });
        await updateDoc(userRef, {
            upvoted: upvotedClone,
            downvoted: downvotedClone
        });

        // Update posts state in Subreddit component
        const temp = posts.slice();
        // Find post in temp array, then update post upvotes
        temp.forEach(p => {
            if (p.id === post.id) {
                p.upvotes = newUpvotes;
                p.downvotes = newDownvotes;
            }
        });
        setPosts(temp);

        // Update post state in Post component
        if (postPage) {
            setPost({
                ...post,
                upvotes: newUpvotes,
                downvotes: newDownvotes
            });
        }
    };

    const deletePost = () => {
		const db = getFirestore();

		// Delete Fields from Document
		const deleteDocFields = async (id) => {
			const docRef = doc(db, "posts", id);
			await updateDoc(docRef, {
                author: deleteField(),
                comments: deleteField(),
				date: deleteField(),
                downvotes: deleteField(),
                subreddit: deleteField(),
                text: deleteField(),
                title: deleteField(),
                upvotes: deleteField()
			});
		};

		// Delete Document
		const deleteDocument = async (id) => {
			const docRef = doc(db, "posts", id);
			await deleteDoc(docRef);
		};

		// Delete Post
        deleteDocFields(post.id)
        .then(() => { deleteDocument(post.id); })
        .then(() => { setDeleted(true); })
        .catch(error => {
            console.log(error);
        });
	};

    return (
        <div className="post-box-container">
            { deleted ?
				<Navigate to={`/`} />
            :
            <div className="post-box">
                <div className="post-box-votes-container">
                    <div className={`post-box-upvote-btn ${user && upvoted ? `post-box-upvoted` : ''}`} onClick={
                        user ? () => {
                            vote('up');
                        } : null
                    } />
                    <div className="post-box-votes">{formatNumber(post.upvotes - post.downvotes)}</div>
                    <div className={`post-box-downvote-btn ${user && downvoted ? `post-box-downvoted` : ''}`} onClick={
                        user ? () => {
                            vote('down');
                        } : null
                    } />
                </div>
                <div className="post-box-details">
                    <div className="post-box-meta">
                        {propSlug ?
                            <Link to={`/r/${propSlug}`} className="post-box-subreddit">r/{propSlug}</Link>
                        : null}
                        <span className="post-box-author">Posted by&nbsp;
                            <span className={user && post.author === user.username ? 'post-box-author-user' : ''}>u/{post.author}</span>
                        </span>
                        <span className="post-box-date">{getElapsedTime(post.date.seconds)}</span>
                    </div>
                    <div className="post-box-title">
                        {activeFlairs ? post.flairs.map((flair, i) => {
                            return (
                                <div key={i} className={`post-box-flair ${activeFlairs.includes(flair) ? `post-box-flair-active` : null}`}
                                    onClick={() => {pickFlair(flair)}}>
                                    {postPage ?
                                        <Link to={`/r/${slug}`}>{flair}</Link>
                                    : flair}
                                </div>
                            );
                        })
                        : null}
                        <h3>
                            <Link to={`/r/${slug}/comments/${post.id}/${post.title}`}>{post.title}</Link>
                        </h3>
                    </div>
                    <div className="post-box-text">{post.text}</div>
                    <div className="post-box-btns-container">
                        <Link to={`/r/${slug}/comments/${post.id}/${post.title}`} className="post-box-btn">
                            {post.comments} {post.comments === 1 ? 'comment' : 'comments'}</Link>
                        {user && post.author === user.username ?
                            <div className="post-box-btn" onClick={deletePost}>Delete</div>
                        : null}
                    </div>
                </div>
            </div>
            }
        </div>
    );
};

export default PostBox;