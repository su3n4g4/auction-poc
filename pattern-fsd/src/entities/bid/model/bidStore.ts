import { create } from "zustand";
import type { Bid, BidStatusByUser } from "../types";

interface BidStore {
  bidHistory: Bid[];
  viewerRanking: BidStatusByUser[];
  addBid: (bid: Bid) => void;
  updateViewerRanking: (userName: string, amount: number) => void;
}

export const useBidStore = create<BidStore>((set, get) => ({
  bidHistory: [],
  viewerRanking: [],
  addBid: (bid: Bid) => {
    const updateViewerRanking = get().updateViewerRanking;
    set((state) => ({
      bidHistory: [bid, ...state.bidHistory].slice(0, 50),
    }));
    updateViewerRanking(bid.userName, bid.amount);
  },
  updateViewerRanking: (userName: string, amount: number) => {
    const newViewerRanking = get().viewerRanking;
    
    const existing = newViewerRanking.find((r) => r.userName === userName);

    const updated = existing
      ? newViewerRanking.map((r) =>
          r === existing
            ? { ...r, maxAmount: Math.max(r.maxAmount, amount), count: r.count + 1 }
            : r
        )
      : [...newViewerRanking, { userName, maxAmount: amount, count: 1 }];
  
    set((state) => ({
      viewerRanking:  [...updated].sort((a, b) => b.count - a.count || b.maxAmount - a.maxAmount)
    }));
  }
}));