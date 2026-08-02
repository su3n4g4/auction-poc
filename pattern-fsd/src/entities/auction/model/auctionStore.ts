import { create } from "zustand";
import type { AuctionState, AuctionActions } from "../types";

const EXTENSION_THRESHOLD_SECONDS = 30;
const EXTENSION_DURATION_SECONDS = 30;
const INITIAL_PRICE = 10000;
const INITIAL_SECONDS = 120;

type AuctionStore = AuctionState & AuctionActions;

export const useAuctionStore = create<AuctionStore>((set, get) => ({
  currentPrice: INITIAL_PRICE,
  remainingSeconds: INITIAL_SECONDS,
  extensionCount: 0,
  showExtensionNotice: false,

  acceptBid: (amount: number) => {
    const { currentPrice, remainingSeconds } = get();

    if (amount <= currentPrice) {
      return {
        success: false,
        error: `現在価格（¥${currentPrice.toLocaleString()}）より高い金額を入力してください`,
        extended: false,
      };
    }

    const shouldExtend = remainingSeconds <= EXTENSION_THRESHOLD_SECONDS;

    set((state) => ({
      currentPrice: amount,
      remainingSeconds: shouldExtend
        ? state.remainingSeconds + EXTENSION_DURATION_SECONDS
        : state.remainingSeconds,
      extensionCount: shouldExtend ? state.extensionCount + 1 : state.extensionCount,
      showExtensionNotice: shouldExtend ? true : state.showExtensionNotice,
    }));

    return { success: true, extended: shouldExtend };
  },

  tickTimer: () => {
    set((state) => ({
      remainingSeconds: Math.max(0, state.remainingSeconds - 1),
    }));
  },

  dismissExtensionNotice: () => {
    set({ showExtensionNotice: false });
  },
}));
