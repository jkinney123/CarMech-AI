import React from 'react';

function IntroHeader({ headerPhase }) {
    let headerText = '';
    let headerText2 = '';
    let headerText3 = '';
    switch (headerPhase) {
        case 0:
            headerText = 'Welcome to CarMech AI';
            break;
        case 1:
            headerText2 = 'Please provide your car make, model, and year for tailored assistance.';
            break;
        case 2:
            headerText3 = 'Please describe your car issue in detail.';
            break;
        default:
            headerText = 'Welcome to CarMech AI';
    }

    return (
        <div className="intro-header">
            <h1>{headerText}</h1>
            <h3>{headerText2}</h3>
            <h3>{headerText3}</h3>
        </div>
    );
}

export default IntroHeader;