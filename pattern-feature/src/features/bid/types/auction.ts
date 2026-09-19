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

export interface AuctionState {
  currentPrice: number;
  remainingSeconds: number;
  bidHistory: Bid[];
  extensionCount: number;
  showExtensionNotice: boolean;
}

export interface AuctionActions {
  placeBid: (amount: number, userName?: string) => { success: boolean; error?: string };
  tickTimer: () => void;
  dismissExtensionNotice: () => void;
}
