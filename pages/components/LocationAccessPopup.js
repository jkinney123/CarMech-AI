import React from 'react';

const LocationAccessPopup = ({ onAllowAccess, onDenyAccess }) => {
    console.log("LocationAccessPopup is being rendered");
    return (
        <div className="modal location-access-popup">
            <div className="modal-content">
                <h2>Privacy Notice</h2>
                <p>Privacy Notice for Location Data

                    We respect your privacy and are committed to protecting your personal data.

                    We request access to your location data to provide a personalized experience and to show you relevant nearby car repair shops or parts suppliers. Your location will only be used for this purpose and will not be shared with any third parties.

                    By clicking 'Allow location access', you consent to the use of your location for these purposes. You can withdraw this consent at any time by changing your location preferences in your device settings.

                    Please note that disabling location access may affect the functionality of the service and the ability to provide personalized recommendations.

                    If you have any questions about how we use your location data, please refer to our full Privacy Policy or contact us at [your contact information].

                    We appreciate your trust in us.</p>

                <button id="allow" onClick={onAllowAccess}>
                    Allow location access
                </button>
            </div>
        </div>
    );
};

export default LocationAccessPopup;
