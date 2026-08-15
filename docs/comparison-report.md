# ディレクトリ構成パターン比較レポート

## 概要

ライブオークションアプリを題材に、3種のディレクトリ構成パターンを比較検証した結果をまとめる。

## 検証環境

- Next.js 15（App Router）
- TypeScript
- Tailwind CSS
- Zustand（状態管理）

## パターン別サマリー

（実装後に記入）

## 役割


| 役割           | Flat                         | 機能別                                      | FSD                                                                                 |
| ------------ | ---------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------- |
| 入札の状態        | `src/stores/auctionStore.ts` | `src/features/bid/store/auctionStore.ts` | `src/entities/auction/model/auctionStore.ts` + `src/entities/bid/model/bidStore.ts` |
| 入札フォームの制御    | `src/hooks/useBidSubmit.ts`  | `src/features/bid/hooks/useBidSubmit.ts` | `src/features/place-bid/model/useBidSubmit.ts`                                      |
| WebSocketモック | `src/lib/mockSocket.ts`      | `src/shared/lib/mockSocket.ts`           | `src/shared/lib/mockSocket.ts`                                                      |
| 画面の組み立て      | `src/app/auction/page.tsx`   | `src/app/auction/page.tsx`               | `src/widgets/auction-board/ui/AuctionBoard.tsx`                                     |




## 変更コスト計測結果

仮想シナリオ：「視聴者ランキング機能」を追加した場合の変更ファイル数


| パターン | 変更ファイル数 | 主な変更箇所                                                                                                                                                               |
| ---- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Flat | 4       | `types/auction.ts`、`stores/auctionStore.ts`、`components/ViewerRanking.tsx`（新規）、`app/auction/page.tsx`                                                                |
| 機能別  | 4       | `features/bid/types/auction.ts`、`features/bid/store/auctionStore.ts`、`features/bid/components/ViewerRanking.tsx`（新規）、`app/auction/page.tsx`                          |
| FSD  | 5       | `entities/bid/types.ts`、`entities/bid/model/bidStore.ts`、`entities/bid/ui/ViewerRanking.tsx`（新規）、`entities/bid/index.ts`、`widgets/auction-board/ui/AuctionBoard.tsx` |


FSDのみ+1ファイルとなったのは、`entities/bid`を上位レイヤー（widget）から使うために`index.ts`のexportを経由する必要があるため。Flat・機能別はページから直接パスでimportしており、exportでの呼び出しの更新が発生しない。

また、Flat・機能別は`updateViewerRanking`を純粋関数として切り出し、`placeBid`内で価格・入札履歴・ランキングを1回の`set()`にまとめて更新しているのに対し、FSDは`entities/auction`（価格・タイマー）と`entities/bid`（入札履歴・ランキング）が別ストアに分かれているため、`addBid`と`updateViewerRanking`が別々の`set()`呼び出しになっている。

## 結論・選定基準

（実装後に記入）