---
date: "2026-09-29"
category: "開発ツール・OSS"
slug: "devtools-oss"
items: 4
---

# 2026-09-29 開発ツール・OSS 技術キャッチアップ

## 概要

2026年9月29日時点で直近24時間を中心に、GitHub、開発支援ツール、OSSの更新を調査した。GitHub Actionsのself-hosted runner要件の強制開始、Dependabotのrunner設定拡張、GitHub CopilotへのGPT-6.1 Sol追加、NVIDIA OpenShellを含むOpen Agent Safety Platformを採用した。

## 重要な更新

### 1. GitHub Actionsでself-hosted runnerの最低バージョン要件が強制開始

- **重要度:** 高
- **対象:** GitHub Enterprise Cloudでself-hosted runnerを運用するチーム
- **要点:** GitHubは最低バージョン要件の全面適用開始日を2026年9月29日に変更した。バージョン2.329.0未満のrunnerは新規登録・再登録できず、実行時の最低要件を下回る既存runnerはworkflow jobを処理できなくなる。
- **業務への影響:** 古いrunnerを残している環境ではCI/CDが停止する可能性がある。GitHub Enterprise Serverは今回の変更対象外。
- **対応:** 今すぐ確認

**出典**
- [GitHub Changelog](https://github.blog/changelog/2026-09-28-self-hosted-runner-version-enforcement-date-has-moved/)

### 2. Dependabotでリポジトリ単位のcustom runner設定が可能に

- **重要度:** 中
- **対象:** private / internal repositoryでDependabotを利用するチーム
- **要点:** リポジトリ管理者がDependabotのversion updateとsecurity updateについて、runner種別、custom label、runner groupをリポジトリ単位で指定できるようになった。
- **業務への影響:** private package registryへの接続や特殊な実行環境が必要なDependabot jobを、対象リポジトリごとにself-hosted runnerやlarger runnerへ割り当てられる。
- **対応:** 試験導入候補

**出典**
- [GitHub Changelog](https://github.blog/changelog/2026-09-29-repository-custom-runner-settings-for-dependabot)

### 3. GPT-6.1 SolがGitHub Copilotへ追加

- **重要度:** 中
- **対象:** GitHub Copilotでagentic codingやterminal workflowを利用する開発者
- **要点:** GitHubはGPT-6.1 SolをGitHub Copilotへ追加し、一般提供を段階的に開始した。複数手順のコーディングやterminalを使う作業を主な用途として案内している。
- **業務への影響:** Copilotで高難度の実装や複数手順の作業を任せる際のモデル選択肢が増える。既存モデルとの品質・速度・利用枠の比較対象となる。
- **対応:** 試験導入候補

**出典**
- [GitHub Changelog](https://github.blog/changelog/2026-09-29-gpt-6-1-sol-in-github-copilot)

### 4. NVIDIAがOpenShellを含むOpen Agent Safety Platformを公開

- **重要度:** 中
- **対象:** Coding Agentや自律型AIエージェントを隔離環境で運用する開発チーム
- **要点:** NVIDIAはOpen Agent Safety Platformを発表し、OSSのOpenShellを公開した。OpenShellはAIエージェントの実行時に境界を設け、操作の追跡とポリシー適用を行う。
- **業務への影響:** モデルやエージェント本体とは別の実行環境側で、ツール・データ・APIへのアクセスを制御する選択肢となる。
- **対応:** 試験導入候補

**出典**
- [NVIDIA Newsroom](https://nvidianews.nvidia.com/news/open-agent-safety-platform)

## まとめ

GitHub Actionsではself-hosted runnerの最低バージョン要件が本日から全面適用されるため、対象環境は更新状況の確認を優先する。開発支援ではDependabotのrunner割り当てが細かくなり、CopilotにはGPT-6.1 Solが追加された。OSSではAIエージェントを実行環境側から制御するOpenShellが公開され、エージェント運用の安全策として検証対象になる。
