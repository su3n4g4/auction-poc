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
  viewerRanking: BidStatusByUser[];
  extensionCount: number;
  showExtensionNotice: boolean;
}

export interface AuctionActions {
  placeBid: (amount: number, userName?: string) => { success: boolean; error?: string };
  tickTimer: () => void;
  triggerExtension: () => void;
  dismissExtensionNotice: () => void;
}

export type Comment = {
  id: string;
  userName: string;
  text: string;
  timestamp: Date;
};
