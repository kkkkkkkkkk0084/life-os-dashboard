# Life OS Dashboard

> *This is what I do.*

## プロジェクトの目的

**タスク管理** と **予定管理** を中核に、外部サービスから集めた自分の活動データを 1 画面に集約し、毎日の状態を把握しながら自己管理を行うための **個人専用ダッシュボード** 。

> 自分専用ツールとして運用する。将来的に需要があれば商品化する可能性は残すが、現段階では考慮しない。

## 中核となる機能

1. **タスク管理** — GitHub Issues を主データソースとして、当日のミッションを表示・完了操作する
2. **予定管理** — Google カレンダーから当日／今後の予定を取得して表示する
3. **生活ログ** — iOS ショートカット等から Webhook 経由で起床・就寝・運動・食事などを記録する
4. **サブ領域** — 学業（取得単位）、家計（収支）、健康（生活ログの集計）を補助的に集約

## 設計の前提

- **個人運用 1 名** — マルチユーザー想定なし
- **無料縛り** — 連携する外部サービスは原則として無料枠で完結すること（GitHub / Google Calendar / Upstash KV / Vercel など）
- **外部連携が中核** — 単体で完結せず、既存サービスをハブのように繋ぐ位置付け
- **運用環境**: Vercel + Upstash KV

## 画面構成

| 画面 | 役割 |
|------|------|
| `/` (Overview) | 1 日の全体サマリー（Hero / Today / Status / Quests / Gold / Week / Activity セクション） |
| `/academic` | 学業情報 |
| `/finance` | 家計情報 |
| `/health` | 健康情報 |

API ルート（`app/api/`）:

| ルート | 用途 |
|--------|------|
| `GET /api/status` | 当日の生活ステータスを取得 |
| `GET /api/calendar` | Google カレンダーの予定を取得 |
| `GET /api/issues` | GitHub Issues 一覧を取得 |
| `POST /api/close-issue` | Issue をクローズ |
| `POST /api/webhook` | 外部トリガー（iOS ショートカット等）から生活ログを書き込み |

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router) / React 19
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS v4（CSS 変数ベースのデザイントークン）
- **データストア**: Upstash KV (`@vercel/kv`)
- **データフェッチ**: SWR
- **外部 API**: GitHub REST API / Google Calendar API
- **デプロイ**: Vercel

## ドキュメント構成

| ファイル | 内容 |
|---------|------|
| `README.md` | 本書。プロジェクト全体像 |
| `architecture.md` | 技術構成・データフロー・ディレクトリ構成 |
| `screens.md` | 各画面の責務・載せる要素・データソース |
| `design-system.md` | UI 方針・カラー・タイポ・コンポーネント原則 |
| `gamification-spec.md` | ゲーミフィケーション要素の検討メモ（**検討中**） |

## 開発

```bash
npm run dev      # 開発サーバー
npm run build    # ビルド
npm run lint     # Lint
```

必要な環境変数は `.env.local` に設定する（`.env*` は git 管理対象外）。
