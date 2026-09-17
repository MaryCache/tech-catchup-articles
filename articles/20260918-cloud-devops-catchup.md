---
title: "2026-09-18 クラウド・インフラ・DevOps 技術キャッチアップ"
emoji: "☁️"
type: "tech"
topics: ["githubactions", "devops", "ubuntu", "aws", "docker"]
published: true
---

# 2026-09-18 クラウド・インフラ・DevOps 技術キャッチアップ

## 概要

2026年9月18日時点のクラウド・インフラ・DevOps関連情報を整理した。直近24時間の公式発表を優先し、実務への影響が大きい事項については直近7日まで確認した。

## 重要な更新

### 1. GitHub ActionsのWorkflow execution protectionsが一般提供

- **重要度:** 高
- **対象:** GitHub Actionsを利用する組織、CI/CD・セキュリティ管理者
- **要点:** GitHubは9月17日、ActionsのWorkflow execution protectionsを一般提供した。workflowを実行できるactorとeventを制限できるほか、GAではworkflowファイル単位の対象指定、評価状況を確認するInsights、REST APIによるポリシー管理が追加された。公開リポジトリでは`pull_request_target`を制限する既定ルールも段階的に導入される。
- **業務への影響:** fork由来のコードを扱うworkflowやデプロイworkflowについて、実行主体・イベント・対象workflowを明示的に制限できる。既定の`pull_request_target`保護は2026年11月2日から対象リポジトリで強制される予定のため、該当イベントを利用している場合は事前確認が必要となる。
- **対応:** 今週中に確認

**出典**
- [GitHub Changelog: Workflow execution protections in GitHub Actions generally available](https://github.blog/changelog/2026-09-17-workflow-execution-protections-in-github-actions-generally-available/)

### 2. GitHub Actionsの`ubuntu-latest`がUbuntu 26.04へ移行予定

- **重要度:** 高
- **対象:** GitHub-hosted runnerで`ubuntu-latest`を利用する開発者、CI/CD管理者
- **要点:** Ubuntu 26.04 runner imageがx64・arm64ともに一般提供となった。あわせて`ubuntu-latest`はUbuntu 24.04から26.04へ移行し、2026年10月19日から11月19日にかけて段階的に切り替わる。
- **業務への影響:** `ubuntu-latest`に依存するworkflowは自動的にOS世代が変わる。プリインストール済みツールやパッケージ、バージョン差に依存しているビルドでは失敗する可能性がある。
- **対応:** 今週中に確認

**出典**
- [GitHub Changelog: Ubuntu 26 generally available and latest migration](https://github.blog/changelog/2026-09-17-ubuntu-26-generally-available-and-latest-migration/)

### 3. GitHub Actions runnerからNode.js 20が9月23日に削除予定

- **重要度:** 高
- **対象:** GitHub Actions、自作JavaScript Action、self-hosted runnerを管理するチーム
- **要点:** GitHub ActionsではNode.js 24への移行が進められており、GitHubはNode.js 20のrunnerからの削除日を2026年9月23日としている。JavaScript Actionや古いrunner構成がNode.js 20へ依存している場合、期限が目前に迫っている。
- **業務への影響:** Node.js 20を前提とする古いActionや環境では、削除後にworkflowが動作しなくなる可能性がある。固定しているサードパーティActionや自作Actionのruntime指定を確認する必要がある。
- **対応:** 今すぐ確認

**出典**
- [GitHub Changelog: Deprecation of Node 20 on GitHub Actions runners](https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/)

### 4. AWS中東リージョンの障害で一部データが復旧不能と報道

- **重要度:** 高
- **対象:** クラウド上で単一AZ・単一リージョンにデータを保持するシステムの設計・運用担当者
- **要点:** 9月17日、今年発生した中東のAWS施設への攻撃に関連し、バーレーンおよびUAEの一部顧客データが復旧不能になったことが報じられた。物理設備の損傷により、単一箇所だけに保持されていた一部データを復元できなかったとされる。
- **業務への影響:** クラウド事業者の耐障害性だけでは、利用側が要求するRPO・RTOや災害時のデータ保全を必ずしも満たさない。重要データではマルチAZ、必要に応じてクロスリージョン複製や独立バックアップを設計し、復元試験まで含めて確認する必要がある。
- **対応:** 情報共有のみ

**出典**
- [The Wall Street Journal: AWS Says It Can’t Restore Some Data From Mideast Facilities Struck by Iran](https://www.wsj.com/world/middle-east/aws-says-it-cant-restore-some-data-from-mideast-facilities-struck-by-iran-ddcb7e5d)
- [Help Net Security: Iranian strikes on AWS facilities left customer data beyond recovery in Bahrain, UAE](https://www.helpnetsecurity.com/2026/09/17/aws-middle-east-outage-permanent-data-loss-bahrain-uae/)

### 5. Docker Sandboxesの隔離回避脆弱性が公開、0.42.0で修正済み

- **重要度:** 中
- **対象:** Docker SandboxesでAI Agentや信頼できないコードを実行する開発者
- **要点:** Docker Sandboxes 0.37.0〜0.41.9に、workspace外のホストファイルやUnix socketへアクセスできる隔離回避の脆弱性があることが9月17日に報じられた。修正版は0.42.0で、現時点で悪用確認は報告されていない。
- **業務への影響:** AI Agentや外部由来コードをSandbox内で実行していても、影響バージョンではホスト側の機密情報やsocketへ到達される可能性がある。Sandboxを安全境界として利用している環境ではバージョン確認が必要となる。
- **対応:** 今すぐ確認

**出典**
- [The Hacker News: Critical Docker Sandboxes Flaw Lets Malicious Guest Code Read and Modify macOS Host Files](https://thehackernews.com/2026/09/critical-docker-sandboxes-flaw-lets.html)

## まとめ

GitHub Actionsでは、workflow実行ポリシーの一般提供、`ubuntu-latest`のUbuntu 26.04移行、Node.js 20削除期限が重なっている。CI/CD環境では、実行権限だけでなくrunner OSとAction runtimeの固定状況も確認する必要がある。インフラ運用では、AWSのデータ復旧不能事例が単一障害領域への依存を見直す材料となるほか、Docker Sandboxes利用者は0.42.0以降への更新状況を確認する必要がある。
