import React, { useState } from "react";
import formatNumber from "../functions/formatNumber";
import getElapsedTime from "../functions/getElapsedTime";

const Comment = ({comment}) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="comment-container" id={comment.id}>
            <div className={`comment-sidebar ${collapsed ? `comment-collapsed` : null }`}>
                {collapsed ?
                    <div className="comment-expand" onClick={() => { setCollapsed(false) }} />
                : null}
                <div className="comment-avatar" />
                {!collapsed ?
                    <div className="comment-threadline" onClick={() => { setCollapsed(true) }} />
                : null}
            </div>
            <div className="comment">
                <div className="comment-details">
                    <div className="comment-parent">
                        <div className="comment-meta">
                            <span className="comment-author">{comment.author}</span>
                            <span className="comment-date">{getElapsedTime(comment.date.seconds)}</span>
                        </div>
                        {!collapsed ?
                            <div className="comment-text">{comment.text}</div>
                        : null}
                    </div>
                    {!collapsed ?
                        <div className="comment-btns-container">
                            <div className="comment-votes-container">
                                <div className="comment-upvote-btn" />
                                <div className="comment-votes">
                                    {formatNumber(comment.upvotes - comment.downvotes)}
                                </div>
                                <div className="comment-downvote-btn" />
                            </div>
                        </div>
                    : null}
                </div>
                {!collapsed && comment.replies ?
                    <div className="replies">
                        {comment.replies.map((reply) => {
                            return (
                                <Comment comment={reply} key={reply.id} />
                            );
                        })}
                    </div>
                : null}
            </div>
        </div>
    );
}

export default Comment;