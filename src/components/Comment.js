import React, { useState, useEffect } from "react";
import { getFirestore, doc, updateDoc, deleteField, deleteDoc } from "firebase/firestore";
import Reply from "./Reply";
import formatNumber from "../functions/formatNumber";
import getElapsedTime from "../functions/getElapsedTime";

const Comment = ({user, setUser, comment, comments, setComments, post, setPost}) => {
    const [collapsed, setCollapsed] = useState(false);
    const [showCommentsReply, setShowCommentsReply] = useState(false);
    const [upvoted, setUpvoted] = useState(false);
    const [downvoted, setDownvoted] = useState(false);

    // Set Upvoted & Downvoted on componentDidMount & componentDidUpdate
    useEffect(() => {
        if (user && user.upvoted.includes(comment.id)) {
            setUpvoted(true);
        } else  {
            setUpvoted(false);
        }

        if (user && user.downvoted.includes(comment.id)) {
            setDownvoted(true);
        } else  {
            setDownvoted(false);
        }

    }, [user, comment.id]);

    const vote = async (direction) => {
        const db = getFirestore();
        const commentRef = doc(db, "comments", comment.id);
        const userRef = doc(db, "users", user.id);

        // Clone user's upvoted/downvoted arrays
        const upvotedClone = user.upvoted.slice();
        const downvotedClone = user.downvoted.slice();

        // If not already upvoted/downvoted, add comment id to user's upvoted/downvoted array
        if (direction === 'up' && !upvoted) {
            upvotedClone.push(comment.id);
        } else if (direction === 'down' && !downvoted) {
            downvotedClone.push(comment.id);
        }

        // If already upvoted/downvoted, remove comment id from user's upvoted/downvoted array
        if (upvoted) {
            const index = user.upvoted.indexOf(comment.id);
            upvotedClone.splice(index, 1);
        } else if (downvoted) {
            const index = user.downvoted.indexOf(comment.id);
            downvotedClone.splice(index, 1);
        }

        // Set user's upvoted/downvoted array
        setUser({
            ...user,
            upvoted: upvotedClone,
            downvoted: downvotedClone
        });

        // Get new upvotes/downvotes count
        let newUpvotes = comment.upvotes;
        let newDownvotes = comment.downvotes;
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
        await updateDoc(commentRef, {
            upvotes: newUpvotes,
            downvotes: newDownvotes
        });
        await updateDoc(userRef, {
            upvoted: upvotedClone,
            downvoted: downvotedClone
        });

        // Update comments state in Comments component
        const temp = comments.slice();
        // Find comment in temp array, then update comment upvotes
        temp.forEach((c) => {
            if (c.id === comment.id) {
                c.upvotes = newUpvotes;
                c.downvotes = newDownvotes;
            }
        });

        setComments(temp);
    };

    const deleteComment = () => {
		const db = getFirestore();

		// Delete Fields from Document
		const deleteDocFields = async (id) => {
			const docRef = doc(db, "comments", id);
			await updateDoc(docRef, {
				author: deleteField(),
				date: deleteField(),
                downvotes: deleteField(),
                parentId: deleteField(),
                postId: deleteField(),
                subreddit: deleteField(),
                text: deleteField(),
                upvotes: deleteField()
			});
		};

		// Delete Document
		const deleteDocument = async (id) => {
			const docRef = doc(db, "comments", id);
			await deleteDoc(docRef);
		};

		// Delete Comment
        deleteDocFields(comment.id)
        .then(() => { deleteDocument(comment.id) })
        .then(() => {
            // Decrement comment count in database
            const postRef = doc(db, "posts", post.id);
            (async () => {
                await updateDoc(postRef, {
                    comments: post.comments - 1
                })
                .catch((error) => {
                    console.log(error);
                });
            })();

            // Decrement comment count in post object
            setPost(
                {
                    ...post,
                    comments: post.comments - 1
                }
            );
        })
        .catch((error) => {
            console.log(error);
        });
	};

    return (
        <div className="comment-container" id={comment.id}>
            <div className={`comment-sidebar ${collapsed ? `comment-collapsed` : ''}`}>
                {collapsed ?
                    <div className="comment-expand" onClick={() => { setCollapsed(false) }} />
                : null}
                <div className="comment-avatar" />
                {!collapsed ?
                    <div className="comment-threadline" onClick={() => { setCollapsed(true) }} />
                : null}
            </div>
            <div className="comment">
                <div className="comment-details">
                    <div className="comment-parent">
                        <div className="comment-meta">
                            <span className={`comment-author
                                ${comment.author === post.author ? `comment-author-poster` : ''}
                                ${user && comment.author === user.username ? `comment-author-user` : ''}`}>
                                    {comment.author}
                            </span>
                            <span className="comment-date">{getElapsedTime(comment.date.seconds)}</span>
                        </div>
                        {!collapsed ?
                            <div className="comment-text">{comment.text}</div>
                        : null}
                    </div>
                    {!collapsed ?
                        <div className="comment-btns-container">
                            <div className="comment-votes-container">
                                <div className={`comment-upvote-btn ${user && upvoted ? `comment-upvoted` : ''}`} onClick={
                                    user ? () => {
                                        vote('up');
                                    } : null
                                } />
                                <div className="comment-votes">
                                    {formatNumber(comment.upvotes - comment.downvotes)}
                                </div>
                                <div className={`comment-downvote-btn ${user && downvoted ? `comment-downvoted` : ''}`} onClick={
                                    user ? () => {
                                        vote('down');
                                    } : null
                                } />
                            </div>
                            {user ?
                                <div className="comment-btn" onClick={() => {
                                    !showCommentsReply ? setShowCommentsReply(true) : setShowCommentsReply(false)
                                }}>Reply</div>
                            :null}
                            {user && comment.author === user.username ?
                                <div className="comment-btn" onClick={deleteComment}>Delete</div>
                            : null}
                        </div>
                    : null}
                </div>
                {!collapsed && showCommentsReply ?
                    <Reply user={user} post={post} setPost={setPost} parent={comment.id} />
                : null}
                {!collapsed && comment.replies ?
                    <div className="replies">
                        {comment.replies.map((reply) => {
                            return (
                                <Comment user={user} comment={reply} post={post} setPost={setPost} key={reply.id} />
                            );
                        })}
                    </div>
                : null}
            </div>
        </div>
    );
}

export default Comment;