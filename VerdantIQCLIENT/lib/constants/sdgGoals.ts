export interface SDGGoal {
  number: number;
  name: string;
  shortName: string;
  color: string;
  icon: string;
  description: string;
  keywords: string[];
}

export const SDG_GOALS: SDGGoal[] = [
  {
    number: 1,
    name: 'No Poverty',
    shortName: 'SDG 1',
    color: '#E5243B',
    icon: '🏠',
    description: 'End poverty in all its forms everywhere.',
    keywords: ['poverty', 'donation', 'thrift', 'charity', 'low-cost', 'aid', 'shelter', 'basic needs'],
  },
  {
    number: 2,
    name: 'Zero Hunger',
    shortName: 'SDG 2',
    color: '#DDA63A',
    icon: '🍲',
    description: 'End hunger, achieve food security, and promote sustainable agriculture.',
    keywords: ['food waste', 'compost', 'leftovers', 'community garden', 'food bank', 'permaculture', 'agriculture', 'crops'],
  },
  {
    number: 3,
    name: 'Good Health and Well-Being',
    shortName: 'SDG 3',
    color: '#4C9F38',
    icon: '❤️',
    description: 'Ensure healthy lives and promote well-being for all at all ages.',
    keywords: ['cycling', 'walking', 'stairs', 'air quality', 'wellness', 'mental health', 'organic', 'exercise', 'pedestrian'],
  },
  {
    number: 4,
    name: 'Quality Education',
    shortName: 'SDG 4',
    color: '#C5192D',
    icon: '📚',
    description: 'Ensure inclusive and equitable quality education and promote lifelong learning opportunities.',
    keywords: ['workshop', 'eco club', 'seminar', 'awareness', 'peer learning', 'training', 'paperless notes', 'digitization'],
  },
  {
    number: 5,
    name: 'Gender Equality',
    shortName: 'SDG 5',
    color: '#FF3A21',
    icon: '⚖️',
    description: 'Achieve gender equality and empower all women and girls.',
    keywords: ['equity', 'empowerment', 'diversity', 'inclusive leadership', 'gender equality'],
  },
  {
    number: 6,
    name: 'Clean Water and Sanitation',
    shortName: 'SDG 6',
    color: '#26BDE2',
    icon: '💧',
    description: 'Ensure availability and sustainable management of water and sanitation for all.',
    keywords: ['water tap', 'leak', 'rainwater', 'low flow aerator', 'water bottle', 'refill station', 'greywater', 'sanitation'],
  },
  {
    number: 7,
    name: 'Affordable and Clean Energy',
    shortName: 'SDG 7',
    color: '#FCC30B',
    icon: '⚡',
    description: 'Ensure access to affordable, reliable, sustainable and modern energy for all.',
    keywords: ['solar', 'lights off', 'unplug vampire load', 'hvac eco thermostat', 'led bulb', 'energy meter', 'kilowatt', 'kwh', 'renewable', 'clean power'],
  },
  {
    number: 8,
    name: 'Decent Work and Economic Growth',
    shortName: 'SDG 8',
    color: '#A21942',
    icon: '💼',
    description: 'Promote sustained, inclusive and sustainable economic growth, full and productive employment.',
    keywords: ['green jobs', 'fair trade', 'campus employment', 'sustainable lab', 'economic efficiency', 'energy audit'],
  },
  {
    number: 9,
    name: 'Industry, Innovation and Infrastructure',
    shortName: 'SDG 9',
    color: '#FD6925',
    icon: '🏭',
    description: 'Build resilient infrastructure, promote inclusive and sustainable industrialization.',
    keywords: ['iot sensor', 'smart meter', 'green server', 'edge computing', 'retrofit', 'efficient equipment', 'hardware upgrade'],
  },
  {
    number: 10,
    name: 'Reduced Inequalities',
    shortName: 'SDG 10',
    color: '#DD1367',
    icon: '🤝',
    description: 'Reduce inequality within and among countries.',
    keywords: ['accessible transit', 'digital inclusion', 'equal access', 'community sharing', 'tool library'],
  },
  {
    number: 11,
    name: 'Sustainable Cities and Communities',
    shortName: 'SDG 11',
    color: '#FD9D24',
    icon: '🏙️',
    description: 'Make cities and human settlements inclusive, safe, resilient and sustainable.',
    keywords: ['campus shuttle', 'public bus', 'carpool', 'green campus', 'dorm setback', 'urban green space', 'bike rack', 'smart campus'],
  },
  {
    number: 12,
    name: 'Responsible Consumption and Production',
    shortName: 'SDG 12',
    color: '#BF8B2E',
    icon: '🔄',
    description: 'Ensure sustainable consumption and production patterns.',
    keywords: ['recycling', 'reusable container', 'plastic free', 'upcycle', 'e-waste', 'zero waste', 'single-use ban', 'repair cafe'],
  },
  {
    number: 13,
    name: 'Climate Action',
    shortName: 'SDG 13',
    color: '#3F7E44',
    icon: '🌍',
    description: 'Take urgent action to combat climate change and its impacts.',
    keywords: ['carbon offset', 'tree planting', 'climate strike', 'emission reduction', 'ghg footprint', 'heat mitigation', 'climate policy'],
  },
  {
    number: 14,
    name: 'Life Below Water',
    shortName: 'SDG 14',
    color: '#0A97D9',
    icon: '🐟',
    description: 'Conserve and sustainably use the oceans, seas and marine resources.',
    keywords: ['pond cleanup', 'drain filtering', 'microplastics', 'lake restore', 'chemical free soap', 'stream protection'],
  },
  {
    number: 15,
    name: 'Life on Land',
    shortName: 'SDG 15',
    color: '#56C02B',
    icon: '🌲',
    description: 'Protect, restore and promote sustainable use of terrestrial ecosystems.',
    keywords: ['biodiversity', 'native plants', 'pollinator garden', 'wildlife habitat', 'invasive species removal', 'reforestation'],
  },
  {
    number: 16,
    name: 'Peace, Justice and Strong Institutions',
    shortName: 'SDG 16',
    color: '#00689D',
    icon: '🕊️',
    description: 'Promote peaceful and inclusive societies, provide access to justice for all.',
    keywords: ['transparency', 'open data', 'governance', 'audit trail', 'compliance log', 'whistleblower', 'fair verification'],
  },
  {
    number: 17,
    name: 'Partnerships for the Goals',
    shortName: 'SDG 17',
    color: '#19486A',
    icon: '🌐',
    description: 'Strengthen the means of implementation and revitalize the Global Partnership.',
    keywords: ['inter-department challenge', 'cross-campus collaboration', 'hackathon', 'regional alliance', 'stakeholder summit'],
  },
];

