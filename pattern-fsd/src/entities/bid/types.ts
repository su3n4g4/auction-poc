export interface Bid {
  id: string;
  userName: string;
  amount: number;
  timestamp: Date;
}

export interface BidStatusByUser {
  userName: string;
  maxAmount: number;
  count: number;
}
