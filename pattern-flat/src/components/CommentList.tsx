// レンダリング方針: CSR想定（リアルタイム更新が必要なため "use client" 前提）
// スタブ実装: 永続化なし。5件のダミーコメントを初期表示。
"use client";

import type { Comment } from "@/types/auction";

interface CommentListProps {
  comments: Comment[];
}

export function CommentList({ comments }: CommentListProps) {
  return (
    <ul className="space-y-2 max-h-48 overflow-y-auto">
      {comments.map((comment) => (
        <li key={comment.id} className="flex gap-2 text-sm">
          <span className="font-medium text-gray-700 shrink-0">{comment.userName}</span>
          <span className="text-gray-600">{comment.text}</span>
        </li>
      ))}
    </ul>
  );
}
