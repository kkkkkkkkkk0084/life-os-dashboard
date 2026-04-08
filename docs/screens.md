# Screen Specifications

各画面の責務・載せる要素・データソースを定義する。
コンポーネントや UI 実装はこの仕様を元に決定すること。

> **このドキュメントは MVP 仕様**です。将来実装する案は末尾の「将来実装案」セクションにまとめています。

---

## 設計原則

- 最重要情報を最大・左上に置く（hierarchy）
- 1 画面の情報量を抑え、詳細はサブページへ
- サブページは「カテゴリの全情報」を持ち、Overview とは情報の重複を最小化
- ウィジェット過多を避ける
- **MVP は実装量を最小化する**: 編集機能は最小限、読み取り中心

---

## MVP 対象画面（5 ページ）

| 画面 | パス | 役割 |
|------|------|------|
| Overview | `/` | ハブ。今日やること・今日の予定・今年の進捗・生活ログサマリー |
| Missions | `/missions` | Goal → Project → Task → Detail の 4 階層を一元管理 |
| Schedule | `/schedule` | 予定の全件表示 |
| Academic | `/academic` | 単位進捗 + 科目区分別 |
| Health | `/health` | 今日の生活ログ表示 |

> **Finance は将来実装に回す**（データソース未確定 + 個人情報リスク）
> **Journal は実装しない**（紙ノートで運用）

---

## Overview (`/`)

### 役割
その日に **何をやるか / 何をやったか** を一目で把握する中核ハブ。
詳細はサブページに任せ、Overview は **タスク + 予定 + 年次進捗 + 生活ログサマリー** に集中する。

### 載せるもの
1. **Hero**
   - 挨拶（Good morning, Kei 等）
   - **Year Progress ウィジェット**（今年の経過率を %・バーで表示）
2. **Today's Tasks** — Missions の Task のうち、今日のフォーカス対象（Sunsama 流）
3. **Today's Schedule** — Google Calendar の当日予定（時系列）
4. **生活ログサマリー** — 起床 / 就寝 / 運動 / 食事の最小限表示

### 載せないもの
- Goal/Project の階層構造（→ Missions）
- 当日以外の予定（→ Schedule）
- 学業 / 健康の詳細データ（→ 各サブページ）
- パラメーター（HP/MP 等。ゲーミフィケーション要素は検討中）

### データソース
| 要素 | ソース |
|------|-------|
| Today's Tasks | GitHub Issues (`lib/github.ts`) — 「今日」フラグの判定方法は実装時に決める |
| Today's Schedule | Google Calendar (`lib/google-calendar.ts`) |
| Year Progress | クライアント側で `Date` から計算（外部依存なし） |
| 生活ログサマリー | Upstash KV `status:YYYY-MM-DD`（既存 Webhook） |

### 1 画面表示
Overview は 1 画面（スクロールなし）に収めることを目指す。

---

## Missions (`/missions`)

### 役割
Goal / Project / Task / Detail の **4 階層を一元管理する画面**。
OKR / WBS と同じ考え方で、年単位の大目標から日々のチェック項目まで連続的に扱う。

```
Goal → Project → Task → Detail
 大目標    プロジェクト    タスク    詳細
```

### 階層とデータ保存先（ハイブリッド方針）

| 階層 | 保存先 | 理由 |
|------|-------|------|
| **Goal** | Upstash KV (`goals:{id}`) | 数が少ない（年に数個）。GitHub に対応概念がない |
| **Project** | GitHub Milestone | Milestone は元々「複数 Issue を束ねる」概念。締切も付く |
| **Task** | GitHub Issue（Milestone に紐付け） | 既存。GitHub モバイルアプリで編集可能 |
| **Detail** | Issue body の `- [ ]` チェックリスト | Markdown 標準。モバイルでもチェック可 |

### UI = ドリルダウン

モバイル運用を MVP に含めるための判断。

```
[/missions]                               Goals 一覧
  ▶ 2026 年に新規事業を立ち上げる (3)
  ▶ 単位 50% 達成 (2)
                  ↓ タップ
[/missions/goal/0a3f]                     ← Missions / 新規事業
  Projects（=Milestone 一覧）
   ▶ 事業アイデアを固める (5 tasks)
                  ↓ タップ
[/missions/project/1]                     ← Missions / 新規事業 / アイデア
  Tasks（=Issue 一覧）
   ☐ 市場調査
   ☐ ピッチ資料作成
                  ↓ タップ
[/missions/task/42]                       ← .../ 市場調査
  Details（=Issue body checkbox）
   ☑ 競合 5 社リストアップ
   ☐ ターゲット層インタビュー
```

パンくずナビゲーションで常に階層位置がわかる。

### MVP の編集スコープ

**読み取り専用 + Goals だけ追加可能**。

| 操作 | MVP で実装する？ | 代替手段 |
|------|----------------|---------|
| Goal の追加 / 編集 / 削除 | ✅ 実装する | — |
| Project の追加 / 編集 | ❌ しない | GitHub Web で Milestone 作成 |
| Task の追加 / 編集 / クローズ | ❌ しない | **GitHub モバイルアプリ** |
| Detail のチェック | ❌ しない | **GitHub モバイルアプリ** |
| Goal ↔ Project の紐付け | ✅ 実装する | KV 内に Milestone ID を保存 |

