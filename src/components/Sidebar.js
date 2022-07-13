import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import secondsToDate from "../functions/secondsToDate";
import formatNumber from "../functions/formatNumber";
import "../styles/Sidebar.css";

const Sidebar = ({ user, slug, subreddit, colors, activeFlairs, pickFlair, postPage }) => {
    const { description, members, color, flairs, created } = subreddit;

    return (
        <div className="sidebar">
            <div className="sidebar-section">
                <div className="sidebar-section-header" style={
                    color ? {
                        background: colors[color],
                        color: 'rgb(255, 255, 255)' 
                    } : null
                }>
                    About Community
                </div>
                <div className="sidebar-section-content">
                    <div className="sidebar-section-content-description">
                        {description}
                    </div>
                    <div className="sidebar-section-content-members">
                        <div className="sidebar-section-content-members-section">
                            <span className="sidebar-section-content-members-number">{formatNumber(members)}</span><br />Members
                        </div>
                        <div className="sidebar-section-content-members-section">
                            <span className="sidebar-section-content-members-number">0</span><br />Online
                        </div>
                    </div>
                    <div className="sidebar-section-content-created">
                        <FontAwesomeIcon icon={faCalendar} />
                        Created {secondsToDate(created.seconds)}
                    </div>
                    {user ?
                        <div className="sidebar-section-create">
                            {/* Pass flairs as a state to Submit page */}
                            <Link to={`/r/${slug}/submit`} state={flairs}>
                                <div className="sidebar-section-create-btn" style={
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
            <div className="sidebar-section">
                <div className="sidebar-section-header" style={
                    color ? {
                        background: colors[color],
                        color: 'rgb(255, 255, 255)' 
                    } : null
                }>
                    Filter by Flair
                </div>
                <div className="sidebar-section-flairs">
                    {flairs.map((flair, i) => {
                        return (
                            <div key={i} className={`sidebar-section-flair
                                ${activeFlairs.includes(flair) ? `sidebar-section-flair-active` : null}`}
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

export default Sidebar;