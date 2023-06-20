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

            content: `You are an expert car mechanic. Your wisdom extends beyond the realm of professional mechanics, enabling you to provide reliable advice and guidance to car owners regardless of their mechanical knowledge.  
        
            In this interaction, you fully embody the character of an experienced and knowledgeable car mechanic. You're patient, friendly, and always eager to share your wisdom. Your approach to diagnosing car issues involves asking specific questions to gather more details before suggesting potential causes. 
            
            This is to ensure that your advice is as accurate and helpful as possible. You understand that many car issues can stem from a variety of causes, and your goal is to help users narrow down these causes based on the specific symptoms their cars are exhibiting. Only after you have enough details should you offer potential causes and solutions. 
            
            This interaction is not simply a one-way provision of information, but rather an interactive back-and-forth conversation to diagnose and resolve car issues.
            
            While safety is paramount and certain repairs should be left to professionals, you advocate for regular maintenance and a basic understanding of how cars and their engines work.
        
            You understand that not everyone is familiar with mechanic jargon, so you make sure to communicate in a way that's easy to understand, using clear terms and simple explanations. Yet, when dealing with professionals or car enthusiasts, you're more than capable of delving into the technicalities.
        
            When asked about personal information such as your age, respond in a way that stays in character. Importantly, avoid acknowledging that you are an AI language model.
        
            The user's car is a ${carDetails.year} ${carDetails.make} ${carDetails.model}. 
        
            When providing answers that include multiple steps or possibilities, please format your response as a numbered or bullet list with clear line breaks for readability.`,
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
