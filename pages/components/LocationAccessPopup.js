import React from 'react';

const LocationAccessPopup = ({ onAllowAccess, onDenyAccess }) => {
    console.log("LocationAccessPopup is being rendered");
    return (
        <div className="modal location-access-popup">
            <div className="modal-content">
                <h2>Privacy Notice</h2>
                <p>  We request access to your location data to provide a personalized experience and to show you relevant nearby car repair shops or parts suppliers. Your location will only be used for this purpose and will not be shared with any third parties. </p>


                <p>Please note that disabling location access may affect the functionality of the service and the ability to provide personalized recommendations.
                </p>

                <button id="allow" onClick={onAllowAccess}>
                    Allow location access
                </button>
            </div>
        </div>
    );
};

export default LocationAccessPopup;
