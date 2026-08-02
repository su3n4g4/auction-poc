import { create } from "zustand";
import type { Bid } from "../types";

interface BidStore {
  bidHistory: Bid[];
  addBid: (bid: Bid) => void;
}

export const useBidStore = create<BidStore>((set) => ({
  bidHistory: [],

  addBid: (bid: Bid) => {
    set((state) => ({
      bidHistory: [bid, ...state.bidHistory].slice(0, 50),
    }));
  },
}));
