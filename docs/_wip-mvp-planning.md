# [WIP] MVP 計画 — 再開用チェックポイント

> このファイルは作業中の検討メモ。MVP 仕様が確定したら `screens.md` に統合し、本ファイルは削除する。

## ここまでの背景

- プロジェクト仕様書（README / architecture / design-system / gamification-spec）を整備済み
- 「機能を詰め込みすぎて実装が遠のいている」という気付きから **MVP 優先** に方針転換
- 仕様書を「実装可能な最小セット」に絞ることで合意

## 確定した決定事項

### 1. MVP 対象画面（5 ページ）

| 画面 | 役割 | データソース |
|------|------|-------------|
| **Overview** | ハブ。Year Progress + Today's Tasks + Today's Schedule + 生活ログサマリー | 既存 |
| **Missions** (`/missions`) | Goals/Projects/Tasks/Details の階層を一元管理 | ハイブリッド（後述） |
| **Schedule** | 予定の全件表示 | Google Calendar |
| **Academic** | 単位進捗 + 科目区分別 | 静的 (`constants/academic.ts`) |
| **Health** | 今日の生活ログ表示 + 修正 | Webhook (Upstash KV) |

**将来実装に回す**: Finance（データソース未確定 + 個人情報リスク）

**Journal は廃止**: 紙ノートで運用するため、本プロジェクトには実装しない

### 2. 階層構造の発見

```
Goal → Project → Task → Detail
 大目標    プロジェクト    タスク    詳細
```

OKR / WBS と同じ考え方。**4 階層を 1 ページ（/tasks）で管理する**（別ページに分けない）。

### 3. Tasks 画面の UI = 案 B（ドリルダウン）

モバイル運用を MVP に含めるため。

```
[/tasks]                                  Goals 一覧
  ▶ 2026 年に新規事業を立ち上げる (3)
  ▶ 単位 50% 達成 (2)
                  ↓ タップ
[/tasks/goal/0a3f]                        ← Goals / 新規事業
  Projects
   ▶ 事業アイデアを固める (5 tasks)
                  ↓ タップ
[/tasks/project/1]                        ← Goals / 新規事業 / アイデア
  Tasks
   ☐ 市場調査
   ☐ ピッチ資料作成
                  ↓ タップ
[/tasks/task/42]                          ← .../ 市場調査
  Details
   ☑ 競合 5 社リストアップ
   ☐ ターゲット層インタビュー
```

パンくず navigation で常に階層位置がわかる。

### 4. データ保存先 = ハイブリッド（推奨案を提示済み・確認待ち）

| 階層 | 保存先 | 理由 |
|------|-------|------|
| **Goal** | Upstash KV (`goals:{id}`) | 数が少ない（年に数個）。GitHub に対応概念がない |
| **Project** | GitHub Milestone | Milestone は元々「複数 Issue を束ねる」概念。締切も付く |
| **Task** | GitHub Issue（Milestone に紐付け） | 既存。GitHub モバイルアプリで編集可能 |
| **Detail** | Issue body の `- [ ]` チェックリスト | Markdown 標準。モバイルでもチェック可 |

**モバイル運用との相性が抜群**:
- Tasks/Details の編集は **GitHub モバイルアプリで完結**
- ダッシュボードは「ビュー専用」+ Goals 追加だけ実装
- → MVP の実装量が劇的に軽くなる

### 5. その他の決定

- **デザイン**: モダン × ダークベース（Dovetail スタイル維持）
- **無料縛り**: 連携先は無料枠のみ
- **ナビゲーション**: 横並びナビ（案 A）
- **Year Progress**: Hero に維持（モチベーション喚起）
- **タスク見せ方**: B + A 組み合わせ（Things 流 3 階層 + Sunsama 流 Today フォーカス）
- **予定見せ方**: 今日の時系列のみ
- **アクセス頻度**: Tasks 1回/日、Schedule 1回/日（他は未確定だが MVP には影響なし）

## 確定した回答（2026-04-08）

### Q1. ハイブリッド方針 → ✅ 確定
「Goal=KV / Project=Milestone / Task=Issue / Detail=checkbox」で進める。

### Q2. MVP の編集機能スコープ → ✅ 確定
**読み取り専用 + Goals だけ追加可能**。
Tasks/Projects/Details の編集は GitHub モバイルアプリに委譲する。
後から必要なら Detail のチェックトグル等を追加。

### Q3. /tasks 画面の名前 → ✅ `/missions` に決定
ゲーミフィケーション要素との相性、および「Goal も含む階層全体」を表現するため。

### Q4. screens.md の最終構成 → ✅ 完了
`docs/screens.md` を MVP 仕様 + 将来実装案の 2 セクション構成で書き直し済み。

## 進行中のコード変更

ブランチ `ui-redesign` 上に未コミットの変更がある:

- **Overview の 1 画面化作業（途中）**:
  - `HeroSection.tsx`: 100vh 占有 → コンパクトヘッダー化
  - `Overview.tsx`: 12-col grid レイアウト
  - 各 `*Section.tsx`: padding / フォント縮小、`mb-16` → grid gap
- **これらの変更は MVP 仕様に合わせて再構成する必要がある**
  - 現状の Today/Status/Quests/Gold/Week/Activity セクションは MVP 仕様にそぐわない
  - Overview は「Year Progress + Today's Tasks + Today's Schedule + 生活ログサマリー」に絞る
  - 旧セクションの大半は削除 or サブページへ移動

## 次にやること（再開時の手順）

1. **本ファイル（_wip-mvp-planning.md）と進行中の差分を確認**
2. **未確定の質問 Q1〜Q4 を順に解決**
3. `screens.md` を MVP 仕様で全面書き直し
4. Overview / Tasks / Schedule / Academic / Health の実装に着手
5. MVP が完成したら本ファイルを削除し、`screens.md` に統合

## 関連ドキュメント

- `docs/README.md` — プロジェクト全体像
- `docs/architecture.md` — 技術構成・外部連携の方針
- `docs/screens.md` — 画面仕様（**MVP 仕様で書き直す予定**）
- `docs/design-system.md` — UI トークン
- `docs/gamification-spec.md` — ゲーミフィケーション検討メモ
- `AGENTS.md` — フォルダ配置・作業ルール
