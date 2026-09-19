# ディレクトリ構成パターン比較レポート

## 概要

ライブオークションアプリを題材に、3種のディレクトリ構成パターンを比較検証した結果をまとめる。

## 検証環境

- Next.js 16.2.9（App Router）
- React 19.2.4
- TypeScript 5
- Tailwind CSS v4
- Zustand 5（状態管理）

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

仮想シナリオ：「入札者ランキング機能」を追加した場合の変更ファイル数


| パターン | 変更ファイル数 | 主な変更箇所                                                                                                                                                               |
| ---- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Flat | 4       | `types/auction.ts`、`stores/auctionStore.ts`、`components/BidderRanking.tsx`（新規）、`app/auction/page.tsx`                                                                |
| 機能別  | 4       | `features/bid/types/auction.ts`、`features/bid/store/auctionStore.ts`、`features/bid/components/BidderRanking.tsx`（新規）、`app/auction/page.tsx`                          |
| FSD  | 5       | `entities/bid/types.ts`、`entities/bid/model/bidStore.ts`、`entities/bid/ui/BidderRanking.tsx`（新規）、`entities/bid/index.ts`、`widgets/auction-board/ui/AuctionBoard.tsx` |


FSDのみ+1ファイルとなったのは、`entities/bid`を上位レイヤー（widget）から使うために`index.ts`のexportを経由する必要があるため。Flat・機能別はページから直接パスでimportしており、exportでの呼び出しの更新が発生しない。

状態設計は3パターンで統一し、ランキングはストアに保持せず`bidHistory`から導出する方式とした（`calcBidderRanking`を純粋関数としてストアファイルに置き、コンポーネントで`useMemo`により`bidHistory`の変化時のみ再計算）。そのためストアへの変更は関数の追加のみで、`placeBid`/`addBid`などの更新処理には手を入れていない。比較の差分はディレクトリ構成（ファイルの置き場所とexport経路）の違いだけになる。

- 導出元の`bidHistory`は直近50件で切り詰められているため、ランキングも直近50件の入札に基づく集計になる。
- Zustand v5 ではセレクタが毎回新しい配列を返すと`useSyncExternalStore`が無限再レンダリングを起こすため、`useStore(state => calc(state))`ではなく`useMemo`で計算している。

## 結論・選定基準

（実装後に記入）