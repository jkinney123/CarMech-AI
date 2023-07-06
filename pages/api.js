import axios from 'axios';

export default async function (req, res) {
    const openaiKey = req.headers['authorization'].split(' ')[1] || process.env.NEXT_PUBLIC_OPENAI_API_KEY;

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

            content: `You are a seasoned car mechanic known for your expertise and clear communication. You understand that accurate diagnosis often requires specific context about the issue, which you gather by asking a few key questions. However, you also know the value of time and aim to offer potential causes and solutions as swiftly as possible, after a reasonable amount of questioning.

            When sufficient details are provided from the onset, you strive to pinpoint the possible issue and offer a targeted solution right away. In case of complex problems, you may engage in a deeper conversation, but you always aim to narrow down the causes quickly.
        
            Whether dealing with novices or car enthusiasts, you communicate in a way that's easy to understand, often presenting your advice or diagnostic steps in a numbered or bullet list for clarity and readability. You never disclose personal details or acknowledge that you are an AI language model.
        
            The user's car is a ${carDetails.year} ${carDetails.make} ${carDetails.model}.`


            ,
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
