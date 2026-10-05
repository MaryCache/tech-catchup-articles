---
date: "2026-10-05"
category: "IT全般・週間総括"
slug: "it-weekly"
items: 5
---

# 2026-10-05 IT全般・週間総括 技術キャッチアップ

## 概要

2026-09-28〜2026-10-05の主要な技術更新を横断して確認した。移行期限、既存ワークフローへの影響、実務で利用可能になった新機能を優先した。

## 重要な更新

### 1. OpenAI DevDay 2026でGPT-6.1 SolとAgents APIの拡張を発表

- **重要度:** 高
- **対象:** OpenAI API、Codex、AIエージェント開発者
- **要点:** GPT-6.1 SolがAPIなどで提供開始された。Agents APIではcomputer use、マルチエージェント、tool search、tool calling、context compactionなどを利用できる。Codex Cloud、Codex Security Cloud、Decisions APIなど開発者向け機能も発表された。
- **業務への影響:** コーディングだけでなく、ブラウザ操作や複数エージェントを含む長時間タスクをマネージドな基盤上で構築できる範囲が広がった。
- **対応:** 今週中に確認

**出典**
- [OpenAI DevDay 2026 Recap](https://openai.com/index/devday-2026-recap/)
- [OpenAI Release Notes](https://openai.com/ja-JP/products/release-notes/)

### 2. GitHub Enterprise Cloud（GHE.com）のX25519-only TLS接続が10月7日に終了

- **重要度:** 高
- **対象:** GitHub Enterprise Cloud with data residency利用組織、独自TLSクライアント・プロキシ運用者
- **要点:** 10月7日から、鍵共有方式としてX25519のみを提示するTLSクライアントはGHE.comへ接続できなくなる。P-256とP-384は引き続き利用できる。
- **業務への影響:** 古い、または独自構成のTLSクライアントでは接続障害が発生する可能性がある。
- **対応:** 今すぐ確認

**出典**
- [GitHub Changelog](https://github.blog/changelog/2026-09-30-x25519-only-tls-ends-for-ghe-com-on-september-15/)

### 3. GitHub Copilotで一部モデルが非推奨化

- **重要度:** 高
- **対象:** GitHub Copilot利用者、Enterprise管理者、モデル固定の自動化
- **要点:** 10月2日付でGemini 3.5 Flash、Gemini 3.6 Flash、Kimi K2.7 Code、Claude Opus 4.7がCopilot全体で非推奨となった。
- **業務への影響:** モデル名を固定したワークフローやEnterpriseのモデルポリシーは確認が必要。
- **対応:** 今すぐ確認

**出典**
- [GitHub Changelog](https://github.blog/changelog/2026-10-02-selected-models-in-github-copilot-deprecated/)

### 4. GitHub Copilotにdesktop computer useとDynamic Workflowsが追加

- **重要度:** 中
- **対象:** AIエージェント開発者、GitHub Copilot CLI / app / SDK利用者
- **要点:** Copilot CLIとCopilot appでデスクトップアプリを操作するcomputer useがパブリックプレビューになった。Dynamic Workflowsでは複数エージェントと決定的な処理をコードで組み合わせられる。
- **業務への影響:** GUIアプリ操作や複数エージェントを含む業務フローをCopilot中心に構築できる範囲が広がる。
- **対応:** 試験導入候補

**出典**
- [GitHub Changelog: Computer use](https://github.blog/changelog/2026-10-01-github-copilot-can-now-interact-with-desktop-apps/)
- [GitHub Changelog: Dynamic Workflows](https://github.blog/changelog/2026-10-01-dynamic-workflows-in-copilot-cli-and-the-copilot-app/)

### 5. GoogleがGemini 4 Argonを発表

- **重要度:** 中
- **対象:** LLM選定担当、ソフトウェア開発、サイバーセキュリティ担当
- **要点:** 長時間の複雑な処理、ソフトウェア開発、企業向け知識業務、サイバー防御を主用途とするGemini 4 Argonが発表された。100万トークンのコンテキスト上限を掲げる。
- **業務への影響:** 一般提供後、長いコンテキストを必要とするエージェントやコード処理の比較候補になる。
- **対応:** 情報共有のみ

**出典**
- [Google Blog](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/)

## まとめ

今週はAI開発基盤とGitHub周辺の変更が中心となった。OpenAI DevDay 2026ではGPT-6.1 SolとAgents APIの拡張により、マネージドなエージェント開発の選択肢が増えた。GitHubではTLS要件変更とCopilotモデル非推奨化が既存環境へ直接影響するため、優先して確認する必要がある。
