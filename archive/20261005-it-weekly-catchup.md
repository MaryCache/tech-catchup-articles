---
date: "2026-10-05"
category: "IT全般・週間総括"
slug: "it-weekly"
items: 5
---

# 2026-10-05 IT全般・週間総括 技術キャッチアップ

## 概要

2026-09-28〜2026-10-05の主要な技術更新を、AI、開発ツール、セキュリティ、クラウドを横断して確認した。移行期限、既存ワークフローへの影響、実務で利用可能になった新機能を優先した。

## 重要な更新

### 1. GitHub Enterprise Cloud（GHE.com）のX25519-only TLS接続が10月7日に終了

- **重要度:** 高
- **対象:** GitHub Enterprise Cloud with data residency利用組織、独自TLSクライアント・プロキシ運用者
- **要点:** 10月7日から、鍵共有方式としてX25519のみを提示するTLSクライアントはGHE.comへ接続できなくなる。P-256とP-384は引き続き利用できる。
- **業務への影響:** 古い、または独自構成のTLSクライアントでは接続障害が発生する可能性がある。一般的な現行ブラウザ、OS、GitHub CLI、TLSライブラリは原則影響を受けない。
- **対応:** 今すぐ確認

**出典**
- [GitHub Changelog](https://github.blog/changelog/2026-09-30-x25519-only-tls-ends-for-ghe-com-on-september-15/)

### 2. GitHub Copilotで一部モデルが非推奨化

- **重要度:** 高
- **対象:** GitHub Copilot利用者、Enterprise管理者、モデル固定の自動化
- **要点:** 10月2日付でGemini 3.5 Flash、Gemini 3.6 Flash、Kimi K2.7 Code、Claude Opus 4.7がCopilot全体で非推奨となった。GitHubはGemini 3.8 Flash、Kimi K3、Claude Opus 5.5などへの移行を案内している。
- **業務への影響:** モデル名を固定したワークフローやEnterpriseのモデルポリシーは確認が必要。
- **対応:** 今すぐ確認

**出典**
- [GitHub Changelog](https://github.blog/changelog/2026-10-02-selected-models-in-github-copilot-deprecated/)

### 3. GitHub Copilotにdesktop computer useとDynamic Workflowsが追加

- **重要度:** 中
- **対象:** AIエージェント開発者、GitHub Copilot CLI / app / SDK利用者
- **要点:** Copilot CLIとCopilot appでデスクトップアプリを操作するcomputer useがパブリックプレビューになった。またDynamic Workflowsにより、複数エージェントと決定的な処理をコードで組み合わせるオーケストレーションが利用可能になった。
- **業務への影響:** APIやCLIを持たないGUIアプリの操作や、複数エージェントを含む業務フローをCopilot中心に構築できる範囲が広がる。
- **対応:** 試験導入候補

**出典**
- [GitHub Changelog: Computer use](https://github.blog/changelog/2026-10-01-github-copilot-can-now-interact-with-desktop-apps/)
- [GitHub Changelog: Dynamic Workflows](https://github.blog/changelog/2026-10-01-dynamic-workflows-in-copilot-cli-and-the-copilot-app/)

### 4. GoogleがGemini 4 Argonを発表

- **重要度:** 中
- **対象:** LLM選定担当、ソフトウェア開発、サイバーセキュリティ担当
- **要点:** GoogleはGemini 4 Argonを発表した。長時間の複雑な処理、ソフトウェア開発、企業向け知識業務、サイバー防御を主用途とし、100万トークンのコンテキスト上限を掲げる。現時点ではFairwind Programを通じた限定展開である。
- **業務への影響:** 一般提供後、長いコンテキストを必要とするエージェントやコード処理の比較候補になる。
- **対応:** 情報共有のみ

**出典**
- [Google Blog](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/)

### 5. AWS Well-Architected Agentがパブリックプレビュー

- **重要度:** 中
- **対象:** AWS運用担当、クラウドアーキテクト、FinOps・セキュリティ担当
- **要点:** AWS環境を分析し、コスト、セキュリティ、性能、耐障害性についてWell-Architected Frameworkに沿った改善案を提示するAIエージェントがパブリックプレビューになった。
- **業務への影響:** Well-Architectedレビューや継続的なクラウド改善の一部を自動化できる可能性がある。プレビュー段階のため、本番運用では提案内容の人手確認が必要。
- **対応:** 試験導入候補

**出典**
- [AWS News Blog](https://aws.amazon.com/blogs/aws/category/news/launch/)

## まとめ

今週はGitHub周辺の変更が多く、特に10月7日のTLS要件変更とCopilotのモデル非推奨化は既存環境の確認が必要となる。AI開発ではCopilotのcomputer useとDynamic Workflowsにより、コード生成から複数アプリ・複数エージェントを扱う自動化へ範囲が広がった。モデル面ではGemini 4 Argon、クラウド運用ではAWS Well-Architected Agentが新たな比較・試験候補となる。
