import React, { useState } from "react";
import { getFirestore, doc, updateDoc, deleteField, deleteDoc } from "firebase/firestore";
import Reply from "./Reply";
import formatNumber from "../functions/formatNumber";
import getElapsedTime from "../functions/getElapsedTime";

const Comment = ({loggedIn, user, comment, post, setPost}) => {
    const [collapsed, setCollapsed] = useState(false);
    const [showCommentsReply, setShowCommentsReply] = useState(false);

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
                                ${comment.author === user.username ? `comment-author-user` : ''}`}>
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
                                <div className="comment-upvote-btn" />
                                <div className="comment-votes">
                                    {formatNumber(comment.upvotes - comment.downvotes)}
                                </div>
                                <div className="comment-downvote-btn" />
                            </div>
                            {loggedIn ?
                                <div className="comment-btn" onClick={() => {
                                    !showCommentsReply ? setShowCommentsReply(true) : setShowCommentsReply(false)
                                }}>Reply</div>
                            :null}
                            {loggedIn && comment.author === user.username ?
                                <div className="comment-btn" onClick={deleteComment}>Delete</div>
                            : null}
                        </div>
                    : null}
                </div>
                {!collapsed && showCommentsReply ?
                    <Reply loggedIn={loggedIn} user={user} post={post} setPost={setPost} parent={comment.id} />
                : null}
                {!collapsed && comment.replies ?
                    <div className="replies">
                        {comment.replies.map((reply) => {
                            return (
                                <Comment loggedIn={loggedIn} user={user} comment={reply} post={post} setPost={setPost} key={reply.id} />
                            );
                        })}
                    </div>
                : null}
            </div>
        </div>
    );
}

export default Comment;