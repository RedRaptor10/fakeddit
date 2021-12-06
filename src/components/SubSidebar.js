import React from "react";
import secondsToDate from "../functions/secondsToDate";
import formatNumber from "../functions/formatNumber";
import "../styles/SubSidebar.css";

const SubSidebar = ({ subreddit, colors }) => {
    const { description, members, color, flairs, created } = subreddit;

    return (
        <div className="subreddit-sidebar">
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
                            <div key={i} className="subreddit-sidebar-section-flair">{flair}</div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default SubSidebar;