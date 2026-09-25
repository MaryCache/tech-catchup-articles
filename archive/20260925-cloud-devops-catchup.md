---
date: "2026-09-25"
category: "クラウド・インフラ・DevOps"
slug: "cloud-devops"
items: 4
---

# 2026-09-25 クラウド・インフラ・DevOps 技術キャッチアップ

## 概要

2026年9月25日時点で、直近24時間を中心にクラウド、コンテナ、CI/CD、運用基盤の更新を再調査した。実務への影響が明確な変更を4件採用した。

## 重要な更新

### 1. GitHub Enterprise Cloudでself-hosted runnerの最低バージョン要件を全面適用

- **重要度:** 高
- **対象:** GitHub Enterprise Cloudでself-hosted runnerを運用する組織
- **要点:** GitHubは2026年9月25日から、self-hosted runnerのバージョン要件を全面適用する。新規登録・再登録には2.329.0以上が必要で、実行中のrunnerも各リリースから30日以内に更新し続ける必要がある。
- **業務への影響:** 要件を満たさないrunnerは登録できず、既存runnerもジョブを受け取れなくなる可能性がある。自動更新を無効化している環境や、古いVM・コンテナイメージからrunnerを展開している環境は確認が必要。
- **対応:** 今すぐ確認

**出典**
- [GitHub Changelog](https://github.blog/changelog/2026-06-12-github-actions-minimum-version-enforcement-timeline-for-self-hosted-runners/)

### 2. Docker Cloud Sandboxesが公開

- **重要度:** 中
- **対象:** AIコーディングエージェントを長時間・隔離環境で動かす開発チーム
- **要点:** Dockerは2026年9月24日、Docker-managed compute上でmicroVMベースの隔離環境を実行するCloud Sandboxesを公開した。Claude Code、Codex、CopilotなどのKitを用意し、ローカルとクラウドのsandboxを同じsbx CLIから扱える。
- **業務への影響:** 長時間のリファクタリングや依存関係更新などを開発者PCから切り離して実行できる。秘密情報はリクエスト時にproxy注入でき、エージェント自身へ値を渡さない運用も可能。クラウド実行は従量課金で、1セッションは最大24時間。
- **対応:** 試験導入候補

**出典**
- [Docker](https://www.docker.com/blog/introducing-cloud-sandboxes-start-on-your-laptop-finish-in-the-cloud/)
- [Docker Docs](https://docs.docker.com/ai/sandboxes/)

### 3. GitHub ActionsからNode.js 20ランタイムが削除

- **重要度:** 高
- **対象:** GitHub ActionsのJavaScript Action利用者・Action作者、self-hosted runner運用者
- **要点:** GitHubは2026年9月23日、Actions runnerからNode.js 20を削除し、JavaScript Actionsの実行環境をNode.js 24へ移行した。旧ランタイムを許可する一時的な環境変数も利用できなくなった。
- **業務への影響:** Action作者はruns.usingをnode24へ更新する必要がある。利用者側もNode.js 24対応版Actionへの更新が必要。
- **対応:** 今すぐ確認

**出典**
- [GitHub Changelog](https://github.blog/changelog/2026-09-23-node-20-is-no-longer-available-in-github-actions/)

### 4. AlloyDBがAIエージェント向けの分離された読み取り基盤をPreview公開

- **重要度:** 中
- **対象:** Google Cloud上でAIエージェントから本番PostgreSQLデータを参照するシステムを設計するチーム
- **要点:** Google Cloudは2026年9月24日、AlloyDBでAIエージェント向けの新しいデータベース構成をPreview公開した。本番データへ最新状態で読み取りアクセスできるsandboxed database instanceを秒単位で立ち上げ、エージェントの負荷を本番DBの計算資源から分離する。
- **業務への影響:** 多数のエージェントが予測しづらいクエリを発行する用途で、本番OLTPへの性能影響を抑えながら最新データを参照する設計が可能になる。Previewのため、本番採用前には制約と料金の確認が必要。
- **対応:** 試験導入候補

**出典**
- [Google Cloud](https://cloud.google.com/blog/products/databases/announcing-postgresql-for-agents-in-alloydb)

## まとめ

GitHub Enterprise Cloudではself-hosted runnerの最低バージョン要件が本日から全面適用されたため、対象組織ではrunnerの更新状況を優先して確認する必要がある。あわせて、GitHub ActionsのNode.js 20削除への対応も必要となる。Docker Cloud SandboxesとAlloyDBの新機能は、AIエージェントのコード実行とデータ参照を本番環境から分離する選択肢として試験導入候補となる。
