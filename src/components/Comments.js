import React, { useState, useEffect } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import Comment from "./Comment";
import "../styles/Comments.css";

const Comments = ({loggedIn, user, post, setPost}) => {
    const [comments, setComments] = useState([]);

	// Get comments from database on componentDidMount & componentDidUpdate
	useEffect(() => {
        let allComments = [];

		const getComments = async () => {
				const db = getFirestore();
				const commentsRef = collection(db, "comments");
				const q = query(commentsRef, where("postId", "==", post.id));
				const querySnap = await getDocs(q);
				const commentsArray = [];

				// Add fetched comments to comments array
				querySnap.forEach(comment => {
					const commentObj = comment.data();
					commentObj.id = comment.id; // Add document id to comment object
					commentsArray.push(commentObj);
				});

				// Sort comments array by votes (desc)
				commentsArray.sort((a, b) => {
					return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
				});

                allComments = commentsArray.slice();
        };

        const nestComments = () => {
            const temp = [];

            // Get parent comments
            allComments.forEach((comment) => {
                if (comment.parentId === '') {
                    temp.push(comment);
                }
            });

            // Recursively loop through each comment and add all child comments/replies
            const addReplies = (branch) => {
                branch.forEach((comment) => {
                    // Go through all comments and check if it's a reply to current comment
                    allComments.forEach((allComment) => {
                        if (allComment.parentId === comment.id) {
                            // Create replies array for current comment, then add reply
                            if (!comment.replies) {
                                comment.replies = [];
                            }
                            comment.replies.push(allComment);
                        }
                    });

                    // If current comment has replies, recursively loop through each reply
                    if (comment.replies) {
                        addReplies(comment.replies);
                    }
                });
            };

            addReplies(temp);
            setComments(temp);
        };

        getComments()
        .then(nestComments)
        .catch((error) => {
            console.log(error);
        });
    }, [post]);

    return (
        <div className="comments">
            {comments.map((comment) => {
                return (
                    <Comment key={comment.id} loggedIn={loggedIn} user={user} comment={comment} post={post} setPost={setPost} />
                );
            })}
        </div>
    );
};

export default Comments;