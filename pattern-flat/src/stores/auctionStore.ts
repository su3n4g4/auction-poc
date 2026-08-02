import { create } from "zustand";
import type { AuctionState, AuctionActions, Bid } from "@/types/auction";

const EXTENSION_THRESHOLD_SECONDS = 30;
const EXTENSION_DURATION_SECONDS = 30;
const INITIAL_PRICE = 10000;
const INITIAL_SECONDS = 120;

type AuctionStore = AuctionState & AuctionActions;

export const useAuctionStore = create<AuctionStore>((set, get) => ({
  currentPrice: INITIAL_PRICE,
  remainingSeconds: INITIAL_SECONDS,
  bidHistory: [],
  extensionCount: 0,
  showExtensionNotice: false,

  placeBid: (amount: number, userName = "あなた") => {
    const { currentPrice, remainingSeconds } = get();

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

    set((state) => ({
      currentPrice: amount,
      bidHistory: [newBid, ...state.bidHistory].slice(0, 50),
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
