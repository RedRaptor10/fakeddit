import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import PostBox from "./PostBox";
import Reply from "./Reply";
import Comments from "./Comments";
import SubSidebar from "./SubSidebar";
import { SubredditContext } from "./subredditContext";
import formatNumber from "../functions/formatNumber";
import "../styles/Post.css";

const Post = ({user, setUser}) => {
    const { slug, postId } = useParams(); // Get post id from url
    const [post, setPost] = useState({
        id: '',
        author: '',
        comments: 0,
        date: '',
        downvotes: 0,
        flairs: [],
        postSubreddit: slug,
        text: '',
        title: '',
        upvotes: 0
    });
    const { downvotes, title, upvotes } = post;
    const { subreddit, colors, posts, setPosts, activeFlairs, pickFlair } = React.useContext(SubredditContext); // Get props from parent Subreddit component

    // Get Post from database on componentDidMount & componentDidUpdate
    useEffect(() => {
        const getPost = async () => {
			const db = getFirestore();
			const docRef = doc(db, "posts", postId);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
                // Return post data along with post id
				return {
                    ...docSnap.data(),
                    id: docSnap.id
                };
			} else {
				return null;
			}
        };

        // Get Post data from Promise
        getPost()
        .then((p) => {
            setPost(p);
        })
        .catch((error) => {
            console.log(error);
        });

        // Disable scroll on parent Subreddit
        document.body.classList.add("no-scroll");
        // Re-enable scroll on componentDidUnmount
        return () => {
            document.body.classList.remove("no-scroll");
        };
    }, [slug, postId]);

    return (
        <div className="post">
            <Link to={`/r/${slug}`}>
                <div className="canvas post-canvas" />
            </Link>
            <div className="post-main">
                <div className="post-header">
                    <div className="post-header-inner">
                        {/* Optional Header Votes
                        <div className="post-votes-container">
                            <div className="post-upvote-btn" />
                            {formatNumber(upvotes)}
                            <div className="post-downvote-btn" />
                            {formatNumber(downvotes)}
                        </div>
                        */}
                        <div className="post-title">
                            {title}
                        </div>
                        <Link to={`/r/${slug}`} className="post-close-btn-container">
                            <div className="post-close-btn">
                                Close
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="post-body">
                    <div className="post-content-container">
                        <PostBox user={user} setUser={setUser} post={post} setPost={setPost} posts={posts} setPosts={setPosts}
                            activeFlairs={activeFlairs} pickFlair={pickFlair} postPage={true} />
                        <Reply user={user} post={post} setPost={setPost} parent='' />
                        <Comments user={user} setUser={setUser} post={post} setPost={setPost} />
                    </div>
                    <SubSidebar user={user} slug={slug} subreddit={subreddit} colors={colors} activeFlairs={activeFlairs} pickFlair={pickFlair} postPage={true} />
                </div>
            </div>
        </div>
    );
}

export default Post;