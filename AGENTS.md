<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# プロジェクトドキュメント

作業を始める前に `docs/` 配下を確認すること。

- `docs/README.md` — プロジェクトの目的・スコープ・中核機能
- `docs/architecture.md` — 技術構成・データフロー・**外部連携の方針**
- `docs/screens.md` — **各画面の責務・載せる要素・データソース**
- `docs/design-system.md` — UI トークン・コンポーネント原則
- `docs/gamification-spec.md` — ゲーミフィケーション要素の検討メモ（**検討中**）

# フォルダ配置ルール

新しいファイルを追加するときは、以下のルールに従って配置すること。
ルールに当てはまらない種類のファイルが必要になった場合は、**先に本書を更新してから** 追加する。

## ディレクトリの役割

| ディレクトリ | 配置するもの |
|------------|------------|
| `app/` | Next.js App Router のページ・レイアウト・API ルート |
| `app/api/<service>/` | 外部連携の API ルート（薄く保つ。ロジックは `lib/` 側に） |
| `components/` | UI コンポーネント（再編予定。詳細は下記） |
| `lib/` | ドメインロジック・外部連携アダプタ・共通型 |
| `lib/<service>.ts` | 1 連携 = 1 ファイル（例: `github.ts`, `google-calendar.ts`, `kv.ts`） |
| `constants/` | 定数 |
| `public/` | 静的アセット |
| `docs/` | 仕様書・設計ドキュメント |

## ルート直下に置いてよいもの

設定ファイルのみ（`package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `middleware.ts`, `next-env.d.ts`, `README.md`, `AGENTS.md`, `CLAUDE.md`, `.gitignore` 等）。

それ以外（メモ・スクリプト・一時ファイル等）をルート直下に置かない。

## 外部連携の追加

外部サービスを連携するときは `docs/architecture.md` の「外部連携の方針」に従う:

1. **無料枠で完結すること**
2. **1 連携 = 1 ファイル** を `lib/<service>.ts` として作成
3. API ルートは `app/api/<service>/route.ts` に薄く実装（認証 → `lib/` 呼び出し → JSON 返却）
4. 環境変数を `.env.local` に追加し、`docs/architecture.md` の環境変数表に記載
5. `docs/architecture.md` の「現在の連携先」表に追記

## components/ の配置

```
components/
├── layout/        app shell（Nav 等、全画面で共有される枠）
├── dashboard/     旧ダッシュボード（Panel ベース・Dashboard.tsx + 各 Panel）
├── overview/      現メインビュー（Section ベース・Overview.tsx + 各 Section）
└── ui/            汎用 UI パーツ（ProgressBar 等、特定画面に紐付かないもの）
```

新規コンポーネントを追加する際の判断基準:

- **全画面で共通の枠**（ナビ・フッタ等） → `layout/`
- **特定のページ・ビュー専用** → そのビュー名のフォルダ（例: `overview/`）。新しいビューを作る場合は新しいフォルダを切る
- **再利用可能な汎用パーツ** → `ui/`

`components/` 直下にファイルを直接置かない（必ずいずれかのサブフォルダに入れる）。

# UI / デザイン

- スタイルを書く前に `app/globals.css` の **デザイントークン** と **共通クラス**（`.card` `.btn-primary` 等）を確認する
- 新しい色や寸法を直接書かず、トークンを参照する
- 詳細は `docs/design-system.md` を参照
- 「やらないこと」（ネオン演出・多色配色・カスタムフォント追加等）を守る

# 作業の進め方

- 大きな変更は事前に確認を取る（破壊的操作・大規模リファクタ・依存追加など）
- `.env*` や認証情報をコミットしない
- `main` ブランチに直接 push しない
- 不明点があれば作業を止めて確認する
