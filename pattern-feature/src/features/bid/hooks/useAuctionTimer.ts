"use client";

import { useEffect } from "react";
import { useAuctionStore } from "@/features/bid/store/auctionStore";

export function useAuctionTimer() {
  const tickTimer = useAuctionStore((s) => s.tickTimer);
  const remainingSeconds = useAuctionStore((s) => s.remainingSeconds);

  useEffect(() => {
    if (remainingSeconds <= 0) return;

    const intervalId = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [tickTimer, remainingSeconds]);
}
