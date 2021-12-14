import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import formatNumber from "../functions/formatNumber";
import getElapsedTime from "../functions/getElapsedTime";
import "../styles/PostBox.css";

const PostBox = ({user, setUser, post, setPost, posts, setPosts}) => {
    const { slug } = useParams(); // Get subreddit slug from url
    const [upvoted, setUpvoted] = useState(false);
    const [downvoted, setDownvoted] = useState(false);

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

        // Update post state in Post component
        if (setPost) {
            setPost({
                ...post,
                upvotes: newUpvotes,
                downvotes: newDownvotes
            });
        }

        // Update posts state in Subreddit component
        else if (setPosts) {
            const temp = posts.slice();
            // Find post in temp array, then update post upvotes
            temp.forEach((p) => {
                if (p.id === post.id) {
                    p.upvotes = newUpvotes;
                    p.downvotes = newDownvotes;
                }
            });

            setPosts(temp);
        }
    };

    return (
        <div className="post-box">
            <div className="post-box-votes-container">
                <div className={`post-box-upvote-btn ${user && upvoted ? `post-box-upvoted` : ''}`} onClick={
                    user ? () => {
                        vote('up');
                    } : null
                } />
                <div className="post-box-votes">
                    {formatNumber(post.upvotes - post.downvotes)}
                </div>
                <div className={`post-box-downvote-btn ${user && downvoted ? `post-box-downvoted` : ''}`} onClick={
                    user ? () => {
                        vote('down');
                    } : null
                } />
            </div>
            <div className="post-box-details">
                <div className="post-box-meta">
                    <span className="post-box-author">Posted by u/{post.author}</span>
                    <span className="post-box-date">{getElapsedTime(post.date.seconds)}</span>
                </div>
                <div className="post-box-title">
                    <h3>{post.title}</h3>
                </div>
                <div className="post-box-link">
                    <a href={post.link}>{post.link}</a>
                </div>
                <div className="post-box-text">
                    {post.text}
                </div>
                <div className="post-box-btns-container">
                    <Link to={`/r/${slug}/comments/${post.id}/${post.title}`} className="post-box-btn">
                        {post.comments} comments
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PostBox;