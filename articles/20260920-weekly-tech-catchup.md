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
- [GitHub Changelog](https://github.blog/changelog/2026-09-18-upcoming-deprecation-of-selected-github-copilot-models-in-mid-october/)

### 2. Gemini 3.8 Live / Live Extended Thinkingが開発者向けに提供開始

- **重要度:** 中
- **対象:** 音声エージェント、リアルタイム対話UI、マルチモーダルアプリを開発するチーム
- **要点:** GoogleはGemini 3.8 LiveとGemini 3.8 Live Extended Thinkingを公開し、Gemini APIとGoogle AI Studioで開発者向け提供を開始した。
- **業務への影響:** 音声エージェントで、会話を止めずに外部処理を並行実行する設計を取りやすくなる。
- **対応:** 試験導入候補

**出典**
- [Google](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-8-live-gemini-3-8-live-extended-thinking/)

<!-- daily:2026-09-20:end -->

<!-- daily:2026-09-21:start -->
## 9月21日（月）— IT全般・週間総括

### 1. GitHub ActionsのWorkflow execution protectionsが一般提供
- **重要度:** 高
- **対象:** GitHub Actionsを利用する組織
- **要点:** GitHubはActionsの実行者とトリガーイベントを許可リストで制御するWorkflow execution protectionsを一般提供した。
- **対応:** 今週中に確認

**出典**
- [GitHub Changelog](https://github.blog/changelog/2026-09-17-workflow-execution-protections-in-github-actions-generally-available/)

### 2. `ubuntu-latest`がUbuntu 26.04へ移行予定
- **重要度:** 高
- **対象:** GitHub-hosted runnerで`ubuntu-latest`を使用するCI/CD
- **要点:** `ubuntu-latest`は2026年10月19日〜11月19日にUbuntu 24.04から26.04へ段階的に移行する。
- **対応:** 今週中に確認

**出典**
- [GitHub Changelog](https://github.blog/changelog/2026-09-17-ubuntu-26-generally-available-and-latest-migration/)

### 3. npmにstage-only tokenが追加
- **重要度:** 中
- **対象:** npmパッケージをCIから公開しているチーム
- **要点:** granular access tokenにstage-only権限が追加され、直接公開権限を持たせない運用が可能になった。
- **対応:** 移行計画を作成

**出典**
- [GitHub Changelog](https://github.blog/changelog/2026-09-18-stage-only-npm-tokens-for-safer-automation/)

### 4. GitLab.comのレート制限が10月19日から変更
- **重要度:** 高
- **対象:** GitLab.comを自動利用するチーム
- **要点:** Freeアカウントと未認証アクセスに新しいレート制限が適用される。
- **対応:** 今週中に確認

**出典**
- [GitLab](https://about.gitlab.com/blog/rate-limit-change-2026/)

### 5. Cisco Secure Email GatewayのCVE-2026-76461
- **重要度:** 高
- **対象:** Cisco Secure Email Gatewayを運用する組織
- **要点:** 認証なしの遠隔攻撃者がroot権限の任意コマンド実行に至る可能性がある。
- **対応:** 今すぐ確認

**出典**
- [Cisco Security Advisory](https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-esa-inj-2bLVGmhX)

<!-- daily:2026-09-21:end -->

<!-- daily:2026-09-22:start -->
## 9月22日（火）— 開発ツール・OSS

### 1. Windows 11 Arm64 GitHub Actions runnerがVisual Studio 2026へ移行開始
- **重要度:** 高
- **対象:** GitHub Actionsで`windows-11-arm`を使用するチーム
- **要点:** `windows-11-arm` runner imageのVisual Studio 2026への段階的移行が開始された。
- **対応:** 今すぐ確認

**出典**
- [GitHub Changelog](https://github.blog/changelog/2026-08-20-windows-11-arm64-vs2026-image-generally-available/)

### 2. GitHub Copilot code reviewの改善版が一般提供
- **重要度:** 中
- **対象:** Copilot code reviewを利用するチーム
- **要点:** 再レビュー時の解決済み指摘の自動整理などが追加された。
- **対応:** 情報共有のみ

**出典**
- [GitHub Changelog](https://github.blog/changelog/2026-09-18-copilot-code-review-an-improved-review-experience/)

### 3. Grok 4.7がGitHub Copilotへ追加
- **重要度:** 中
- **対象:** GitHub Copilot利用者
- **要点:** Grok 4.7が複数のCopilotプランへ段階的に提供開始された。
- **対応:** 試験導入候補

**出典**
- [GitHub Changelog](https://github.blog/changelog/2026-09-21-grok-4-7-is-now-available-in-github-copilot/)

<!-- daily:2026-09-22:end -->

<!-- daily:2026-09-23:start -->
## 9月23日（水）— Web・バックエンド開発

### 1. Node.js 26.10.0が公開
- **重要度:** 中
- **対象:** Node.js 26系を評価・利用しているバックエンド開発者
- **要点:** `crypto.parsePKCS12()`、`fs.openAsBlobSync()`、`util.throttle()`、`util.debounce()`などが追加された。
- **対応:** 試験導入候補

**出典**
- [Node.js 26.10.0 release](https://nodejs.org/en/blog/release/v26.10.0)

### 2. Springが月次パッチリリースを「Patch Thursday」方式へ変更
- **重要度:** 高
- **対象:** Spring Portfolioを運用するチーム
- **要点:** 毎月第3月曜日の後の木曜日にパッチリリースをまとめる方式へ変更され、通常のパッチリリースは10月22日から始まる。
- **対応:** 今週中に確認

**出典**
- [Spring](https://spring.io/blog/2026/09/21/releasing-spring-for-modern-challenges/)

<!-- daily:2026-09-23:end -->

<!-- daily:2026-09-24:start -->
## 9月24日（木）— セキュリティ

### 1. Check Point Management ServerのCVE-2026-93616が実際の攻撃で悪用

- **重要度:** 高
- **対象:** Check Point Security Management Server、Multi-Domain Server、Log Server、SmartEventを運用する組織
- **要点:** 認証前の攻撃によってManagement Serverへ任意のスクリプトをアップロード・実行できる脆弱性で、Check Pointは実際の悪用を確認している。
- **業務への影響:** 修正適用に加え、既に侵害されていないかログやベンダー公開の確認手順を用いた調査が必要になる。
- **対応:** 今すぐ確認

**出典**
- [Check Point Security Advisory](https://blog.checkpoint.com/security/security-advisory-action-required-active-exploitation-of-cve-2026-85102-and-a-management-pre-authentication-vulnerability-cve-2026-93616/)

### 2. F5 BIG-IP APMのCVE-2026-94127がゼロデイとして悪用

- **重要度:** 高
- **対象:** BIG-IP APMをOAuth Authorization Serverとして利用する組織
- **要点:** APM access policyとOAuth Authorization Server profileを同じvirtual serverに設定した構成で、認証なしの遠隔コード実行につながる可能性がある。実際の悪用が確認されている。
- **業務への影響:** F5が公開したengineering hotfixの適用と侵害痕跡の確認を優先する必要がある。
- **対応:** 今すぐ確認

**出典**
- [Rapid7](https://www.rapid7.com/blog/post/etr-cve-2026-94127-critical-unauthenticated-rce-in-f5-big-ip-apm/)

### 3. Arista VeloCloud OrchestratorのCVE-2026-93952が悪用中

- **重要度:** 高
- **対象:** VeloCloud Orchestrator On-Premを証明書ベースのEdge認証で運用する組織
- **要点:** VCOの認証情報なしに特権的な内部機能へアクセスされる可能性があり、実際の悪用が確認されている。CVSS v3.1は10.0。
- **業務への影響:** 修正版の有無を確認し、Web UIへのアクセス制限や侵害痕跡の調査を並行して行う必要がある。
- **対応:** 今すぐ確認

**出典**
- [Arista Security Advisory 0183](https://www.arista.com/en/support/advisories-notices/security-advisory/24765-security-advisory-0183)

### 4. SolarWinds Observability Self-Hosted 2026.2.3で遠隔コード実行脆弱性を修正

- **重要度:** 高
- **対象:** SolarWinds Observability Self-Hostedを運用する組織
- **要点:** CVE-2026-28324とCVE-2026-28325を含む遠隔コード実行につながる脆弱性が修正された。CVE-2026-28324はCVSS 9.8。
- **業務への影響:** 対象構成を確認し、2026.2.3への更新を検討する必要がある。
- **対応:** 今週中に確認

**出典**
- [SolarWinds Observability Self-Hosted Release Notes](https://documentation.solarwinds.com/en/success_center/orionplatform/content/release_notes/solarwinds_platform_2026-2-3_release_notes.htm)

### この日のまとめ

本日はネットワーク・認証・管理基盤を狙う重大な脆弱性が集中した。Check Point、F5 BIG-IP APM、Arista VeloCloud Orchestratorはいずれも実際の悪用が確認されており、該当製品を運用する環境ではパッチ適用だけでなく侵害痕跡の確認も必要となる。SolarWinds Observability Self-Hostedについても更新状況を確認する。

<!-- daily:2026-09-24:end -->

<!-- daily:2026-09-25:start -->
## 9月25日（金）— クラウド・インフラ・DevOps

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


### この日のまとめ

本日は、AIエージェントを既存の開発・運用基盤へ安全に組み込むための隔離実行環境が2件公開された。Docker Cloud Sandboxesはコード実行環境、AlloyDBはデータベース負荷の分離を扱う。一方、GitHub ActionsではNode.js 20の削除が完了しており、古いJavaScript Actionやself-hosted runnerを利用する環境は対応状況の確認が必要である。

<!-- daily:2026-09-25:end -->
