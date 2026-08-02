# poc-auction

フロントエンドのディレクトリ構成パターン比較PoC。
ライブオークションアプリ（入札・投げ銭・コメント）を題材に、3種の構成を比較検証する。

## 比較パターン

| パターン | ディレクトリ | ポート |
|---|---|---|
| Flat構成 | pattern-flat/ | 3001 |
| 機能別構成 | pattern-feature/ | 3002 |
| FSD | pattern-fsd/ | 3003 |

## 起動方法

各パターンのディレクトリに移動して起動：
```bash
cd pattern-flat && npm install && npm run dev
```

## パターン別ディレクトリ構造

各ディレクトリは独立した Next.js アプリ（`package.json`・`node_modules` 別）。

### pattern-flat — 種別ごとにフラット分類

```
src/
  components/   # 全コンポーネント
  hooks/        # 全カスタムフック
  stores/       # 全 Zustand ストア
  lib/          # ユーティリティ・外部連携
  types/        # 型定義
  app/          # Next.js App Router
```

### pattern-feature — 機能ごとに凝集

```
src/
  features/
    bid/        # 入札（components / hooks / store / types）
    tip/        # 投げ銭（components）
    comment/    # コメント（components / types）
  shared/lib/   # 機能横断の共通ロジック
  app/          # Next.js App Router
```

### pattern-fsd — Feature-Sliced Design

```
src/
  shared/       # フレームワーク非依存の汎用ロジック
  entities/     # ビジネスエンティティ（auction / bid）
  features/     # ユーザーアクション（place-bid / send-tip / post-comment）
  widgets/      # 複数 feature を束ねる複合UI（auction-board）
  app/          # Next.js App Router
```

依存方向: `app → widgets → features → entities → shared`（下位レイヤーは上位を import しない）  
各スライスの外部参照は `index.ts` 経由のみ。

## 実装スコープ

- **Tier 1（フル実装）**: 入札 + 自動延長
- **Tier 2（スタブ）**: 投げ銭・コメント

## 検証観点

`docs/verification-checklist.md` を参照。比較結果は `docs/comparison-report.md` に記入。
