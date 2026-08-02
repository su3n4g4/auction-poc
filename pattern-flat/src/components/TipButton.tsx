// レンダリング方針: CSR想定（リアルタイム更新が必要なため "use client" 前提）
// スタブ実装: バックエンド通信なし。投げ銭回数のみローカルstateで管理。
"use client";

import { useState } from "react";

const TIP_EMOJIS = ["🎉", "💰", "👏", "🔥", "✨"];

export function TipButton() {
  const [tipCount, setTipCount] = useState(0);
  const [floatingEmoji, setFloatingEmoji] = useState<string | null>(null);

  const handleTip = () => {
    const emoji = TIP_EMOJIS[Math.floor(Math.random() * TIP_EMOJIS.length)];
    setFloatingEmoji(emoji);
    setTipCount((c) => c + 1);
    setTimeout(() => setFloatingEmoji(null), 1000);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleTip}
        className="px-4 py-2 bg-yellow-400 text-yellow-900 font-bold rounded-full hover:bg-yellow-500 active:scale-95 transition-all text-sm shadow"
      >
        投げ銭 💸
        {tipCount > 0 && (
          <span className="ml-1 text-xs opacity-70">×{tipCount}</span>
        )}
      </button>

      {floatingEmoji && (
        <span
          className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl animate-bounce pointer-events-none"
          key={tipCount}
        >
          {floatingEmoji}
        </span>
      )}
    </div>
  );
}
