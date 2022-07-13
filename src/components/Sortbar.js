import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faArrowUpFromWaterPump, faArrowUpFromGroundWater, faSun, faCloudSun } from "@fortawesome/free-solid-svg-icons";
import { sortByHot, sortByBest, sortByTop, sortByDateNew, sortByDateOld, sortByControversial } from "../functions/sorts";
import "../styles/Sortbar.css";

const Sortbar = ({posts, setPosts, comments, setComments}) => {
    const [sortTypePosts, setSortTypePosts] = useState('hot');
    const [sortTypeComments, setSortTypeComments] = useState('best');
    const [dropdown, setDropdown] = useState(false);

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
                }}><FontAwesomeIcon icon={faFire} />Hot</div>
                <div className={`sortbar-btn ${sortTypePosts === 'best' ? `sortbar-btn-active` : ''}`} onClick={() => {
                    if (sortTypePosts !== 'best') {
                        sort('best');
                    }
                }}><FontAwesomeIcon icon={faArrowUpFromWaterPump} />Best</div>
                <div className={`sortbar-btn ${sortTypePosts === 'top' ? `sortbar-btn-active` : ''}`} onClick={() => {
                    if (sortTypePosts !== 'top') {
                        sort('top');
                    }
                }}><FontAwesomeIcon icon={faArrowUpFromGroundWater} />Top</div>
                <div className={`sortbar-btn ${sortTypePosts === 'new' ? `sortbar-btn-active` : ''}`} onClick={() => {
                    if (sortTypePosts !== 'new') {
                        sort('new');
                    }
                }}><FontAwesomeIcon icon={faSun} />New</div>
                <div className={`sortbar-btn ${sortTypePosts === 'old' ? `sortbar-btn-active` : ''}`} onClick={() => {
                    if (sortTypePosts !== 'old') {
                        sort('old');
                    }
                }}><FontAwesomeIcon icon={faCloudSun} />Old</div>
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