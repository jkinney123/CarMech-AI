import React from 'react';

function ExcerptBox({ isTyping }) {
    return (
        <div className="image-wrapper">
            {isTyping && <div className="thinking-bubble"></div>}
            <img className="excerpt-img" src="/Rusty-Wrench-AI.png" alt="Rusty Wrench" />
        </div>
    );
}

export default ExcerptBox;
