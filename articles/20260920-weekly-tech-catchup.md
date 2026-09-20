---
title: "2026-09-20〜2026-09-26 技術キャッチアップ"
emoji: "🧭"
type: "tech"
topics: ["tech", "engineering", "ai", "security", "oss"]
published: true
---

# 2026-09-20〜2026-09-26 技術キャッチアップ

この週に確認した主要な技術更新を、曜日ごとのテーマに沿って整理する。

- 日: 生成AI・AI開発
- 月: IT全般・週間総括
- 火: 開発ツール・OSS
- 水: Web・バックエンド開発
- 木: セキュリティ
- 金: クラウド・インフラ・DevOps
- 土: 先端技術・論文→実用

<!-- daily:2026-09-20:start -->
## 9月20日（日）— 生成AI・AI開発

### 1. GitHub Copilotで複数モデルが10月19日に廃止予定

- **重要度:** 高
- **対象:** GitHub Copilotでモデルを明示指定している開発者、Copilot Business / Enterprise管理者
- **要点:** GitHubは2026年10月19日に、Copilotの全機能からGemini 3.7 Flash、GPT-5.5、GPT-5.4、GPT-5.4 mini、GPT-5 mini、Grok 4.5を廃止する予定を発表した。代替としてGemini 3.8 Flash、GPT-5.6 Sol、GPT-5.6 Luna、Grok 4.6が案内されている。
- **業務への影響:** Copilot Chatだけでなく、inline edits、ask、agent mode、code completionsも対象となる。特定モデルを前提にした利用手順や組織ポリシーがある場合は、廃止日までに代替モデルへの切り替えと動作確認が必要になる。
- **対応:** 今週中に確認

