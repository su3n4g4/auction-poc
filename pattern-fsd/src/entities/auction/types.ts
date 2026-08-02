export interface AuctionState {
  currentPrice: number;
  remainingSeconds: number;
  extensionCount: number;
  showExtensionNotice: boolean;
}

export interface AuctionActions {
  // Validates amount > currentPrice, updates price and handles auto-extension.
  // Returns success/failure and whether the timer was extended.
  acceptBid: (amount: number) => { success: boolean; error?: string; extended: boolean };
  tickTimer: () => void;
  dismissExtensionNotice: () => void;
}
