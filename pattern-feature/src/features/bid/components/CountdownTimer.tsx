// レンダリング方針: CSR想定（リアルタイム更新が必要なため "use client" 前提）
"use client";

import { useAuctionStore } from "@/features/bid/store/auctionStore";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function CountdownTimer() {
  const remainingSeconds = useAuctionStore((s) => s.remainingSeconds);
  const isWarning = remainingSeconds <= 30 && remainingSeconds > 0;
  const isEnded = remainingSeconds <= 0;

  return (
    <div className="text-center">
      <p className="text-sm text-gray-500 mb-1">残り時間</p>
      <span
        className={`text-5xl font-mono font-bold tabular-nums transition-colors duration-300 ${
          isEnded
            ? "text-gray-400"
            : isWarning
            ? "text-red-500 animate-pulse"
            : "text-gray-800"
        }`}
      >
        {isEnded ? "終了" : formatTime(remainingSeconds)}
      </span>
      {isWarning && !isEnded && (
        <p className="text-red-500 text-sm mt-1 font-medium">まもなく終了！</p>
      )}
    </div>
  );
}
