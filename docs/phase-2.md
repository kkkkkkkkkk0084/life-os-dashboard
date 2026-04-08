# Phase 2 仕様書

> MVP 5 画面（`screens.md`）が動いた状態を前提に、その上に積み上げる **拡張フェーズ** の仕様。
> 3 領域: **カレンダー双方向同期 / タスク管理拡張（フル） / モバイル連携（フル）**

## 目次

- [全体方針](#全体方針)
- [前提と既知の課題](#前提と既知の課題)
- [1. カレンダー双方向同期](#1-カレンダー双方向同期)
- [2. タスク管理拡張（フル）](#2-タスク管理拡張フル)
- [3. モバイル連携（フル）](#3-モバイル連携フル)
- [実装順序の提案](#実装順序の提案)
- [環境変数（追加分）](#環境変数追加分)
- [未確定事項](#未確定事項)

---

## 全体方針

- **MVP の延長として段階的に育てる** — MVP の編集スコープ（読み取り中心 + Goals だけ追加）を、必要な操作に絞って徐々に拡張する
- **無料縛り** を維持（Google / GitHub / Upstash KV / Vercel の無料枠で完結）
- **モバイル運用を一級市民に** — 「PC で見るついでにスマホで触れる」ではなく、「スマホでも快適に運用できる」を目標
- **ハブとしての性格は維持** — ダッシュボードは複数サービスを束ねる場であり、単一サービスを置き換えるものではない
- **既存スマホアプリ（GitHub Mobile / Google Calendar）への委譲** を仕様で明文化し、ダッシュボードに無理に機能を詰め込まない

---

## 前提と既知の課題

### A. カレンダー認証エラー（Phase 2 着手前に解決必須）

現状 `GOOGLE_REFRESH_TOKEN` が `invalid_grant` で失効しており、Google Calendar API にアクセスできない。原因の最有力は **OAuth クライアントが「testing」モードで refresh token が 7 日で自動失効** した可能性。

**対応:**

1. Google Cloud Console → APIs & Services → OAuth consent screen → **Publishing status を In production に変更**（個人利用なら審査不要）
2. スコープを `calendar.readonly` から **`calendar`**（または `calendar.events`）に拡張（書き込みのため）
3. 改めて refresh token を発行し直して `.env.local` を更新
4. 既存の `lib/google-calendar.ts` の **silent fail を改善**: 認証エラー時はカード上にバナー表示し、dev mode では console にも出力

### B. ドキュメントの古い記述

以下を Phase 2 着手と並行して整理する:

- `docs/architecture.md`: `components/dashboard/` の言及・Finance ページの言及・データフロー図の `IssuesPanel` / `CalendarPanel` 表記
- `docs/_wip-mvp-planning.md`: 役目を終えたチェックポイント（削除候補）
- `app/finance/`: MVP からは外したが、実データ（家賃・固定費等）が含まれているため削除前に退避が必要

---

## 1. カレンダー双方向同期

### 目的

MVP では Google Calendar を **読み取りのみ** だが、ダッシュボードから予定の追加・編集・削除ができるようにする。これによりスマホで Google Calendar アプリを開かずとも、Life OS だけで予定管理が完結する。

### スコープ（3 段階）

#### Phase 2.1 — 認証修復 + 読み取りの強化

- 上記「前提」A の認証修復
- 認証エラー時のフィードバック改善（カード上バナー）
- 複数カレンダー対応の準備（カレンダー一覧取得）
- `lib/google-calendar.ts` のリファクタ: 共通ヘッダ + エラー型を整理

#### Phase 2.2 — 書き込み（作成のみ）

- `/schedule` に **「+ 予定追加」ボタン** を追加
- フォーム: タイトル / 開始日時 / 終了日時 / カレンダー選択
- Server Action `createEventAction` を追加
- `lib/google-calendar.ts` に `createEvent({ title, start, end, calendarId })` を追加
- 終日イベント対応はオプション（フォームに「終日」チェックボックス）

#### Phase 2.3 — 編集・削除

- 既存イベント行をクリックで詳細モーダル or `/schedule/event/[id]` ページへ
- 編集フォーム + 削除ボタン
- `lib/google-calendar.ts` に `updateEvent(id, patch)` / `deleteEvent(id)` を追加
- 楽観的更新（操作後に即 UI 反映 + バックグラウンドで API 呼び出し）

### データフロー

```
[ダッシュボード]
  ↓ Server Action (createEventAction / updateEventAction / deleteEventAction)
[lib/google-calendar.ts]
  ├ getUpcomingEvents()    既存
  ├ getTodayEvents()       既存
  ├ listCalendars()        新規
  ├ createEvent(input)     新規
  ├ updateEvent(id, patch) 新規
  └ deleteEvent(id)        新規
        ↓
  Google Calendar API
```

### UI 要件

- `/schedule` ヘッダに「+ 予定追加」ボタン
- 予定追加フォームは折りたたみ式（Goal 作成 UI と同じパターン）
- 既存イベントはクリックで編集モードに展開
- 削除は確認ダイアログ付き

### 非対応（将来検討）

- **繰り返しイベント** — 編集が複雑なので Google Calendar アプリに任せる
- **会議室予約 / ゲスト招待** — 同上
- **タイムゾーン切り替え** — JST 固定で運用

### 仕様上の注意

- 失敗時は silent fail せず、UI に「保存に失敗しました」を表示
- API レスポンスは型を正規化して `lib/types.ts` の `CalendarEvent` に揃える

---

## 2. タスク管理拡張（フル）

### 全体方針

階層構造（Goal / Project / Task / Detail）の編集を、可能な限りダッシュボード内で完結させる。GitHub Issues / Milestones との同期は維持し、モバイルからは GitHub アプリでも触れる状態を保つ。

### データ層の拡張

`lib/github.ts` に以下を追加:

| 関数 | 用途 |
|------|------|
| `createIssue({ title, body, labels, milestone })` | Issue 新規作成 |
| `updateIssue(number, patch)` | タイトル / body / labels / milestone を更新 |
| `closeIssue(number)` / `reopenIssue(number)` | 状態変更 |
| `addLabel(number, label)` / `removeLabel(number, label)` | 単一ラベルの追加・削除 |
| `createMilestone({ title, description, due_on })` | Milestone 新規作成 |
| `toggleIssueCheckbox(number, lineIndex)` | Issue body の `- [ ]` ↔ `- [x]` を切り替え |

### 2.1 Goal ↔ Milestone 紐付け UI

**目的**: Missions の階層を完成させる。MVP では Server Action `updateGoalMilestonesAction` だけ用意して UI 未実装。

**UI:**

- `/missions/goal/[id]` に **「Project を追加」セクション** を追加
- 「未紐付けの Open Milestone」一覧から選択 → `+ 追加` で Goal の `milestoneNumbers` に追加
- 既に紐付いた Milestone のカードに **「解除」ボタン**
- 全 Goal で重複紐付けを許容するか禁止するかは要決定（推奨: 重複可）

**データ:**

- 既存の `updateGoalMilestonesAction` をフォーム付きクライアントコンポーネントから呼び出す
- revalidatePath で `/missions` と `/missions/goal/[id]` を更新

### 2.2 Today's Tasks の絞り込み + Inbox

**目的**: 全 open issue を毎日見るのは情報過多。「今日やる」だけにフォーカスし、それ以外は Inbox に寄せる。

**実装方式**: GitHub label `today` で絞る（最もシンプル、GitHub Mobile アプリからもラベル付け可能）

**UI:**

- **Overview の Today's Tasks**: `today` ラベル付きの open issue だけ表示
- ない時の空状態: 「今日のタスクは設定されていません。Inbox から追加できます」+ Inbox へのリンク
- **`/missions` の下に "Inbox" セクション**: `today` ラベルがない open issue 一覧
- Inbox の各 Issue 行に「**今日にする**」ボタン → `today` ラベルを付与
- Today's Tasks の各 Issue 行に「**今日から外す**」ボタン → `today` ラベルを削除

**動作:**

- ラベル付け / 解除は Server Action 経由で GitHub API を叩く
- 楽観的更新でラグを最小化

### 2.3 ダッシュボードからのタスク作成

**目的**: GitHub アプリを開かずに Issue を作れる。スマホからの素早い記録に対応。

**UI:**

- **3 つの場所に「+ New Task」ボタン**を配置:
  1. `/missions` Inbox セクションの右上（自由作成）
  2. `/missions/project/[number]` の右上（その Milestone に紐付けて作成）
  3. Overview の Today's Tasks の右上（`today` ラベルを付けて作成）
- フォーム: **タイトル（必須）/ ラベル選択（任意・チェックボックス）/ Milestone 選択（任意・該当画面のみ）**
- Goal 作成 UI と同じパターン（折りたたみ → 展開 → Submit）

**データ:**

- `lib/github.ts` の `createIssue()` を Server Action 経由で呼ぶ
- 作成後 revalidate

### 2.4 Detail (checkbox) のチェックトグル

**目的**: Issue body の `- [ ]` チェックリストを 1 タップで切り替え。サブタスク完了をダッシュボードで完結させる。

**UI:**

- `/missions/task/[number]` の各 Detail 行をクリックで toggle
- 楽観的更新（即 UI 反映 → バックグラウンドで保存）
- 保存失敗時は元に戻す + エラー表示

**データ:**

- `parseIssueDetails()` で行番号付きでパース → Issue body の該当行を `[ ]` ↔ `[x]` に書き換え → `updateIssue(number, { body })` で保存
- 行番号がずれないよう、body の他の部分は触らない

**注意:**

- ネストしたチェックボックス（インデント付き）にも対応
- 複数同時編集の競合は無視（ダッシュボード単独利用前提）

### 2.5 タスクの状態管理（TODO / Doing / Done / Blocked）

**目的**: 進捗を視覚的に管理。学業のレポート作成中・調査中などの「途中の状態」を可視化。

**実装方式**: GitHub label で状態を表現

| 状態 | 表現 |
|------|------|
| **TODO** | ラベルなし（または `status:todo`） |
| **Doing** | `status:doing` ラベル |
| **Blocked** | `status:blocked` ラベル |
| **Done** | Issue を closed |

**UI:**

- `/missions/project/[number]` で **カンバン表示**（4 列: TODO / Doing / Blocked / Done）
- 各 Issue カードをタップでメニュー: 「Doing にする」「Blocked にする」「Done にする（= close）」
- ドラッグ&ドロップは MVP では実装しない（モバイル操作で問題が出やすい）
- Overview の Today's Tasks では `Doing` を強調表示

**データ:**

- `addLabel` / `removeLabel` / `closeIssue` を Server Action 経由で呼ぶ

### 2.6 期限 / リマインダー

**目的**: 締切のあるタスク（学業の試験・レポート提出）を期限ベースで把握。

**実装方式**: 2 層構成

| レベル | 期限の持たせ方 |
|--------|--------------|
| **Project (Milestone)** | GitHub Milestone の `due_on` を活用 |
| **Task (Issue)** | Issue body 先頭に **`Due: 2026-04-15`** 形式で記載 → ダッシュボード側でパース |

**理由**: GitHub Issue ネイティブには期限フィールドがないため、body 先頭の規約で扱う。

**UI:**

- `/missions/project/[number]` のヘッダに Milestone の `due_on` と残日数を表示
- 期限切れのタスクは赤、当日は黄、3 日以内はオレンジで強調
- Overview の Today's Tasks に「期限が今日 / 明日のタスクを優先表示」

**データ:**

- `lib/github.ts` に `parseIssueDueDate(body)` を追加
- パース失敗時は無期限として扱う

**リマインダー**: → §3.4 プッシュ通知 と統合

---

## 3. モバイル連携（フル）

### 全体方針

スマホから Life OS を快適に使えるようにする。重い編集操作は既存のスマホアプリに委譲し、ダッシュボードは「ハブ」として一覧と軽い記録に集中する。

### 3.1 モバイルレスポンシブ

**目的**: スマホブラウザ（iPhone Safari / Chrome）で全ページが快適に閲覧できる。

**現状の問題:**

| 画面 | 問題 |
|------|------|
| Overview | `h-[calc(100dvh-88px)] overflow-hidden` で 1 画面固定。スマホでは縦に詰め込みすぎ |
| Hero | greeting + year progress が横並び。狭い画面で潰れる |
| Health の LifeLogEditor | 6 マスが 2 列で狭い |
| Missions のカード | パディング過剰 |
| Nav | `hidden md:flex` で 768px 未満では消える |

**スコープ:**

- **対応サイズ**: 375px (iPhone SE) / 393px (iPhone 14) / 768px (iPad) / 1280px+ (PC)
- **タッチ対応**: タップ領域 44×44px 以上（Apple HIG 準拠）
- **モバイルナビ**: 768px 未満では下部固定タブバー（Overview / Missions / Schedule / Health の 4 タブ + メニュー）
- **Overview のレイアウト**: スマホでは 1 画面固定をやめてスクロール可。各セクションは縦に積む
- **Hero**: スマホでは greeting と year progress を縦スタック
- **LifeLogEditor**: スマホは 1 列 6 行（または 2 列 3 行）
- **フォント**: ベース 14px（PC）→ 15px（モバイル）に微調整

### 3.2 PWA 化

**目的**: ホーム画面に追加してアプリのように起動できる。

**実装:**

- `public/manifest.webmanifest` を作成
  - `name: "Life OS"`
  - `short_name: "Life OS"`
  - `display: "standalone"`
  - `theme_color: "#0A0A0A"`
  - `background_color: "#0A0A0A"`
  - icons (192px / 512px / maskable)
- `app/layout.tsx` の metadata に `manifest` リンクと `apple-touch-icon` を追加
- 必要なアイコンを `public/icons/` に配置
- Service Worker は **最初は導入しない**（複雑性回避）。オフライン対応は後追い

**動作:**

- iOS Safari で「ホーム画面に追加」→ Life OS アイコン
- 起動時はスタンドアロン表示（ブラウザ UI なし）
- ステータスバーはダーク

**スコープ外（後追い）:**

- Service Worker によるオフライン対応
- Background Sync

### 3.3 iOS ショートカット連携の拡張

**目的**: Siri から音声で記録・取得できるように、Webhook の対応操作を増やす。

**現状**: `POST /api/webhook` で生活ログ 6 アクション（wakeup / sleep / exercise / outing / return / meal）に対応

**拡張アクション（追加）:**

| アクション | 用途 | 例 |
|----------|------|-----|
| `task` | Issue 作成 | "Hey Siri, ライフ OS にタスク追加, ◯◯" |
| `today` | Issue に `today` ラベル付与 | "Hey Siri, タスク #5 を今日にする" |
| `event` | カレンダーに予定追加 | "Hey Siri, 明日 10 時に病院" |
| `note` | 任意のメモを KV に記録 | （Phase 3 で検討） |

**追加 GET エンドポイント:**

| ルート | 用途 |
|-------|------|
| `GET /api/today` | 今日のタスク + 予定をテキストで返す（Siri が読み上げ） |
| `GET /api/status/now` | 現在の生活ログを JSON で返す |

**認証**: 既存の `WEBHOOK_SECRET` トークンを継続利用。HTTP ヘッダ or ボディに含める。

**ショートカット側のサンプル:**

iOS ショートカットアプリでテンプレートを `docs/mobile/shortcuts/` に置いて配布（自分用）

### 3.4 プッシュ通知

**目的**: 期限前・予定前にスマホへ通知する。

**実装方式**: **Web Push API + Service Worker + VAPID キー**

**手順:**

1. VAPID キー生成（`web-push` ライブラリ）
2. 環境変数に `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` を追加
3. クライアント: 通知許可ダイアログ → 購読 → subscription を `/api/push/subscribe` に POST
4. サーバー: subscription を Upstash KV に保存（`push:subscriptions`）
5. **Vercel Cron Jobs** で 15 分ごとに以下を実行:
   - 今後 30 分以内に始まるカレンダー予定を抽出
   - 期限が今日のタスクを抽出
   - 該当があれば対応する subscription に Push
6. Service Worker が受信 → ローカル通知表示

**コスト:**

- VAPID: 無料
- Vercel Cron Jobs: **Hobby plan で利用可**（ただし日次 1 回制限あり → 短間隔が必要なら別手段）
- 別案: GitHub Actions の cron で外部から `/api/push/check` を叩く

**スコープ外:**

- リッチ通知（画像・アクションボタン）は将来検討
- iOS Safari の Web Push は **iOS 16.4+ で PWA インストール後のみ** 対応

### 3.5 既存スマホアプリへの委譲を仕様で明文化

**目的**: 「ダッシュボードでやること」「他アプリでやること」を仕様レベルで決め、機能を詰め込みすぎない。

**役割分担表:**

| 操作 | 担当 | 理由 |
|------|------|------|
| タスク一覧の閲覧 | **ダッシュボード** | ハブとしての中心機能 |
| 簡単なタスク作成（タイトルのみ） | **ダッシュボード** | スマホからの素早い記録 |
| Issue の長文編集 / コメント | **GitHub Mobile App** | リッチエディタが必要 |
| Issue へのファイル添付 | **GitHub Mobile App** | 同上 |
| Project (Milestone) 進捗の俯瞰 | **ダッシュボード** | カンバン表示で一望できる |
| Project の説明文編集 | **GitHub Web** | 月数回しか触らない |
| カレンダー予定の閲覧 | **ダッシュボード** | ハブとしての中心機能 |
| 簡単な予定追加（タイトル + 時刻） | **ダッシュボード** | スマホからの素早い記録 |
| 繰り返し予定の設定 | **Google Calendar App** | UI が複雑 |
| 招待・会議室・通知音設定 | **Google Calendar App** | 同上 |
| 生活ログ記録（タップ） | **ダッシュボード** | 既存実装 |
| 生活ログ記録（音声） | **iOS ショートカット → Webhook** | Siri 連携 |
| 学業の単位確認 | **ダッシュボード** | 静的データ |
| 健康データの長期分析 | **将来検討** | KV のキー設計から見直し |

---

## 実装順序の提案

依存関係と効果の順番で並べ替え。各項目はおおむね 1 PR 単位を想定。

| # | 項目 | 効果 | 依存 |
|---|------|------|------|
| 1 | カレンダー認証修復 + silent fail 改善 | 全体の前提 | — |
| 2 | モバイルレスポンシブ（Nav / Overview / Hero / Health） | 全ページ快適化 | — |
| 3 | Today's Tasks 絞り込み（`today` ラベル）+ Inbox | 日々の運用が劇的に改善 | — |
| 4 | ダッシュボードからのタスク作成 (`+ New Task`) | スマホでの記録が完結 | 3 |
| 5 | PWA 化（manifest + icons） | アプリ感 | 2 |
| 6 | Detail チェックトグル | サブタスク完了が楽 | — |
| 7 | Goal ↔ Milestone 紐付け UI | Missions 階層が完成 | — |
| 8 | タスク状態管理（カンバン） | 進捗が見える | 3 |
| 9 | カレンダー書き込み（作成のみ） | 予定追加が完結 | 1 |
| 10 | iOS ショートカット拡張 | Siri 操作 | 4, 9 |
| 11 | プッシュ通知（Web Push + Cron） | リマインダー実現 | 5 |
| 12 | 期限管理（Issue body の `Due:` パース） | 締切ベース運用 | 11 |
| 13 | カレンダー編集・削除 | 完全な双方向 | 9 |

> 1〜5 の **5 項目だけでも Phase 2 の体感は劇的に変わる**。優先度はここに置く。

---

## 環境変数（追加分）

| 変数 | 用途 | 必須？ |
|------|------|--------|
| `GOOGLE_*` | スコープを `calendar` に拡張（既存変数） | ✅ |
| `VAPID_PUBLIC_KEY` | Web Push 用公開鍵 | Push 機能に必須 |
| `VAPID_PRIVATE_KEY` | Web Push 用秘密鍵 | 同上 |
| `VAPID_CONTACT_EMAIL` | VAPID 連絡先（mailto:） | 同上 |
| `WEBHOOK_SECRET` | iOS ショートカット連携（既存） | ✅ |

> 全て `.env.local` に追加。`.env*` は git 対象外。`docs/architecture.md` の環境変数表に追記する。

---

## 未確定事項

仕様書として残す論点。実装時に決める or 改めて議論する。

### 共通

- Phase 2 の各項目をどこまで自分で実装し、どこからを「後で」にするか
- 失敗時の UI 表現（共通バナー、トースト、ダイアログのどれを基本とするか）

### カレンダー

- 終日イベントの編集対応をどこまでやるか
- 複数カレンダー切り替え UI の必要性
- タイムゾーンを JST 固定で良いか

### タスク

- 「今日」の判定基準を `today` ラベルだけで良いか、Sunsama 流の手動ピン留めも入れるか
- 状態管理を 4 段階で良いか（`Doing` だけで十分という説も）
- カンバン UI のドラッグ操作をモバイルでどう扱うか
- 期限の表記を Issue body の `Due:` 行で良いか、別の規約を使うか
- 完了済み Issue のアーカイブビュー（→ Phase 3 候補）

### モバイル

- PWA でオフライン対応する範囲（最低限の前回データキャッシュ vs 完全オフライン）
- プッシュ通知の頻度（15 分 / 1 時間 / 任意設定）
- iOS ショートカットのテンプレート配布方法（GitHub にコミット？ iCloud リンク？）
- 通知の表現（音 / バイブ / バナーの強度）

---

## 関連ドキュメント

- `docs/README.md` — プロジェクト全体像
- `docs/screens.md` — MVP 5 画面の仕様
- `docs/architecture.md` — 技術構成・データフロー（Phase 2 着手と並行で更新）
- `docs/design-system.md` — UI トークン
- `docs/gamification-spec.md` — ゲーミフィケーション要素（検討中・MVP/Phase 2 ともに含めない）
- `AGENTS.md` — フォルダ配置・作業ルール