> 編集を GitHub アプリに委譲することで、MVP の実装量を劇的に軽くする。
> 後から必要なら Detail のチェックトグル等を追加していく。

### 載せないもの
- 完了済み Goal/Project のアーカイブビュー（→ 将来）
- 期限切れアラート（→ 将来）
- 進捗率の自動計算（→ 将来。MVP は手動 or 子要素数の単純カウント）

### データソース
| 要素 | ソース |
|------|-------|
| Goals | Upstash KV (`goals:{id}` および `goals:list`) |
| Projects | GitHub Milestones (`lib/github.ts`) |
| Tasks | GitHub Issues (`lib/github.ts`) |
| Details | Issue body の Markdown checkbox（パース） |

---

## Schedule (`/schedule`)

### 役割
Google Calendar の予定を **全件表示** する画面。Overview の「Today's Schedule」より広い範囲を扱う。

### 載せるもの
1. **当日の時系列ビュー**
2. **今後数日〜数週間の予定リスト**
3. **カレンダー切り替え**（複数カレンダーがある場合。MVP では未対応で良い）

### 載せないもの
- 予定の追加・編集（Google Calendar アプリに委譲）
- リマインダー設定

### データソース
| 要素 | ソース |
|------|-------|
| 予定 | Google Calendar API (`lib/google-calendar.ts`) |

### MVP の編集スコープ
**読み取り専用**。追加・編集は Google Calendar アプリで行う。

---

## Academic (`/academic`)

### 役割
学業の進捗を集約する。

### 載せるもの
1. **単位取得進捗** — 取得済み / 残り / 進捗率 / 卒業目標年
2. **科目区分別の進捗** — 総合教育 / 専門教育 / 卒業論文

### 載せないもの
- 学業タスクの一覧（→ Missions に統合。`academic` ラベルで絞り込めば良い）
- 学業予定の一覧（→ Schedule）

### データソース
| 要素 | ソース |
|------|-------|
| 単位進捗 | `constants/academic.ts`（静的） |

> 将来的に「学習時間ログ」を Webhook で記録することも検討（仕様確定後）。

---

## Health (`/health`)

### 役割
今日の生活ログを表示・確認する。

### 載せるもの
1. **今日の生活ログ** — 起床 / 就寝 / 運動 / 食事 / 外出 / 帰宅
2. **ログの簡易修正 UI**（既存実装を踏襲）

### 載せないもの
- 週次・月次の習慣スコア（→ 将来）
- 睡眠リズムのグラフ（→ 将来）
- 長期保存データの集計（→ 将来。KV のキー設計から見直しが必要）

### データソース
| 要素 | ソース |
|------|-------|
| 今日の生活ログ | Upstash KV `status:YYYY-MM-DD`（既存 Webhook） |

> 現状の KV キーは TTL 約 2 日。長期データを扱うには別キー設計が必要（→ `architecture.md` の未整理項目）。

---

## 共通要素（全画面）

- **ナビゲーション** — `components/layout/Nav.tsx`（5 画面切り替え: Overview / Missions / Schedule / Academic / Health）
- **デザイントークン** — `app/globals.css`（→ `design-system.md`）

---

## 旧 Dashboard との関係

`components/dashboard/` 配下（旧 Panel 系）は本仕様で完全に置き換わる。
旧コードは段階的に削除する予定。

`components/overview/` 配下の旧セクション（Today/Status/Quests/Gold/Week/Activity）は MVP 仕様に合わせて再構成する。大半は削除 or サブページへ移動。

---

## 将来実装案

MVP に含めず、後から追加検討する項目をここに集める。

### Finance (`/finance`)

家計の状態を集約する画面。**個人情報のため外部 API 連携は基本行わない**。

- 月次収支サマリー
- 今日の支出記録
- 今後の大きな支出
- 固定費の内訳

データ入力経路は iOS ショートカット → Webhook → Upstash KV を想定。
マネーフォワード等の外部家計簿サービスとの自動連携は **行わない**（個人情報リスク）。

### Missions の編集機能拡張

- Detail のチェックトグル（ダッシュボード単体で生活ログレベルの操作を完結）
- Project（Milestone）の作成・編集
- Task（Issue）のクイック作成
- 進捗率の自動計算（Detail 完了率 → Task → Project → Goal）
- 完了済み Goal/Project のアーカイブビュー
- 期限切れアラート

### Health の長期データ

- 週次・月次の習慣スコア（起床時刻のブレ、運動継続日数等）
- 睡眠リズムの推移グラフ
- 食事・運動の集計

長期保存のため Upstash KV のキー設計を見直す必要あり。

### Academic の学習時間ログ

Webhook 経由で学習開始・終了を記録し、科目別の学習時間を可視化する。

### ゲーミフィケーション要素

`docs/gamification-spec.md` 参照。HP/MP・経験値・クエスト等。**現状は検討中**で、MVP には含めない。
