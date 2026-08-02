// レンダリング方針: CSR想定（リアルタイム更新が必要なため "use client" 前提）
"use client";

import { useAuctionStore } from "@/stores/auctionStore";
import type { Bid } from "@/types/auction";

function BidRow({ bid, index }: { bid: Bid; index: number }) {
  return (
    <li
      className={`flex items-center justify-between py-2 px-3 rounded-lg ${
        index === 0 ? "bg-indigo-50 border border-indigo-200" : "bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-2">
        {index === 0 && <span className="text-indigo-500 text-xs font-bold">最高値</span>}
        <span className="text-sm font-medium text-gray-700">{bid.userName}</span>
      </div>
      <div className="text-right">
        <span className="font-bold text-gray-900">¥{bid.amount.toLocaleString()}</span>
        <span className="block text-xs text-gray-400">
          {bid.timestamp.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </span>
      </div>
    </li>
  );
}

export function BidHistory() {
  const bidHistory = useAuctionStore((s) => s.bidHistory);
  const recent = bidHistory.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-sm font-semibold text-gray-500 mb-3">
        入札履歴（直近{Math.min(recent.length, 5)}件）
      </h2>
      {recent.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-4">まだ入札がありません</p>
      ) : (
        <ul className="space-y-2">
          {recent.map((bid, i) => (
            <BidRow key={bid.id} bid={bid} index={i} />
          ))}
        </ul>
      )}
    </div>
  );
}
