# Architecture

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| フレームワーク | Next.js 16 (App Router) |
| ランタイム | React 19 / TypeScript 5 |
| スタイリング | Tailwind CSS v4（CSS 変数によるデザイントークン） |
| データストア | Upstash KV (`@vercel/kv`) |
| クライアントフェッチ | SWR |
| 認証 | `middleware.ts` によるシンプルな保護 |
| デプロイ | Vercel |

## ディレクトリ構成（現状）

```
life-os-dashboard/
├── app/                  Next.js App Router
│   ├── page.tsx          ルート（Overview）
│   ├── layout.tsx
│   ├── globals.css       デザイントークン・共通スタイル
│   ├── academic/         学業ページ
│   ├── finance/          家計ページ
│   ├── health/           健康ページ
│   └── api/              API ルート
│       ├── status/       生活ステータス取得
│       ├── calendar/     Google Calendar 取得
│       ├── issues/       GitHub Issues 取得
│       ├── close-issue/  Issue クローズ
│       └── webhook/      外部からの生活ログ書き込み
├── components/           UI コンポーネント
│   ├── layout/           app shell（Nav 等）
│   ├── dashboard/        旧ダッシュボード（Dashboard.tsx + 各 Panel）
│   ├── overview/         現メインビュー（Overview.tsx + 各 Section）
│   └── ui/               汎用 UI パーツ（ProgressBar 等）
├── lib/                  ドメインロジック
│   ├── types.ts          共通型
│   ├── kv.ts             Upstash KV ラッパ
│   ├── github.ts         GitHub API
│   └── google-calendar.ts Google Calendar API
├── constants/            定数
├── public/               静的アセット
├── docs/                 仕様・設計ドキュメント
├── middleware.ts         アクセス制御
└── next.config.ts
```

> 旧 `dashboard/` (Panel 系) と現 `overview/` (Section 系) の役割分担・最終的な統合は今後検討する。

## データフロー

### 1. 生活ログ（Status）

```
iOS ショートカット等
  └── POST /api/webhook  (action, token)
        └── lib/kv.updateTodayStatus()
              └── Upstash KV  key: status:YYYY-MM-DD
                    └── GET /api/status  →  Dashboard / Overview
```

- キー: `status:YYYY-MM-DD`（JST 基準、TTL 約 2 日）
- 認証: `WEBHOOK_SECRET` トークンで保護
- 対応アクション: `wakeup` / `sleep` / `exercise` / `outing` / `return` / `meal`

### 2. ミッション（GitHub Issues）

```
GitHub Issues
  └── lib/github.ts (GitHub REST API)
        └── GET /api/issues  →  IssuesPanel
        └── POST /api/close-issue  →  Issue クローズ
```

- ラベルでミッション種別を区別する想定（`urgent` / `goal` / `task` / `academic` / `finance` 等）

### 3. 予定（Google Calendar）

```
Google Calendar
  └── lib/google-calendar.ts
        └── GET /api/calendar  →  CalendarPanel
```

## 外部連携の方針

本プロジェクトはタスク管理・予定管理を中心に **複数の外部サービスと連携するハブ** として育てていく。連携先は将来的に増える可能性があるため、軽量なルールを設けておく。

### 原則

1. **無料枠で完結すること** — 有料 API・有料プランを前提にしない
2. **1 連携 = 1 ファイル** — `lib/<service>.ts`（例: `lib/github.ts`, `lib/google-calendar.ts`）に閉じ込める
3. **API ルートは薄く保つ** — 認証チェック → `lib/<service>` 呼び出し → JSON 返却。ロジックは `lib/` 側に置く
4. **シークレットは環境変数のみ** — `.env*` は git 管理対象外
5. **失敗時は静かに既定値を返す** — 1 連携の障害でダッシュボード全体が落ちないようにする（例: `lib/kv.ts` の try/catch パターン）
6. **画面側は連携先を知らない** — 画面は `lib/types.ts` の正規化された型だけを扱う

### スケール時の再編ルール

- 連携が **5 つを超えたら** `lib/integrations/<service>/` への再編を検討する
- それ以前は `lib/` 直下のフラット配置を維持する（過剰な抽象化を避ける）
- 同じサービスに対して読み取りと書き込みが両方ある場合のみ、個別フォルダ化を検討する

### 現在の連携先

| サービス | 用途 | 実装ファイル | 料金 |
|---------|------|-------------|------|
| GitHub | タスク管理（Issues） | `lib/github.ts` | 無料 |
| Google Calendar | 予定管理 | `lib/google-calendar.ts` | 無料 |
| Upstash KV | 生活ログ保存 | `lib/kv.ts` | 無料枠 |
| iOS ショートカット | 生活ログ入力 | `app/api/webhook/route.ts` | 無料 |

### 新しい連携を追加する手順

1. 無料枠で完結することを確認
2. `lib/<service>.ts` を作成し、認証・取得・整形を実装
3. 必要なら API ルートを `app/api/<service>/route.ts` として追加
4. 環境変数を `.env.local` に追加し、本書の「環境変数」表に記載
5. 上記の「現在の連携先」表に追記

## 環境変数

| 変数 | 用途 |
|------|------|
| `KV_*` | Upstash KV 接続情報 |
| `GITHUB_TOKEN` | GitHub API 認証 |
| `GOOGLE_*` | Google Calendar API 認証 |
| `WEBHOOK_SECRET` | `/api/webhook` のトークン認証 |

> `.env.local` に設定。`.env*` は `.gitignore` でコミット対象外。

## 主要な設計判断

- **個人運用前提**: 認証は最低限（middleware の単純なゲート）。マルチユーザー想定なし。
- **KV のみで完結**: RDB は持たない。日次キーで TTL を付け、長期データは別途設計予定。
- **App Router 専用**: Pages Router は使用しない。
- **Server Component を優先**、状態を持つものだけ `'use client'`。

## 未整理 / 検討中

- 旧 `components/dashboard/` と新 `components/overview/` の役割分担・最終的な統合
- ゲーミフィケーション要素の採否（→ `gamification-spec.md`）
- 長期データ（履歴・週次集計）の保存戦略
