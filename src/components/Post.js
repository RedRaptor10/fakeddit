import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import PostBox from "./PostBox";
import Reply from "./Reply";
import Comments from "./Comments";
import SubSidebar from "./SubSidebar";
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

    // (NOTE: Props redefined because cannot pass props through Outlet in React v6)
    const [subreddit, setSubreddit] = useState({
		title: '',
		banner: '',
		icon: '',
		members: 0,
		color: '',
		flairs: [],
		description: '',
		created: 0
    });
    const colors = {
		LightBlue: 'rgb(0, 121, 211)'
	};

    // Get Post from database on componentDidMount & componentDidUpdate
    useEffect(() => {
        const getPost = async () => {
			const db = getFirestore();
			const docRef = doc(db, "posts", postId);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
                const postObj = docSnap.data();
				postObj.id = docSnap.id; // Add document id to post object
				return postObj;
			} else {
				return null;
			}
        };

        const getSubreddit = async () => {
			const db = getFirestore();
			const docRef = doc(db, "subreddits", slug);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				return docSnap.data();
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

        // Get Subreddit data from Promise
		getSubreddit()
		.then(data => {
			setSubreddit(data);
		})
		.catch((error) => {
			console.log(error);
		});
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
                        <PostBox user={user} setUser={setUser} post={post} setPost={setPost} />
                        <Reply user={user} post={post} setPost={setPost} parent='' />
                        <Comments user={user} setUser={setUser} post={post} setPost={setPost} />
                    </div>
                    <SubSidebar user={user} subreddit={subreddit} colors={colors} />
                </div>
            </div>
        </div>
    );
}

export default Post;