import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import getElapsedTime from "../functions/getElapsedTime";
import formatNumber from "../functions/formatNumber";
import "../styles/Search.css";

const Search = ({nightMode}) => {
    const { searchQuery } = useParams(); // Get search query from url
    const [posts, setPosts] = useState([]);

    // Get posts where title contains search query on componentDidMount & componentDidUpdate
    useEffect(() => {
        const getPosts = async () => {
            const db = getFirestore();
            /* To search with prefixes, add '\uf8ff', which is a high code point in Unicode that comes after every character.
                This allows the query to match all values that start with searchQuery. */
            const q = query(collection(db, "posts"), where("title", ">=", searchQuery), where ("title", "<=", searchQuery + "\uf8ff"));
            const querySnapshot = await getDocs(q);
            const temp = [];

            querySnapshot.forEach((doc) => {
                // Push post data along with post id to array
                temp.push({
                    ...doc.data(),
                    id: doc.id
                });
            });

            setPosts(temp);
        };

        getPosts();
    }, [searchQuery]);

    return (
        <main className={!nightMode ? 'search' : 'search dark'}>
            <div className="search-results">
                {posts.map((post, i) => {
                    return (
                        <div key={i} className="search-result">
                            <div className="search-result-meta">
                                <span className="search-result-subreddit"><Link to={`/r/${post.subreddit}`}>r/{post.subreddit}</Link></span>
                                <span className="search-result-author">Posts by u/{post.author}</span>
                                <span className="search-result-date">{getElapsedTime(post.date.seconds)}</span>
                            </div>
                            <div className="search-result-title">
                                <Link to={`/r/${post.subreddit}/comments/${post.id}/${post.title}`}>{post.title}</Link>
                            </div>
                            <div className="search-result-details">
                                <span className="search-result-upvotes">{formatNumber(post.upvotes)} upvotes</span>
                                <span className="search-result-comments">{formatNumber(post.comments)} comments</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}

export default Search;