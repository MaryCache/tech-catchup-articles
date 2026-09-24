---
date: "2026-09-25"
category: "クラウド・インフラ・DevOps"
slug: "cloud-devops"
items: 3
---

# 2026-09-25 クラウド・インフラ・DevOps 技術キャッチアップ

## 概要

2026年9月25日時点で、直近24時間を中心にクラウド、コンテナ、CI/CD、運用基盤の更新を調査した。実務への影響が明確な変更として、Docker Cloud Sandboxes、GitHub ActionsのNode.js 20削除、AlloyDBのエージェント向け分離実行基盤を採用した。

## 重要な更新

### 1. Docker Cloud Sandboxesが公開

- **重要度:** 中
- **対象:** AIコーディングエージェントを長時間・隔離環境で動かす開発チーム
- **要点:** Dockerは2026年9月24日、Docker-managed compute上でmicroVMベースの隔離環境を実行するCloud Sandboxesを公開した。Claude Code、Codex、CopilotなどのKitを用意し、ローカルとクラウドのsandboxを同じsbx CLIから扱える。
- **業務への影響:** 長時間のリファクタリングや依存関係更新などを開発者PCから切り離して実行できる。秘密情報はリクエスト時にproxy注入でき、エージェント自身へ値を渡さない運用も可能。クラウド実行は従量課金で、1セッションは最大24時間。
- **対応:** 試験導入候補

**出典**
- [Docker: Introducing Cloud Sandboxes](https://www.docker.com/blog/introducing-cloud-sandboxes-start-on-your-laptop-finish-in-the-cloud/)
- [Docker Docs: Docker Sandboxes](https://docs.docker.com/ai/sandboxes/)

### 2. GitHub ActionsからNode.js 20ランタイムが削除

- **重要度:** 高
- **対象:** GitHub ActionsのJavaScript Action利用者・Action作者、self-hosted runner運用者
- **要点:** GitHubは2026年9月23日、Actions runnerからNode.js 20を削除し、JavaScript Actionsの実行環境をNode.js 24へ移行した。旧ランタイムを許可する一時的な環境変数も利用できなくなった。
- **業務への影響:** Action作者はruns.usingをnode24へ更新する必要がある。利用者側もNode.js 24対応版Actionへの更新が必要。Node.js 24が対応しないmacOS 13.4以前とARM32のself-hosted runnerも対象外となる。
- **対応:** 今すぐ確認

**出典**
- [GitHub Changelog: Node 20 is no longer available in GitHub Actions](https://github.blog/changelog/2026-09-23-node-20-is-no-longer-available-in-github-actions/)

### 3. AlloyDBがAIエージェント向けの分離された読み取り基盤をPreview公開

- **重要度:** 中
- **対象:** Google Cloud上でAIエージェントから本番PostgreSQLデータを参照するシステムを設計するチーム
- **要点:** Google Cloudは2026年9月24日、AlloyDBでAIエージェント向けの新しいデータベース構成をPreview公開した。本番データへ最新状態で読み取りアクセスできるsandboxed database instanceを秒単位で立ち上げ、エージェントの負荷を本番DBの計算資源から分離する。
- **業務への影響:** 多数のエージェントが予測しづらいクエリを発行する用途で、本番OLTPへの性能影響を抑えながら最新データを参照する設計が可能になる。Previewのため、本番採用前には制約と料金の確認が必要。
- **対応:** 試験導入候補

**出典**
- [Google Cloud: Announcing PostgreSQL for agents in AlloyDB](https://cloud.google.com/blog/products/databases/announcing-postgresql-for-agents-in-alloydb)

## まとめ

本日は、AIエージェントを既存の開発・運用基盤へ安全に組み込むための隔離実行環境が2件公開された。Docker Cloud Sandboxesはコード実行環境、AlloyDBはデータベース負荷の分離を扱う。一方、GitHub ActionsではNode.js 20の削除が完了しており、古いJavaScript Actionやself-hosted runnerを利用する環境は対応状況の確認が必要である。
