import React from 'react';

function IntroHeader({ chatStarted }) {
    return (
        <>
            {!chatStarted && (
                <div className="intro-header">
                    <h1>Welcome to CarMech AI</h1>
                </div>
            )}
            {chatStarted && (
                <div className="intro-header">
                    <h1>Please describe your issue in detail</h1>
                </div>
            )}
        </>
    );
}

export default IntroHeader;
