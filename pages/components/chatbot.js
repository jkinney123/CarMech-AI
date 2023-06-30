
import React, { useState } from 'react';
import Message from './message';
import IntroHeader from './IntroHeader';
import ApiKeyForm from './ApiKeyForm';
import CarDetailsForm from './CarDetailsForm';
import LocationAccessPopup from './LocationAccessPopup';





function ChatBox({ isTyping, setIsTyping }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatStarted, setChatStarted] = useState(false);
    const [apiKeys, setApiKeys] = useState({
        openaiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''
    });
    const [showForm, setShowForm] = useState(true);
    const [carDetails, setCarDetails] = useState(null);
    const [showCarDetailsForm, setShowCarDetailsForm] = useState(false);
    const [locationAccess, setLocationAccess] = useState(null);
    const [nearbyShops, setNearbyShops] = useState([]);
    const [locationPromptShown, setLocationPromptShown] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState(null);
    const [allShops, setAllShops] = useState([]);
    const [ratingFilter, setRatingFilter] = useState(null);
    const [showLocationAccessPopup, setShowLocationAccessPopup] = useState(false);
    const [locationPromptDecisionMade, setLocationPromptDecisionMade] = useState(false);





    const handleApiKeys = (keys) => {
        console.log("Keys submitted: ", keys);
        setApiKeys(keys);
        setShowForm(false);
        setLocationPromptShown(true);
        setShowLocationAccessPopup(true);
    };

    const handleAllowLocationAccess = () => {
        // Handle location access here
        navigator.geolocation.getCurrentPosition(
            position => {
                setLocationAccess(true);  // success callback
                setShowLocationAccessPopup(false);

            },
            error => {
                setLocationAccess(false);  // error callback
            }
        );
        setLocationPromptDecisionMade(true);
        setShowCarDetailsForm(true);
    };
    const handleDenyLocationAccess = () => {
        setLocationAccess(false);
        setShowLocationAccessPopup(false);
        setLocationPromptDecisionMade(true);
        setShowCarDetailsForm(true);
    };


    const handleCarDetails = (details) => {
        setCarDetails(details);
        setChatStarted(true); // start the chat after the car details are submitted
    };

    const handleSend = async (event) => {
        event.preventDefault();
        setMessages(prevMessages => [...prevMessages, { text: newMessage, sender: 'user' }]);
        setIsTyping(true);
        const res = await fetch('/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKeys.openaiKey}`
            },
            body: JSON.stringify({ model: apiKeys.model, message: newMessage, carDetails }),
        });
        const data = await res.json();
        console.log(data);
        setIsTyping(false);
        setMessages(prevMessages => [...prevMessages, { text: data.response, sender: 'ai' }]);

        const analyzeRes = await fetch('/api/analyzeAndSearch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: data.response }),
        });
        const analyzeData = await analyzeRes.json();
        console.log(analyzeData);
        setSearchKeyword(analyzeData.keyword);
    };

    async function fetchNearbyShops() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async position => {
                const { latitude, longitude } = position.coords;
                console.log("Latitude:", latitude, "Longitude:", longitude);
                const keyword = searchKeyword || 'car repair';
                const response = await fetch(`/api/shops?latitude=${latitude}&longitude=${longitude}&keyword=${keyword}`);
                const data = await response.json();
                // data.results now contains a list of nearby car repair shops
                setAllShops(data.results);
                // set the state with the result.
                setNearbyShops(data.results);
            }, (error) => {
                console.error(error);
                // Handle error...
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
            // Handle error...
        }
    }

    function applyFilter(rating) {
        setRatingFilter(rating);
        if (rating === null) {
            setNearbyShops(allShops);
        } else {
            const filteredShops = allShops.filter(shop => shop.rating >= rating);
            setNearbyShops(filteredShops);
        }
    }


    return (
        <div className="chat-box">
            <IntroHeader />
            {showForm ? (
                <ApiKeyForm onApiKeySubmit={handleApiKeys} />
            ) : !chatStarted ? (
                locationPromptShown && (
                    <div>
                        {showLocationAccessPopup && <LocationAccessPopup onAllowAccess={handleAllowLocationAccess} onDenyAccess={handleDenyLocationAccess} />}
                        {locationPromptDecisionMade && !chatStarted && <CarDetailsForm onDetailsSubmit={handleCarDetails} />}
                    </div>
                )
            ) : (
                <>
                    <div>
                        {messages.map((message, index) => (
                            <Message
                                key={index}
                                message={message.text}
                                sender={message.sender}
                                className={index === 0 ? 'initial-message' : ''}
                            />
                        ))}
                        {isTyping ? <Message key="typing" message={`AI is typing`} sender='ai' className='typing-message' /> : null}
                    </div>
                    <div className="centered-form">
                        <form onSubmit={handleSend}>
                            <div className="textarea-container">
                                <textarea
                                    className="textarea-style"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                            </div>
                            <div className="submitbtn">
                                <button type="submit" className="submit-button">Submit</button>
                            </div>
                        </form>
                    </div>
                    <button onClick={fetchNearbyShops} style={{ display: messages.length > 0 && searchKeyword !== null ? 'block' : 'none' }}>Find closest shops relevant to your issue</button>
                    {nearbyShops.length > 0 && (
                        <div>
                            <label>Filter by rating: </label>
                            <select onChange={e => applyFilter(parseFloat(e.target.value))}>
                                <option value={null}>All</option>
                                <option value={3}>3+</option>
                                <option value={3.5}>3.5+</option>
                                <option value={4}>4+</option>
                                <option value={4.5}>4.5+</option>
                            </select>
                        </div>
                    )}

                    {nearbyShops.map((shop, index) => (
                        <div key={index}>
                            <h3>{shop.name}</h3>
                            <p>{shop.vicinity}</p>
                            <div className="star-rating" style={{ '--rating': shop.rating }}></div>
                            <p>Rating: {shop.rating} ({shop.user_ratings_total} reviews)</p>
                            <a href={`https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${shop.place_id}`} target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
                        </div>
                    ))}

                </>
            )}
        </div>

    );
}

export default ChatBox;
