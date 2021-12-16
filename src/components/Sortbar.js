import React, { useState } from "react";
import "../styles/Sortbar.css";

const Sortbar = ({posts, setPosts}) => {
    const [sortType, setSortType] = useState('hot');

    // Sort by date (desc)
    const sortByDate = (array) => {
        array.sort((a, b) => {
            return b.date - a.date;
        });
    };

    // Sort by votes (desc)
    const sortByVotes = (array) => {
        array.sort((a, b) => {
            return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
        });
    };

    const sort = (type) => {
        let postsArray = posts.slice();

        if (type === 'hot') {
            /* Sort posts array by date (desc),
            split by recent posts (last 24 hrs),
            then sort recent posts by votes (desc) */
            sortByDate(postsArray);

            const date = new Date();
            const array1 = [];
            const array2 = [];
            postsArray.forEach((p) => {
                const deltaSeconds = (date.getTime() / 1000) - p.date.seconds;
                const deltaHours = deltaSeconds / 60 / 60;
                deltaHours <= 24 ? array1.push(p) : array2.push(p);
            });

            sortByVotes(array1);
            postsArray = (array1.concat(array2)).slice();
            setSortType('hot');
        } else if (type === 'new') {
            sortByDate(postsArray);
            setSortType('new');
        } else if (type === 'top') {
            sortByVotes(postsArray);
            setSortType('top');
        }

        setPosts(postsArray);
    };

    return (
        <div className="sortbar">
            <div className={`sortbar-btn ${sortType === 'hot' ? `sortbar-btn-active` : ''}`} onClick={() => {
                if (sortType !== 'hot') {
                    sort('hot');
                }
            }}>Hot</div>
            <div className={`sortbar-btn ${sortType === 'new' ? `sortbar-btn-active` : ''}`} onClick={() => {
                if (sortType !== 'new') {
                    sort('new');
                }
            }}>New</div>
            <div className={`sortbar-btn ${sortType === 'top' ? `sortbar-btn-active` : ''}`} onClick={() => {
                if (sortType !== 'top') {
                    sort('top');
                }
            }}>Top</div>
        </div>
    );
}

export default Sortbar;