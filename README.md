# Life OS Dashboard

> *This is what I do.*

タスク管理と予定管理を中核に、外部サービスから集めた自分の活動データを 1 画面に集約する **個人専用ダッシュボード**。

詳細は [`docs/`](./docs/) を参照してください。

- [プロジェクト概要](./docs/README.md)
- [アーキテクチャ・外部連携の方針](./docs/architecture.md)
- [画面仕様](./docs/screens.md)
- [デザインシステム](./docs/design-system.md)
- [ゲーミフィケーション検討メモ](./docs/gamification-spec.md)（検討中）

## 開発

```bash
npm run dev      # 開発サーバー (http://localhost:3000)
npm run build    # ビルド
npm run lint     # Lint
```

環境変数は `.env.local` に設定。`.env*` は git 管理対象外。

## エージェント向け

このリポジトリで作業する AI エージェント・コントリビューターは [`AGENTS.md`](./AGENTS.md) を参照してください。