export function classifyActionToSDG(text: string, ocrText?: string): { primaryGoal: SDGGoal; confidence: number; matchReasons: string[] } {
  const combined = `${text} ${ocrText || ''}`.toLowerCase();
  
  let bestGoal = SDG_GOALS[6]; // Default to SDG 7 Clean Energy
  let maxScore = 0;
  let matchedKeywords: string[] = [];

  for (const goal of SDG_GOALS) {
    let score = 0;
    const currentMatches: string[] = [];
    for (const kw of goal.keywords) {
      if (combined.includes(kw.toLowerCase())) {
        score += 3;
        currentMatches.push(kw);
      }
    }
    // Check goal description tokens
    const descWords = goal.description.toLowerCase().split(/\s+/);
    for (const w of descWords) {
      if (w.length > 4 && combined.includes(w)) {
        score += 1;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestGoal = goal;
      matchedKeywords = currentMatches;
    }
  }

  // Calculate normalized confidence score
  const confidence = Math.min(0.98, Math.max(0.65, 0.65 + maxScore * 0.05));

  return {
    primaryGoal: bestGoal,
    confidence: parseFloat(confidence.toFixed(2)),
    matchReasons: matchedKeywords.length > 0 ? matchedKeywords : ['Contextual keyword alignment with ' + bestGoal.name],
  };
}

