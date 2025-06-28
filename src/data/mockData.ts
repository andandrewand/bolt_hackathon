import { MLModel, Race, UserStats, PastRace } from '../types/racing';

export const mlModels: MLModel[] = [
  {
    id: 'satoshi-shibe',
    name: 'Satoshi Shibe',
    modal: "Jamba 1.5 Mini",
    personality: 'The Conservative',
    description: 'Steady predictions, minimal risk approach',
    color: '#10B981', // Green
  },
  {
    id: 'moondoggie',
    name: 'Moon Doggie',
    modal: "Nova Lite",
    personality: 'The Aggressive',
    description: 'Bold predictions, high-risk high-reward',
    color: '#EF4444', // Red
  },
  {
    id: 'sheba-fomo',
    name: 'Sheba Fomo',
    modal: "Command Light",
    personality: 'The Trend Follower',
    description: 'Momentum-based, follows market patterns',
    color: '#8B5CF6', // Purple
  }
];

export const mockUserStats: UserStats = {
  balance: 88,
  totalBets: 0,
  totalWon: 0,
  winRate: 0,
  totalEarnings: 0
};

// Generate mock Dogecoin price (around $0.08-$0.12 range)
export const generateMockPrice = (): number => {
  return 0.08 + Math.random() * 0.04;
};

// Generate ML predictions based on current price
export const generateMLPredictions = (currentPrice: number): MLModel[] => {
  return mlModels.map(model => {
    let prediction: number;
    let confidence: number;
    
    switch (model.id) {
      case 'satoshi-shibe':
        // Conservative: ±1-3% change
        prediction = currentPrice * (1 + (Math.random() - 0.5) * 0.06);
        confidence = 75 + Math.random() * 20; // 75-95%
        break;
      case 'moondoggie':
        // Aggressive: ±3-8% change
        prediction = currentPrice * (1 + (Math.random() - 0.5) * 0.16);
        confidence = 60 + Math.random() * 25; // 60-85%
        break;
      case 'sheba-fomo':
        // Trend follower: ±2-5% change with slight upward bias
        prediction = currentPrice * (1 + (Math.random() - 0.4) * 0.10);
        confidence = 70 + Math.random() * 20; // 70-90%
        break;
      default:
        prediction = currentPrice;
        confidence = 50;
    }
    
    return {
      ...model,
      prediction: Math.max(0.01, prediction), // Ensure positive price
      confidence: Math.round(confidence)
    };
  });
};

export const mockPastRaces: PastRace[] = [
  {
    id: 'race-002',
    name: 'Race #002',
    startPrice: 0.0915,
    endPrice: 0.0898,
    winner: mlModels[0], // Satoshi Shibe
    models: [
      { ...mlModels[0], prediction: 0.0901 },
      { ...mlModels[1], prediction: 0.0875 },
      { ...mlModels[2], prediction: 0.0925 }
    ],
    timestamp: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
  },
  {
    id: 'race-001',
    name: 'Race #001',
    startPrice: 0.0892,
    endPrice: 0.0915,
    winner: mlModels[2], // Sheba Fomo
    models: [
      { ...mlModels[0], prediction: 0.0888 },
      { ...mlModels[1], prediction: 0.0945 },
      { ...mlModels[2], prediction: 0.0912 }
    ],
    timestamp: new Date(Date.now() - 10 * 60 * 1000) // 10 minutes ago
  }
];