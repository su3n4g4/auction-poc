// レンダリング方針: CSR想定（リアルタイム更新が必要なため "use client" 前提）
"use client";

import { useBidStore } from "../model/bidStore";
import type { BidStatusByUser } from "../types";

function RankingRow({ ranking, index }: { ranking: BidStatusByUser; index: number }) {
  return (
    <li
      className={`flex items-center justify-between py-2 px-3 rounded-lg ${
        index === 0 ? "bg-indigo-50 border border-indigo-200" : "bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-2">
        {index === 0 && <span className="text-indigo-500 text-xs font-bold">最高値</span>}
        <span className="text-sm font-medium text-gray-700">{ranking.userName}</span>
      </div>
      <div className="text-right">
        <span className="font-bold text-gray-900">¥{ranking.maxAmount.toLocaleString()}</span>
        <span className="block text-xs text-gray-400">
          {ranking.count}回
        </span>
      </div>
    </li>
  );
}

export function ViewerRanking() {
  const viewerRanking = useBidStore((s) => s.viewerRanking);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-sm font-semibold text-gray-500 mb-3">
        入札回数ランキング
      </h2>
      {viewerRanking.slice(0, 5).length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-4">まだ入札がありません</p>
      ) : (
        <ul className="space-y-2">
          {viewerRanking.slice(0, 5). map((ranking, i) => (
            <RankingRow key={ranking.userName} ranking={ranking} index={i} />
          ))}
        </ul>
      )}
    </div>
  );
}
