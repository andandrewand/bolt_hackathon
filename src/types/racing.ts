export interface MLModel {
  id: string;
  name: string;
  personality: string;
  description: string;
  color: string;
  prediction?: number;
  confidence?: number;
  modal: string;
}

export interface Race {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  status: 'new' | 'betting' | 'locked' | 'running' | 'finished' | "upcoming";
  currentPrice: number;
  targetPrice?: number;
  models: MLModel[];
  winner?: string;
  timeRemaining: number;
}

export interface Bet {
  id: string;
  raceId: string;
  modelId: string;
  amount: number;
  timestamp: Date;
  status: 'active' | 'won' | 'lost';
  payout?: number;
}

export interface UserStats {
  balance: number;
  totalBets: number;
  totalWon: number;
  winRate: number;
  totalEarnings: number;
}

export interface PastRace {
  id: string;
  name: string;
  startPrice: number;
  endPrice: number;
  winner: MLModel;
  models: MLModel[];
  timestamp: Date;
  userBet?: Bet;
}