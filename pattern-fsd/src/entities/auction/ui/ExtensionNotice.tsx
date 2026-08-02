// レンダリング方針: CSR想定（リアルタイム更新が必要なため "use client" 前提）
"use client";

import { useEffect } from "react";
import { useAuctionStore } from "../model/auctionStore";

export function ExtensionNotice() {
  const showExtensionNotice = useAuctionStore((s) => s.showExtensionNotice);
  const extensionCount = useAuctionStore((s) => s.extensionCount);
  const dismissExtensionNotice = useAuctionStore((s) => s.dismissExtensionNotice);

  useEffect(() => {
    if (!showExtensionNotice) return;
    const timer = setTimeout(() => dismissExtensionNotice(), 3000);
    return () => clearTimeout(timer);
  }, [showExtensionNotice, dismissExtensionNotice]);

  if (!showExtensionNotice) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-bounce">
      <div className="bg-orange-500 text-white px-6 py-3 rounded-full shadow-lg font-bold text-sm flex items-center gap-2">
        <span>⏰</span>
        <span>30秒延長！（延長{extensionCount}回目）</span>
      </div>
    </div>
  );
}
