const natural = require('natural');
const tokenizer = new natural.WordTokenizer();


export default async function handler(req, res) {
    const { text } = req.body;

    const carKeywords = [
        'alternator',
        'battery',
        'brake',
        'brake pad',
        'brake disc',
        'camshaft',
        'carburetor',
        'clutch',
        'cylinder',
        'distributor',
        'engine',
        'exhaust',
        'fuel filter',
        'fuel injector',
        'fuel pump',
        'gasket',
        'gearbox',
        'head gasket',
        'ignition',
        'oil filter',
        'piston',
        'radiator',
        'serpentine belt',
        'spark plug',
        'starter motor',
        'suspension',
        'timing belt',
        'tire',
        'transmission',
        'turbocharger',
        'valve',
        'water pump',
        'wheel',
        'wheel bearing',
        'windshield wiper',
        // issues
        'overheating',
        'leak',
        'no start',
        'misfire',
        'vibration',
        'noise',
        'stalling',
        'poor gas mileage',
        'warning light',
    ];

    const repairWords = ['repair', 'fix', 'replace', 'service', 'maintenance'];
    const purchaseWords = ['buy', 'purchase', 'order', 'need', 'get'];

    let keywordFrequencies = {};
    let repairCount = 0;
    let purchaseCount = 0;

    // Convert text to lowercase
    const lowerText = text.toLowerCase();

    // Tokenize text into words
    const words = tokenizer.tokenize(lowerText);

    // Iterate through carKeywords and count how many times each keyword appears in the text.
    for (let key of carKeywords) {
        let count = (lowerText.match(new RegExp("\\b" + key + "\\b", "gi")) || []).length;
        if (count > 0) {
            keywordFrequencies[key] = count;
        }
    }

    words.forEach(word => {
        if (repairWords.includes(word)) {
            repairCount++;
        }
        else if (purchaseWords.includes(word)) {
            purchaseCount++;
        }
    });

    let prefix = repairCount >= purchaseCount ? 'car repair' : 'car parts';

    // Find the maximum frequency.
    let maxFrequency = Math.max(...Object.values(keywordFrequencies));

    // Find all keywords that have the maximum frequency.
    let mostFrequentKeywords = Object.keys(keywordFrequencies).filter(key => keywordFrequencies[key] === maxFrequency);

    // If there's a single most frequent keyword, use it.
    // Otherwise, join all of the most frequent keywords into a single string.
    let keywordsString = mostFrequentKeywords.length === 1 ? mostFrequentKeywords[0] : mostFrequentKeywords.join(' ');

    // Append the prefix to the keywordsString
    keywordsString = `${prefix} ${keywordsString}`;

    res.status(200).json({ keyword: keywordsString });
}