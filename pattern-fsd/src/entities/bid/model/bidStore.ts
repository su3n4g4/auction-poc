import { create } from "zustand";
import type { Bid, BidStatusByUser } from "../types";

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

/**
 * 入札履歴から入札者ごとの入札回数・最高額を集計し、回数→最高額の降順で返す。
 * 呼び出しごとに新しい配列を返すため、コンポーネントでは useMemo で bidHistory に依存させて使うこと。
 */
export function calcBidderRanking(bids: Bid[]): BidStatusByUser[] {
  const map = new Map<string, BidStatusByUser>();
  for (const bid of bids) {
    const existing = map.get(bid.userName);
    if (existing) {
      existing.maxAmount = Math.max(existing.maxAmount, bid.amount);
      existing.count += 1;
    } else {
      map.set(bid.userName, { userName: bid.userName, maxAmount: bid.amount, count: 1 });
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count || b.maxAmount - a.maxAmount);
}
