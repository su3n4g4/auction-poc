// レンダリング方針（商品基本情報）: SSR想定（静的データのため）
// ただし今回はモック固定値で表現し、実際のSSRフェッチは省略

"use client";

import { useEffect, useState } from "react";
import { useAuctionStore } from "@/stores/auctionStore";
import { useAuctionTimer } from "@/hooks/useAuctionTimer";
import { startMockSocket } from "@/lib/mockSocket";
import { BidPanel } from "@/components/BidPanel";
import { BidHistory } from "@/components/BidHistory";
import { CountdownTimer } from "@/components/CountdownTimer";
import { ExtensionNotice } from "@/components/ExtensionNotice";
import { TipButton } from "@/components/TipButton";
import { CommentInput } from "@/components/CommentInput";
import { CommentList } from "@/components/CommentList";
import type { Comment } from "@/types/auction";
import { ViewerRanking } from "@/components/ViewerRanking";

const DUMMY_COMMENTS: Comment[] = [
  { id: "d1", userName: "山田さん", text: "これ欲しかったやつ！", timestamp: new Date() },
  { id: "d2", userName: "中村さん", text: "いい商品ですね", timestamp: new Date() },
  { id: "d3", userName: "小林さん", text: "頑張って！", timestamp: new Date() },
  { id: "d4", userName: "加藤さん", text: "もっと上がりそう", timestamp: new Date() },
  { id: "d5", userName: "渡辺さん", text: "ウォッチしてます", timestamp: new Date() },
];

export default function AuctionPage() {
  useAuctionTimer();

  const [comments, setComments] = useState<Comment[]>(DUMMY_COMMENTS);

  const addComment = (text: string) => {
    const newComment: Comment = {
      id: crypto.randomUUID(),
      userName: "あなた",
      text,
      timestamp: new Date(),
    };
    setComments((prev) => [newComment, ...prev]);
  };

  useEffect(() => {
    const stop = startMockSocket(
      () => useAuctionStore.getState().currentPrice,
      ({ userName, amount }) => {
        useAuctionStore.getState().placeBid(amount, userName);
      }
    );
    return stop;
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">
      <ExtensionNotice />

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        {/* 商品情報（SSR想定の静的エリア） */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mb-4">
            <span className="text-6xl">🖼️</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">希少ヴィンテージ時計 Ref.1234</h1>
          <p className="text-sm text-gray-500 mt-1">1960年代製造。状態良好。証明書付き。</p>
        </div>

        {/* カウントダウン */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <CountdownTimer />
        </div>

        {/* 入札パネル */}
        <BidPanel />

        {/* 入札履歴 */}
        <BidHistory />

        {/* 入札回数ランキング */}
        <ViewerRanking />

        {/* 投げ銭・コメント */}
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-500">コメント・応援</h2>
            <TipButton />
          </div>
          <CommentInput onSubmit={addComment} />
          <CommentList comments={comments} />
        </div>
      </div>
    </main>
  );
}
