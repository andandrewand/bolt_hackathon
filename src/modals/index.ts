export interface LoginResponse {
  UserId: string;
  sessionId: string;
}

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginState {
  sessionId: string | null;
  UserId: string | null;
}

export interface ModalWinRate {
  modelName: string;
  winRate: number;
}

export interface UserProfileReponse {
  user: {
    balance: number;
    userId: string;
    username: string;
    winRate: number;
    totalEarning: number;
    modelWinRates: ModalWinRate[];
  };
}

export interface UserProfileRequest {
  userId: string;
}

export interface SessionsResponse {
  sessions: SessionList[];
  scheduled: SessionList[];
}

export interface ModalInfo {
  updatedAt: string | null;
  createdAt: string;
  sessionStatus: string | null;
  prediction: string;
  roundId: string;
  modelName: string;
  previousClose: string;
  accuracy: string | null;
  payoutRatio: number;
  actualClose: string | null;
  candleTimestamp: string;
}

export interface SessionList {
  createdAt: string;
  createdTime: string;
  models: ModalInfo[];
  roundId: string;
  type: string;
  candleTimestamp: string;
  statusLabel: string;
}

export interface BidHistoryRequest {
  userId: string;
  roundId: string;
}

export interface Bids {
  roundId: string;
  bidAmount: number;
  isClosed: boolean | null;
  isWinning: boolean | null;
  payOutOdds: boolean | null;
  prediction: string;
}

export interface BidHistoryResponse {
  userBids: Bids[];
  lastEvaluatedKey: null;
}

export interface BidRequest {
  bidAmount: number;
  roundId: string;
  prediction: string;
}
