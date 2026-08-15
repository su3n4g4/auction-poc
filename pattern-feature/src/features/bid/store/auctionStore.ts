import { create } from "zustand";
import type { AuctionState, AuctionActions, Bid, BidStatusByUser } from "@/features/bid/types/auction";

const EXTENSION_THRESHOLD_SECONDS = 30;
const EXTENSION_DURATION_SECONDS = 30;
const INITIAL_PRICE = 10000;
const INITIAL_SECONDS = 120;

type AuctionStore = AuctionState & AuctionActions;

/**
 * 視聴者ランキングに入札結果を反映した新しい配列を返す(元の配列は変更しない)。
 */
export function updateViewerRanking(
  ranking: BidStatusByUser[],
  userName: string,
  amount: number
): BidStatusByUser[] {
  const existing = ranking.find((r) => r.userName === userName);

  const updated = existing
    ? ranking.map((r) =>
        r.userName === userName
          ? { ...r, maxAmount: Math.max(r.maxAmount, amount), count: r.count + 1 }
          : r
      )
    : [...ranking, { userName, maxAmount: amount, count: 1 }];

  return [...updated].sort(
    (a, b) => b.count - a.count || b.maxAmount - a.maxAmount
  );
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
