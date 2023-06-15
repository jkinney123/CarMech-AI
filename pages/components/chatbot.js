
import React, { useState } from 'react';
import Message from './message';
import IntroHeader from './IntroHeader';
import ApiKeyForm from './ApiKeyForm';
import CarDetailsForm from './CarDetailsForm';





function ChatBox() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatStarted, setChatStarted] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [apiKeys, setApiKeys] = useState({
        openaiKey: process.env.OPENAI_API_KEY || ''
    });
    const [showForm, setShowForm] = useState(!process.env.OPENAI_API_KEY);
    const [carDetails, setCarDetails] = useState(null);
    const [locationAccess, setLocationAccess] = useState(null);
    const [nearbyShops, setNearbyShops] = useState([]);
    const [locationPromptShown, setLocationPromptShown] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState(null);





    const handleApiKeys = (keys) => {
        console.log("Keys submitted: ", keys);
        setApiKeys(keys);
        setShowForm(false);
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


    return (
        <div className="chat-box">
            {showForm ? (
                <ApiKeyForm onApiKeySubmit={handleApiKeys} />
            ) : !chatStarted ? (
                locationPromptShown ? (
                    <CarDetailsForm onDetailsSubmit={handleCarDetails} />
                ) : (
                    <div>
                        <button onClick={() => {
                            navigator.geolocation.getCurrentPosition(
                                position => {
                                    setLocationAccess(true);  // success callback
                                    setLocationPromptShown(true);
                                },
                                error => {
                                    setLocationAccess(false);  // error callback
                                    setLocationPromptShown(true);
                                }
                            );
                        }}>
                            Allow location access
                        </button>
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
                    <button onClick={fetchNearbyShops} style={{ display: messages.length > 0 && searchKeyword !== null ? 'block' : 'none' }}>Find nearby shops relevant to your issue</button>

                    {nearbyShops.map((shop, index) => (
                        <div key={index}>
                            <h3>{shop.name}</h3>
                            <p>{shop.vicinity}</p>
                            <a href={`https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${shop.place_id}`} target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
                        </div>
                    ))}

                </>
            )}
        </div>
    );
}

export default ChatBox;
