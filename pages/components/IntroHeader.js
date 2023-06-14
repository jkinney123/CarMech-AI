import React from 'react';

function IntroHeader({ chatStarted }) {
    return (
        <>
            {!chatStarted && (
                <div className="intro-header">
                    <h1>Car-MechAI</h1>
                </div>
            )}
            {chatStarted && (
                <div className="intro-header">
                    <h1>Car-MechAi</h1>
                </div>
            )}
        </>
    );
}

export default IntroHeader;
