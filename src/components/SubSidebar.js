import React from "react";
import { Link } from "react-router-dom";
import secondsToDate from "../functions/secondsToDate";
import formatNumber from "../functions/formatNumber";
import "../styles/SubSidebar.css";

const SubSidebar = ({ user, slug, subreddit, colors, activeFlairs, pickFlair, postPage, nightMode }) => {
    const { description, members, color, flairs, created } = subreddit;

    return (
        <div className={!nightMode ? "subreddit-sidebar" : "subreddit-sidebar subreddit-sidebar-dark"}>
            <div className="subreddit-sidebar-section">
                <div className="subreddit-sidebar-section-header" style={
                    color ? {
                        background: colors[color],
                        color: 'rgb(255, 255, 255)' 
                    } : null
                }>
                    About Community
                </div>
                <div className="subreddit-sidebar-section-content">
                    <div className="subreddit-sidebar-section-content-description">
                        {description}
                    </div>
                    <div className="subreddit-sidebar-section-content-members">
                        <div className="subreddit-sidebar-section-content-members-section">
                            <span className="subreddit-sidebar-section-content-members-number">{formatNumber(members)}</span><br />Members
                        </div>
                        <div className="subreddit-sidebar-section-content-members-section">
                            <span className="subreddit-sidebar-section-content-members-number">0</span><br />Online
                        </div>
                    </div>
                    <div className="subreddit-sidebar-section-content-created">
                        Created {secondsToDate(created.seconds)}
                    </div>
                    {user ?
                        <div className="subreddit-sidebar-section-create">
                            {/* Pass flairs as a state to Submit page */}
                            <Link to="submit" state={flairs}>
                                <div className="subreddit-sidebar-section-create-btn" style={
                                    color ? {
                                        background: colors[color],
                                        color: 'rgb(255, 255, 255)'
                                    } : null
                                }>
                                    Create Post
                                </div>
                            </Link>
                        </div>
                    : null}
                </div>
            </div>
            <div className="subreddit-sidebar-section">
                <div className="subreddit-sidebar-section-header" style={
                    color ? {
                        background: colors[color],
                        color: 'rgb(255, 255, 255)' 
                    } : null
                }>
                    Filter by Flair
                </div>
                <div className="subreddit-sidebar-section-flairs">
                    {flairs.map((flair, i) => {
                        return (
                            <div key={i} className={`subreddit-sidebar-section-flair
                                ${activeFlairs.includes(flair) ? `subreddit-sidebar-section-flair-active` : null}`}
                                onClick={() => {pickFlair(flair)}}>
                                {postPage ?
                                    <Link to={`/r/${slug}`}>{flair}</Link>
                                : flair}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default SubSidebar;