const natural = require('natural');
const tokenizer = new natural.WordTokenizer();


export default async function handler(req, res) {
    const { text } = req.body;

    const carKeywords = [
        // General car parts
        'accelerator',
        'actuator',
        'airbag',
        'alternator',
        'antifreeze',
        'axle',
        'ball joint',
        'battery',
        'bearing',
        'belt',
        'brake',
        'brake caliper',
        'brake disc',
        'brake fluid',
        'brake line',
        'brake pad',
        'bumper',
        'camshaft',
        'carburetor',
        'catalytic converter',
        'chassis',
        'clutch',
        'coil',
        'compressor',
        'condenser',
        'control arm',
        'coolant',
        'crankshaft',
        'cylinder',
        'differential',
        'distributor',
        'driveshaft',
        'engine',
        'exhaust',
        'fan',
        'filter',
        'flywheel',
        'fuel',
        'fuel filter',
        'fuel injector',
        'fuel pump',
        'fuel system',
        'fuse',
        'gasket',
        'gear',
        'gearbox',
        'generator',
        'headlight',
        'head gasket',
        'heater',
        'hose',
        'ignition',
        'ignition switch',
        'indicator',
        'injector',
        'intake',
        'intercooler',
        'key fob',
        'lamp',
        'lock',
        'manifold',
        'master cylinder',
        'motor',
        'muffler',
        'oil',
        'oil filter',
        'piston',
        'plug',
        'power steering',
        'pressure plate',
        'pump',
        'radiator',
        'reservoir',
        'sensor',
        'serpentine belt',
        'shock absorber',
        'spark plug',
        'spring',
        'starter',
        'steering',
        'suspension',
        'sway bar',
        'thermostat',
        'throttle',
        'timing belt',
        'tire',
        'transmission',
        'turbocharger',
        'valve',
        'water pump',
        'wheel',
        'wheel bearing',
        'windshield',
        'windshield wiper',
        // Additional issues
        'alignment',
        'battery drain',
        'brake noise',
        'cooling system leak',
        'engine misfire',
        'exhaust smoke',
        'headlight flickering',
        'not starting',
        'overheating',
        'poor acceleration',
        'poor fuel efficiency',
        'rough idle',
        'stalling',
        'steering wheel vibration',
        'suspension noise',
        'transmission slipping',
        'warning light',
        'AC compressor',
        'Air filter',
        'Air intake',
        'Alternator pulley',
        'Ball bearing',
        'Brake booster',
        'Camshaft position sensor',
        'Clutch cable',
        'Control module',
        'Coolant reservoir',
        'Crankshaft position sensor',
        'Cylinder head',
        'Door handle',
        'Drive belt',
        'EGR valve',
        'Electronic control unit (ECU)',
        'Engine block',
        'Exhaust manifold',
        'Fan belt',
        'Flywheel ring gear',
        'Fuel pressure regulator',
        'Fuel tank',
        'Fuse box',
        'Gear shift lever',
        'Harmonic balancer',
        'Heater core',
        'Ignition coil',
        'Injector O-rings',
        'Intake manifold',
        'Knock sensor',
        'Leaf spring',
        'Mass air flow sensor (MAF)',
        'Oxygen sensor (O2 sensor)',
        'Power window motor',
        'Radiator fan',
        'Seat belt',
        'Shock absorber bushing',
        'Speed sensor',
        'Starter solenoid',
        'Steering column',
        'Strut mount',
        'Tail light assembly',
        'Thermostat housing',
        'Throttle body',
        'Timing chain',
        'Transmission filter',
        'Turbo wastegate',
        'Universal joint',
        'Valve cover gasket',
        'Water pump pulley',
        'Wheel hub assembly',
        'Window regulator',
        'ABS light on',
        'Air conditioning not cooling',
        'Battery not charging',
        'Brake pedal soft',
        'Check engine light flashing',
        'Engine knocking',
        'Fuel smell',
        'Gear shifting problems',
        'High-pitched noise from engine',
        'Oil leak',
        'Poor idle quality',
        'Power steering fluid leak',
        'Radiator leak',
        'Rough gear changes',
        'Squealing brakes',
        'Suspension sagging',
        'Transmission slipping',
        'Uneven tire wear',
        'Vacuum leak',
        'Water leak',

    ];



    const repairWords = ['repair', 'repaired', 'fix', 'fixed', 'service', 'serviced', 'maintenance', 'mechanic', 'professional'];
    const purchaseWords = ['new', 'buy', 'purchase', 'purchased', 'order', 'ordered', 'need', 'get', 'replace'];

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