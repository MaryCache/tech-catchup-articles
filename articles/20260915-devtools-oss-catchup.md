---
title: "2026-09-15 開発ツール・OSS 技術キャッチアップ"
emoji: "🛠️"
type: "tech"
topics: ["github", "vscode", "githubactions", "codeql", "devtools"]
published: true
---

# 2026-09-15 開発ツール・OSS 技術キャッチアップ

## 概要

2026年9月15日時点の開発ツール・OSS関連情報を整理した。直近24時間の変更を優先し、業務影響が大きい項目については直近7日まで対象を広げている。

## 重要な更新

### 1. GitHubがHTTPS/TLSでのSHA-1利用を本日完全停止

- **重要度:** 高
- **対象:** GitHubをHTTPS経由で利用する開発者、Gitクライアント・APIクライアントを管理する担当者
- **要点:** GitHubは2026年9月15日、github.comおよび関連CDNでHTTPS/TLSにおけるSHA-1利用を完全停止する。GitHub Web、GitHub API、HTTPS経由のGit push/pullが対象となり、古いTLS実装や古いOS・Gitクライアントでは接続できなくなる可能性がある。
- **業務への影響:** 長期間更新されていないビルド端末、CI環境、古いLinuxディストリビューション、組み込み環境などではGitHub接続障害が発生する可能性がある。
- **対応:** 今すぐ確認

**出典**
- [GitHub Changelog: Sunsetting SHA-1 in HTTPS on GitHub](https://github.blog/changelog/2026-04-20-sunsetting-sha-1-in-https-on-github/)

### 2. GitHub Actions self-hosted runnerの最低バージョン強制が最終段階

- **重要度:** 高
- **対象:** GitHub Actionsのself-hosted runnerを運用するチーム
- **要点:** GitHub Enterprise Cloudでは、古いself-hosted runnerを対象とした最終週のbrownoutが9月14日、16日、18日に実施され、9月25日から全面的なバージョン強制が開始される。runnerの登録には2.329.0以上が必要で、ジョブ実行については各runner release公開後30日以内の更新が求められる。
- **業務への影響:** 自動更新を無効化しているrunnerや長期間固定しているrunnerでは、登録失敗やジョブ停止が発生する可能性がある。
- **対応:** 今週中に確認

**出典**
- [GitHub Changelog: Minimum version enforcement timeline for self-hosted runners](https://github.blog/changelog/2026-06-12-github-actions-minimum-version-enforcement-timeline-for-self-hosted-runners/)

### 3. GitHub Actionsに`cache-mode`が追加

- **重要度:** 中
- **対象:** GitHub Actionsでキャッシュを利用する開発者、CI/CD管理者
- **要点:** GitHub Actionsでworkflowまたはjob単位にキャッシュアクセス権を制御できる`cache-mode`が一般提供された。`read`、`write`、`write-only`、`none`を指定でき、低信頼イベントからのキャッシュ書き込みを制限できる。
- **業務への影響:** 外部Pull Requestや`pull_request_target`を扱うworkflowで、キャッシュ汚染のリスクを減らすための明示的な権限制御が可能になる。
- **対応:** 試験導入候補

**出典**
- [GitHub Changelog: Control GitHub Actions cache access with cache-mode](https://github.blog/changelog/2026-09-10-control-github-actions-cache-access-with-cache-mode/)

### 4. Visual Studio Code 1.137でAgentの定期実行機能がPreviewに

- **重要度:** 中
- **対象:** Visual Studio CodeでAI Agentを利用する開発者
- **要点:** Visual Studio Code 1.137ではAutomationsがPreviewとして追加され、Agentタスクを毎時・毎日・毎週、または任意のタイミングで実行できる。Quick Chatを後からworkspaceへ接続する機能や、AgentsウィンドウからGitHub Issue・Pull Requestを確認する機能も追加された。
- **業務への影響:** 定期的な調査、Issue確認、コード点検などをIDE内のAgentへ委譲する運用を試しやすくなる。一方でPreview機能のため、CI/CDの代替として本番運用する段階ではない。
- **対応:** 試験導入候補

**出典**
- [Visual Studio Code 1.137 Release Notes](https://code.visualstudio.com/updates/v1_137)

### 5. CodeQL 2.27.0がLinux ARM64に対応

- **重要度:** 中
- **対象:** CodeQL、GitHub Code Security、ARM64 CI環境を利用する開発者
- **要点:** CodeQL 2.27.0でLinux ARM64向けCLIが提供され、Java/Kotlin、C#、Rust、GitHub Actionsなどの解析精度も改善された。Java/KotlinではSpring R2DBC関連の解析範囲拡大が含まれる。
- **業務への影響:** ARM64ベースのCI環境でCodeQLをネイティブ実行しやすくなり、Java/Spring系の静的解析でも検出範囲が広がる。GitHub.comのcode scanningでは新しいCodeQLが自動展開されるため、CLIを固定している環境のみ更新確認が必要になる。
- **対応:** 今週中に確認

**出典**
- [GitHub Changelog: CodeQL 2.27.0 adds support for Linux ARM64](https://github.blog/changelog/2026-09-09-codeql-2-27-0-adds-support-for-linux-arm64/)

## まとめ

本日はGitHubのHTTPS/TLSにおけるSHA-1停止が最優先の確認事項となる。GitHub Actionsではself-hosted runnerのバージョン強制も最終段階に入っており、固定運用しているrunnerがある場合は9月25日の全面適用前に確認が必要である。その他、`cache-mode`、VS Code Automations、CodeQL 2.27.0は、CI/CDの安全性や開発支援の改善に関係する更新として検証対象となる。
