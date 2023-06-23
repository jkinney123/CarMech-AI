import React from 'react';

function ExcerptBox({ isTyping }) {
    return (
        <div className="image-wrapper">
            {isTyping && <div className="thinking-bubble"></div>}
            <img className="excerpt-img" src="/AI-CarMech.png" alt="AI Car Mech" />
        </div>
    );
}

export default ExcerptBox;
