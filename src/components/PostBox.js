import React from "react";
import { useParams, Link } from "react-router-dom";
import formatNumber from "../functions/formatNumber";
import getElapsedTime from "../functions/getElapsedTime";
import "../styles/PostBox.css";

const PostBox = ({post}) => {
    const { slug } = useParams(); // Get subreddit slug from url

    return (
        <div className="post-box">
            <div className="post-box-votes-container">
                <div className="post-box-upvote-btn" />
                <div className="post-box-votes">
                    {formatNumber(post.upvotes - post.downvotes)}
                </div>
                <div className="post-box-downvote-btn" />
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