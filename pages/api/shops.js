export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Bad request' });
    }

    const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&keyword=${req.query.keyword}&key=AIzaSyD69nif3CLz3iPTeCtxWdLLHkjZb0E_k9g`);

    const data = await response.json();

    return res.status(200).json(data);
}
