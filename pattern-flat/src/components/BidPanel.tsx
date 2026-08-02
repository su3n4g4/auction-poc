// レンダリング方針: CSR想定（リアルタイム更新が必要なため "use client" 前提）
"use client";

import { useAuctionStore } from "@/stores/auctionStore";
import { useBidSubmit } from "@/hooks/useBidSubmit";

export function BidPanel() {
  const currentPrice = useAuctionStore((s) => s.currentPrice);
  const remainingSeconds = useAuctionStore((s) => s.remainingSeconds);
  const { inputAmount, setInputAmount, error, submitBid, suggestedAmount } = useBidSubmit();

  const isEnded = remainingSeconds <= 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") submitBid();
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
      <div className="text-center border-b pb-4">
        <p className="text-sm text-gray-500 mb-1">現在価格</p>
        <p className="text-4xl font-bold text-indigo-600">
          ¥{currentPrice.toLocaleString()}
        </p>
      </div>

      {!isEnded ? (
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">¥</span>
              <input
                type="number"
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={suggestedAmount.toLocaleString()}
                className="w-full pl-7 pr-3 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <button
              onClick={submitBid}
              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 active:scale-95 transition-all"
            >
              入札
            </button>
          </div>

          <button
            onClick={() => {
              setInputAmount(String(suggestedAmount));
            }}
            className="w-full py-2 text-sm text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            推奨額 ¥{suggestedAmount.toLocaleString()} を入力
          </button>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500 font-medium">オークション終了</p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">
            落札価格: ¥{currentPrice.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