**出典**
- [GitHub Changelog: Upcoming deprecation of selected GitHub Copilot models in mid-October](https://github.blog/changelog/2026-09-18-upcoming-deprecation-of-selected-github-copilot-models-in-mid-october/)

### 2. Gemini 3.8 Live / Live Extended Thinkingが開発者向けに提供開始

- **重要度:** 中
- **対象:** 音声エージェント、リアルタイム対話UI、マルチモーダルアプリを開発するチーム
- **要点:** GoogleはGemini 3.8 LiveとGemini 3.8 Live Extended Thinkingを公開し、Gemini APIとGoogle AI Studioで開発者向け提供を開始した。3.8 Liveはリアルタイムの音声・視覚入力とツール実行に対応し、会話を続けながらバックグラウンドでAPIやツールを呼び出せる。Extended Thinkingは、より複雑な多段階処理を対象としている。
- **業務への影響:** 音声エージェントで、会話を止めずに外部処理を並行実行する設計を取りやすくなる。Googleは97言語の自動切り替えやリアルタイムの視覚入力にも対応するとしており、既存のLive API利用者は評価対象になる。
- **対応:** 試験導入候補

**出典**
- [Google: Introducing Gemini 3.8 Live and 3.8 Live Extended Thinking](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-8-live-gemini-3-8-live-extended-thinking/)

### この日のまとめ

本日の実務上の確認事項は、GitHub Copilotで10月19日に予定されている複数モデルの廃止である。モデルを明示指定している環境では、代替モデルへの移行確認が必要になる。新規開発ではGemini 3.8 Live系が音声・視覚入力とバックグラウンドのツール実行を組み合わせる選択肢として追加された。

<!-- daily:2026-09-20:end -->

<!-- daily:2026-09-21:start -->
## 9月21日（月）— IT全般・週間総括

### 1. GitHub ActionsのWorkflow execution protectionsが一般提供

- **重要度:** 高
- **対象:** GitHub Actionsを利用する組織、特に公開リポジトリや`pull_request_target`を利用するチーム
- **要点:** GitHubは9月17日、Actionsの実行者とトリガーイベントを許可リストで制御するWorkflow execution protectionsを一般提供した。ワークフローファイル単位の対象指定とInsightsも追加された。公開リポジトリでは、既存のイベントポリシーがない場合に`pull_request_target`を無効化する既定ルールが導入され、2026年11月2日から対象リポジトリで自動的に強制される予定。
- **業務への影響:** `pull_request_target`を利用する公開リポジトリでは、現在動作しているCIが11月以降に停止する可能性がある。評価モードのInsightsで影響を事前確認できる。
- **対応:** 今週中に確認

**出典**
- [GitHub Changelog: Workflow execution protections in GitHub Actions generally available](https://github.blog/changelog/2026-09-17-workflow-execution-protections-in-github-actions-generally-available/)

### 2. `ubuntu-latest`がUbuntu 26.04へ移行予定

- **重要度:** 高
- **対象:** GitHub-hosted runnerで`ubuntu-latest`を使用するCI/CD
- **要点:** Ubuntu 26.04 runner imageが9月17日に一般提供となった。`ubuntu-latest`は2026年10月19日〜11月19日にUbuntu 24.04から26.04へ段階的に移行する。
- **業務への影響:** Ubuntu 26.04ではプリインストール済みツールやバージョンに変更・削除があり、それらへ暗黙に依存するビルドは失敗する可能性がある。
- **対応:** 今週中に`ubuntu-26.04`で試験し、移行準備ができていない場合は一時的に`ubuntu-24.04`へ固定する

**出典**
- [GitHub Changelog: Ubuntu 26 generally available and latest migration](https://github.blog/changelog/2026-09-17-ubuntu-26-generally-available-and-latest-migration/)

### 3. npmにstage-only tokenが追加、bypass-2FA token廃止への移行手段に

- **重要度:** 中
- **対象:** npmパッケージをCIからトークンで公開しているチーム
- **要点:** npmのgranular access tokenに`Read and write (stage only)`権限が追加された。自動処理は`npm stage publish`で候補版を登録できるが、直接の`npm publish`は拒否され、最終公開にはメンテナーの2FA承認が必要になる。npmは2027年1月を目標にbypass-2FA tokenによる直接公開を廃止する予定。
- **業務への影響:** trusted publishingへ移行できない公開パイプラインでも、トークンに直接公開権限を与えない運用へ切り替えられる。利用にはnpm CLI 11.15.0以降とNode.js 22.14.0以降が必要。
- **対応:** 移行計画を作成

**出典**
- [GitHub Changelog: Stage-only npm tokens for safer automation](https://github.blog/changelog/2026-09-18-stage-only-npm-tokens-for-safer-automation/)

### 4. GitLab.comのレート制限が10月19日からプラン別へ変更

- **重要度:** 高
- **対象:** GitLab.com API、Git over HTTPS、Webアクセスを自動化するチーム
- **要点:** GitLab.comは2026年10月19日からFreeアカウントと未認証アクセスに新しいプラン別レート制限を適用する。未認証アクセスはプランに関係なく1 IPあたり60リクエスト/時となる。Premium / Ultimateは2027年1月に移行予定。10月7日と14日にはFree・未認証トラフィック向けの事前適用時間帯が設けられる。
- **業務への影響:** 未認証でGitLab.comをポーリングするbot、スキャナー、CI、AIエージェントは429応答を受けやすくなる。Self-ManagedとDedicatedは今回の変更対象外。
- **対応:** 今週中に未認証アクセスを棚卸しし、必要な自動処理を認証付きへ移行する

**出典**
- [GitLab: Rate limits on GitLab.com are changing](https://about.gitlab.com/blog/rate-limit-change-2026/)

### 5. Cisco Secure Email Gatewayの重大脆弱性CVE-2026-76461

- **重要度:** 高
- **対象:** Cisco Secure Email Gatewayを運用する組織
- **要点:** Ciscoは9月14日、AsyncOSのメール解析処理にあるSQLインジェクション脆弱性CVE-2026-76461を公開した。認証されていない遠隔の攻撃者が細工したメールを送信することで、基盤OS上でroot権限の任意コマンド実行に至る可能性がある。CVSSは9.8で、回避策は提供されていない。
- **業務への影響:** メール受信だけで攻撃経路になり得るため、該当製品をインターネット境界で利用している環境では優先度が高い。
- **対応:** 今すぐ確認

**出典**
- [Cisco Security Advisory: Cisco Secure Email Gateway SQL Injection Vulnerability](https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-esa-inj-2bLVGmhX)

### この日のまとめ

今週はGitHub Actions周辺で、セキュリティポリシーと実行環境の双方に将来の互換性へ影響する変更が入った。`pull_request_target`と`ubuntu-latest`を利用する環境は、11月までの確認が必要となる。パッケージ公開ではnpmのstage-only tokenが追加され、2027年のbypass-2FA token廃止に向けた移行手段が増えた。GitLab.comを利用する自動処理では10月19日のレート制限変更、Cisco Secure Email Gateway利用環境ではCVE-2026-76461への対応を優先する。

<!-- daily:2026-09-21:end -->
