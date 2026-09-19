import { create } from "zustand";
import type { AuctionState, AuctionActions, Bid, BidStatusByUser } from "@/features/bid/types/auction";

const EXTENSION_THRESHOLD_SECONDS = 30;
const EXTENSION_DURATION_SECONDS = 30;
const INITIAL_PRICE = 10000;
const INITIAL_SECONDS = 120;

type AuctionStore = AuctionState & AuctionActions;

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

export const useAuctionStore = create<AuctionStore>((set, get) => ({
  currentPrice: INITIAL_PRICE,
  remainingSeconds: INITIAL_SECONDS,
  bidHistory: [],
  viewerRanking: [],
  extensionCount: 0,
  showExtensionNotice: false,

  placeBid: (amount: number, userName = "あなた") => {
    const { currentPrice, remainingSeconds, viewerRanking } = get();

    if (amount <= currentPrice) {
      return {
        success: false,
        error: `現在価格（¥${currentPrice.toLocaleString()}）より高い金額を入力してください`,
      };
    }

    const newBid: Bid = {
      id: crypto.randomUUID(),
      userName,
      amount,
      timestamp: new Date(),
    };

    const shouldExtend = remainingSeconds <= EXTENSION_THRESHOLD_SECONDS;
    const newViewerRanking = updateViewerRanking(viewerRanking, userName, amount);

    set((state) => ({
      currentPrice: amount,
      bidHistory: [newBid, ...state.bidHistory].slice(0, 50),
      viewerRanking: newViewerRanking,
      remainingSeconds: shouldExtend
        ? state.remainingSeconds + EXTENSION_DURATION_SECONDS
        : state.remainingSeconds,
      extensionCount: shouldExtend ? state.extensionCount + 1 : state.extensionCount,
      showExtensionNotice: shouldExtend ? true : state.showExtensionNotice,
    }));

    return { success: true };
  },

  tickTimer: () => {
    set((state) => ({
      remainingSeconds: Math.max(0, state.remainingSeconds - 1),
    }));
  },

  triggerExtension: () => {
    set((state) => ({
      remainingSeconds: state.remainingSeconds + EXTENSION_DURATION_SECONDS,
      extensionCount: state.extensionCount + 1,
      showExtensionNotice: true,
    }));
  },

  dismissExtensionNotice: () => {
    set({ showExtensionNotice: false });
  },
}));
