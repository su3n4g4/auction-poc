// レンダリング方針（商品基本情報）: SSR想定（静的データのため）
// ただし今回はモック固定値で表現し、実際のSSRフェッチは省略
// AuctionBoardウィジェットに委譲しているため、このページ自体はサーバーコンポーネント。

import { AuctionBoard } from "@/widgets/auction-board/ui/AuctionBoard";

export default function AuctionPage() {
  return <AuctionBoard />;
}
