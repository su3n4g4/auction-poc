"use client";

import { useState } from "react";
import { useAuctionStore } from "@/features/bid/store/auctionStore";

export function useBidSubmit() {
  const [inputAmount, setInputAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const placeBid = useAuctionStore((s) => s.placeBid);
  const currentPrice = useAuctionStore((s) => s.currentPrice);

  const submitBid = () => {
    const amount = parseInt(inputAmount.replace(/,/g, ""), 10);

    if (isNaN(amount) || amount <= 0) {
      setError("有効な金額を入力してください");
      return;
    }

    const result = placeBid(amount);
    if (result.success) {
      setInputAmount("");
      setError(null);
    } else {
      setError(result.error ?? "入札に失敗しました");
    }
  };

  const suggestedAmount = currentPrice + 500;

  return {
    inputAmount,
    setInputAmount,
    error,
    setError,
    submitBid,
    suggestedAmount,
  };
}
