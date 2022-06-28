import React, { useState, useEffect } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import Sortbar from "./Sortbar";
import Comment from "./Comment";
import "../styles/Comments.css";

const Comments = ({user, setUser, post, setPost, nightMode}) => {
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
					// Push comment data along with comment id to array
                    commentsArray.push({
                        ...comment.data(),
                        id: comment.id
                    });
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
            const addReplies = branch => {
                branch.forEach(comment => {
                    // Go through all comments and check if it's a reply to current comment
                    allComments.forEach(allComment => {
                        if (allComment.parentId === comment.id) {
                            // Add reply to replies array
                            comment.replies.push(allComment);
                        }
                    });

                    // If current comment has replies, recursively loop through each reply
                    if (comment.replies.length > 0) {
                        addReplies(comment.replies);
                    }
                });
            };

            addReplies(temp);
            setComments(temp);
        };

        getComments()
        .then(nestComments)
        .catch(error => {
            console.log(error);
        });
    }, [post]);

    return (
        <div className="comments">
            <Sortbar comments={comments} setComments={setComments} nightMode={nightMode} />
            {comments.map((comment) => {
                return (
                    <Comment key={comment.id} user={user} setUser={setUser} comment={comment} comments={comments}
                        setComments={setComments} post={post} setPost={setPost} nightMode={nightMode} />
                );
            })}
        </div>
    );
};

export default Comments;