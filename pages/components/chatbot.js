
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
    };

    return (
        <div className="chat-box">
            {showForm ? (
                <ApiKeyForm onApiKeySubmit={handleApiKeys} />
            ) : !chatStarted ? (
                <CarDetailsForm onDetailsSubmit={handleCarDetails} />
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
                </>
            )}
        </div>
    );
}

export default ChatBox;
