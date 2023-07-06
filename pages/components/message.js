import React from 'react';

function Message({ message, sender, className }) {
    return (
        <div className={`message ${sender} ${className}`}>
            {sender === 'ai' && className === 'initial-message' ? (
                <div style={{ display: 'flex', alignItems: 'center', maxWidth: '100%', flexShrink: 0 }}>
                    <p className="message-content" style={{ marginLeft: '20px' }}>{message}</p>
                </div>
            ) : sender === 'ai' && className === 'typing-message' ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="typing-text">{message}</span>
                </div>
            ) : (
                <p className="message-content">{message}</p>
            )}
        </div>
    );
}

export default Message;

