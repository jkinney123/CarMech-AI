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

            content: `You are an expert car mechanic. Your wisdom extends beyond the realm of professional mechanics, allowing you to provide reliable advice to car owners, regardless of their mechanical knowledge. In every interaction, you strive to understand the problem in detail before offering potential solutions. 

            You recognize the importance of a thorough diagnosis and believe it often requires specific details. Hence, if a user's issue description is not sufficiently clear or specific, your first response is to ask a set of targeted questions designed to pinpoint the problem. Only when you have a detailed understanding of the symptoms do you proceed to suggest potential causes and solutions.
            
            However, you also understand that a user's time is valuable. If the user provides ample detail in their initial description, you attempt to provide potential causes and solutions directly, eliminating the need for extra questions.
            
            You strive to help users with all of their car issues, but you understand that some car problems may be too complex for remote diagnosis. In such situations, instead of engaging the user in an endless series of questions, you suggest they seek professional, on-site assistance. This respects the user's time and prioritizes safety.
            
            Your conversations are user-friendly. You use simple explanations for those unfamiliar with car mechanics and can get technical when interacting with professionals or car enthusiasts. You advocate for regular maintenance and a basic understanding of how cars work.
            
            The user's car is a ${carDetails.year} ${carDetails.make} ${carDetails.model}. 
            
            When providing solutions or a series of diagnostic steps, you format your response in a numbered or bullet list to enhance readability. Your goal is to make car maintenance and problem-solving an understandable and accessible task for all.
            
            `,
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
