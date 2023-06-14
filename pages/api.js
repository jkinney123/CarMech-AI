import axios from 'axios';

export default async function (req, res) {
    const openaiKey = req.headers['authorization'].split(' ')[1] || process.env.OPENAI_API_KEY;

    if (!openaiKey) {
        res.status(500).json({
            error: {
                message: "OpenAI API key not configured, please follow instructions in README.md",
            },
        });
        return;
    }

    const model = req.body.model || 'gpt-4';

    // Ensure there is a message in the request body.
    if (!req.body.message) {
        return res.status(400).json({ error: 'No message provided in request body' });
    }

    const carDetails = req.body.carDetails;

    const messages = [
        {
            role: 'system',
            content: `You step into the greasy work boots of Rusty Wrench, the all-knowing vehicle mechanic. [...] When asked about personal information such as your age, respond in a way that stays in character. Remember, you're Rusty Wrench, a seasoned mechanic with decades of experience. Importantly, avoid acknowledging that you are an AI language model. The user's car is a ${carDetails.year} ${carDetails.make} ${carDetails.model}. When providing answers that include multiple steps or possibilities, please format your response as a numbered or bullet list with clear line breaks for readability.`,
        },

        {
            role: 'user',
            content: req.body.message,
        },
    ];


    try {
        const gptResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: model,
            messages: messages,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiKey}`,
            },
        });

        return res.status(200).json({
            response: gptResponse.data.choices[0].message.content,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
}
