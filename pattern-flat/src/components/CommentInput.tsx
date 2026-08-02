// レンダリング方針: CSR想定（リアルタイム更新が必要なため "use client" 前提）
// スタブ実装: APIなし。送信したコメントを親から渡されたコールバックで追加する。
"use client";

import { useState } from "react";

interface CommentInputProps {
  onSubmit: (text: string) => void;
}

export function CommentInput({ onSubmit }: CommentInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="コメントを入力..."
        maxLength={100}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 active:scale-95 transition-all"
      >
        送信
      </button>
    </div>
  );
}
