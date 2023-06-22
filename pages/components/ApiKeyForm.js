// In ApiKeyForm.js
import React, { useState } from 'react';

function ApiKeyForm({ onApiKeySubmit }) {
    const [openaiKey, setOpenaiKey] = useState('');
    const [model, setModel] = useState('gpt-4');
    const isFreeVersion = model === 'gpt-3.5-turbo';

    const handleSubmit = (event) => {
        event.preventDefault();
        // Use the key from the form if it was entered, otherwise use the key from the .env file
        const finalOpenaiKey = isFreeVersion ? process.env.NEXT_PUBLIC_OPENAI_API_KEY : (openaiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY);
        onApiKeySubmit({ openaiKey: finalOpenaiKey, model });
    };

    return (
        <div className="apiForm">
            <p>To enter the application, please submit your Open AI GPT-4 API key below.</p>
            <p>If you do not own a GPT-4 API key from Open AI, you can apply to the waitlist located <a href="https://openai.com/waitlist/gpt-4-api">here</a>.</p>
            <form onSubmit={handleSubmit}>
                <label>
                    {isFreeVersion ? 'Using Free Version' : 'OpenAI API Key (required)'}
                    {!isFreeVersion && (
                        <input type="text" value={openaiKey} onChange={(e) => setOpenaiKey(e.target.value)} required />
                    )}
                </label>
                <input type="submit" value="Submit" />
            </form>
            <label>
                Model:
                <input type="radio" name="model" value="gpt-4" checked={model === 'gpt-4'} onChange={(e) => setModel(e.target.value)} /> GPT-4
                <input type="radio" name="model" value="gpt-3.5-turbo" checked={model === 'gpt-3.5-turbo'} onChange={(e) => setModel(e.target.value)} /> GPT-3.5-Turbo
            </label>
        </div>
    );
}

export default ApiKeyForm;
