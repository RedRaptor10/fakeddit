import React, { useState } from "react";
import "../styles/Sortbar.css";

const Sortbar = ({posts, setPosts, comments, setComments}) => {
    const [sortTypePosts, setSortTypePosts] = useState('hot');
    const [sortTypeComments, setSortTypeComments] = useState('best');
    const [dropdown, setDropdown] = useState(false);

    /* Sort by hot
    Sort by date (desc), split between recent (last 24 hrs) and old,
    then sort recent by top (desc) */
    const sortByHot = (array) => {
        sortByDateNew(array);

        const date = new Date();
        const array1 = [];
        const array2 = [];
        array.forEach((p) => {
            const deltaSeconds = (date.getTime() / 1000) - p.date.seconds;
            const deltaHours = deltaSeconds / 60 / 60;
            deltaHours <= 24 ? array1.push(p) : array2.push(p);
        });

        sortByTop(array1);
        array = (array1.concat(array2)).slice();
    };

    // Sort by best (upvotes / downvotes) (desc)
    const sortByBest = (array) => {
        array.sort((a, b) => {
            // Check for zero divisor
            let resultA = (a.downvotes === 0) ? a.upvotes : a.upvotes / a.downvotes;
            let resultB = (b.downvotes === 0) ? b.upvotes : b.upvotes / b.downvotes;

            return resultB - resultA;
        });
    };

    // Sort by top (votes) (desc)
    const sortByTop = (array) => {
        array.sort((a, b) => {
            return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
        });
    };

    // Sort by date (desc)
    const sortByDateNew = (array) => {
        array.sort((a, b) => {
            return b.date - a.date;
        });
    };

    // Sort by date (asc)
    const sortByDateOld = (array) => {
        array.sort((a, b) => {
            return a.date - b.date;
        });
    };

    // Sort by controversial (desc)
    const sortByControversial = (array) => {
        array.forEach((comment) => {
            let totalReplies = comment.replies.length;

            if (comment.replies > 0) {
                const loopReplies = (branch) => {
                    branch.forEach((reply) => {
                        totalReplies++;

                        // If current comment has replies, recursively loop through each reply
                        if (reply.replies.length > 0) {
                            loopReplies(reply.replies);
                        }
                    });
                };

                loopReplies(comment.replies);
            }

            // Temporarily add totalReplies property to comment
            comment.totalReplies = totalReplies;
        });

        // Sort by totalReplies
        array.sort((a, b) => {
            return b.totalReplies - a.totalReplies;
        });

        // Delete totalReplies property from comments
        array.forEach((comment) => {
            delete comment.totalReplies;
        });
    };

    const sort = (type) => {
        let postsArray;
        postsArray = posts ? posts.slice() : comments.slice();

        if (type === 'hot') {
            sortByHot(postsArray);
            posts ? setSortTypePosts('hot') : setSortTypeComments('hot');
        } else if (type === 'best'){
            sortByBest(postsArray);
            posts ? setSortTypePosts('best') : setSortTypeComments('best');
        } else if (type === 'top') {
            sortByTop(postsArray);
            posts ? setSortTypePosts('top') : setSortTypeComments('top');
        } else if (type === 'new') {
            sortByDateNew(postsArray);
            posts ? setSortTypePosts('new') : setSortTypeComments('new');
        } else if (type === 'old') {
            sortByDateOld(postsArray);
            posts ? setSortTypePosts('old') : setSortTypeComments('old');
        } else if (type === 'controversial') {
            if (comments) {
                sortByControversial(postsArray);
                posts ? setSortTypePosts('controversial') : setSortTypeComments('controversial');
            }
        }

        posts ? setPosts(postsArray) : setComments(postsArray);
    };

    return (
        <div className="sortbar">
        { posts ?
            <div className="sortbar-posts">
                <div className={`sortbar-btn ${sortTypePosts === 'hot' ? `sortbar-btn-active` : ''}`} onClick={() => {
                    if (sortTypePosts !== 'hot') {
                        sort('hot');
                    }
                }}>Hot</div>
                <div className={`sortbar-btn ${sortTypePosts === 'best' ? `sortbar-btn-active` : ''}`} onClick={() => {
                    if (sortTypePosts !== 'best') {
                        sort('best');
                    }
                }}>Best</div>
                <div className={`sortbar-btn ${sortTypePosts === 'top' ? `sortbar-btn-active` : ''}`} onClick={() => {
                    if (sortTypePosts !== 'top') {
                        sort('top');
                    }
                }}>Top</div>
                <div className={`sortbar-btn ${sortTypePosts === 'new' ? `sortbar-btn-active` : ''}`} onClick={() => {
                    if (sortTypePosts !== 'new') {
                        sort('new');
                    }
                }}>New</div>
                <div className={`sortbar-btn ${sortTypePosts === 'old' ? `sortbar-btn-active` : ''}`} onClick={() => {
                    if (sortTypePosts !== 'old') {
                        sort('old');
                    }
                }}>Old</div>
            </div>
        :
            <div className="sortbar-comments">
                <div className="sortbar-comments-btn" onClick={() => { dropdown ? setDropdown(false) : setDropdown(true) }}>
                    {sortTypeComments === 'best' ? <div>Sort By: Best</div> : null}
                    {sortTypeComments === 'hot' ? <div>Sort By: Hot</div> : null}
                    {sortTypeComments === 'top' ? <div>Sort By: Top</div> : null}
                    {sortTypeComments === 'new' ? <div>Sort By: New</div> : null}
                    {sortTypeComments === 'old' ? <div>Sort By: Old</div> : null}
                    {sortTypeComments === 'controversial' ? <div>Sort By: Controversial</div> : null}
                    {dropdown ?
                    <div className="sortbar-comments-dropdown">
                        <div className="sortbar-comments-dropdown-item" onClick={() => {
                            if (sortTypeComments !== 'best') {
                                sort('best');
                            }
                        }}>Best</div>
                        <div className="sortbar-comments-dropdown-item" onClick={() => {
                            if (sortTypeComments !== 'hot') {
                                sort('hot');
                            }
                        }}>Hot</div>
                        <div className="sortbar-comments-dropdown-item" onClick={() => {
                            if (sortTypeComments !== 'top') {
                                sort('top');
                            }
                        }}>Top</div>
                        <div className="sortbar-comments-dropdown-item" onClick={() => {
                            if (sortTypeComments !== 'new') {
                                sort('new');
                            }
                        }}>New</div>
                        <div className="sortbar-comments-dropdown-item" onClick={() => {
                            if (sortTypeComments !== 'old') {
                                sort('old');
                            }
                        }}>Old</div>
                        <div className="sortbar-comments-dropdown-item" onClick={() => {
                            if (sortTypeComments !== 'controversial') {
                                sort('controversial');
                            }
                        }}>Controversial</div>
                    </div>
                    : null}
                </div>
            </div>
        }
        </div>
    );
}

export default Sortbar;