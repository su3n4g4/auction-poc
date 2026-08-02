// レンダリング方針: CSR想定（リアルタイム更新が必要なため "use client" 前提）
"use client";

import { useState } from "react";
import { useAuctionStore } from "@/entities/auction";
import { useBidStore } from "@/entities/bid";

export function useBidSubmit() {
  const [inputAmount, setInputAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  const acceptBid = useAuctionStore((s) => s.acceptBid);
  const currentPrice = useAuctionStore((s) => s.currentPrice);
  const addBid = useBidStore((s) => s.addBid);

  const submitBid = () => {
    const amount = parseInt(inputAmount.replace(/,/g, ""), 10);

    if (isNaN(amount) || amount <= 0) {
      setError("有効な金額を入力してください");
      return;
    }

    const result = acceptBid(amount);
    if (result.success) {
      addBid({
        id: crypto.randomUUID(),
        userName: "あなた",
        amount,
        timestamp: new Date(),
      });
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
