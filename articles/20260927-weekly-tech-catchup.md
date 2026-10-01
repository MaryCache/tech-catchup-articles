---
title: "2026-09-27〜2026-10-03 技術キャッチアップ"
emoji: "🧭"
type: "tech"
topics: ["tech", "engineering", "ai", "security", "oss"]
published: true
---

# 2026-09-27〜2026-10-03 技術キャッチアップ

この週に確認した主要な技術更新を、曜日ごとのテーマに沿って整理する。

- 日: 生成AI・AI開発
- 月: IT全般・週間総括
- 火: 開発ツール・OSS
- 水: Web・バックエンド開発
- 木: セキュリティ
- 金: クラウド・インフラ・DevOps
- 土: 先端技術・論文→実用

<!-- daily:2026-09-27:start -->
## 9月27日（日）— 生成AI・AI開発

### 1. OpenAIがGPT-6 Sol / Lunaを公開

- **重要度:** 高
- **対象:** OpenAI APIで生成AI機能やCoding Agentを開発・運用するチーム
- **要点:** GPT-6 Astraの改善を低価格帯へ展開したGPT-6 SolとGPT-6 Lunaが公開された。API価格はGPT-5.6世代のプロモーション価格と比べて引き下げられた。
- **業務への影響:** 既存のGPT-5.6利用環境では、品質・速度・費用を含めた再評価対象となる。
- **対応:** 今週中に確認

**出典**
- [OpenAI](https://openai.com/index/introducing-gpt-6-sol-and-luna/)

### 2. AnthropicがClaude Opus 5.5を公開

- **重要度:** 高
- **対象:** Claude API、Claude Code、エージェント型開発支援を利用するチーム
- **要点:** Claude Opus 5.5が公開された。エージェント型コーディング、コンピューター操作、知識労働を重点領域とし、Anthropicは典型的な処理でOpus 5より実行コストを40%抑えられるとしている。
- **業務への影響:** Opus 5を高難度のコーディングや調査へ利用している場合、実タスクでの比較対象となる。
- **対応:** 試験導入候補

**出典**
- [Anthropic](https://www.anthropic.com/claude-opus-5-5)

### 3. Google Antigravity SDKがローカルAIモデルに対応

- **重要度:** 中
- **対象:** ローカルLLMやオンデバイスAIを使うエージェント開発チーム
- **要点:** Antigravity SDKにローカルAIモデル対応が追加された。LiteRTとGemma 4によるオフライン実行に加え、クラウド側のGeminiとローカルモデルを組み合わせる構成も示された。
- **業務への影響:** ローカル処理とクラウド処理を分担するエージェント設計の選択肢が増える。
- **対応:** 試験導入候補

**出典**
- [Google Developers Blog](https://developers.googleblog.com/introducing-support-for-local-ai-models-in-the-antigravity-sdk/)

### 4. Microsoft CopilotがHome・Code・Autopilotを発表

- **重要度:** 中
- **対象:** Microsoft 365、Copilot、社内AIエージェントを導入する組織
- **要点:** CopilotにHome、Code、Autopilotが追加される。Codeは自然言語から業務用アプリや自動化を作成し、Autopilotはクラウド上で継続動作するエージェントとして設計されている。
- **業務への影響:** Microsoft 365内で対話型AIに加え、アプリ作成や長時間エージェントまで扱う範囲が広がる。
- **対応:** 情報共有のみ

**出典**
- [Microsoft](https://blogs.microsoft.com/blog/2026/09/25/introducing-the-new-copilot-with-home-code-and-autopilot/)


### この日のまとめ

OpenAIとAnthropicのモデル更新に加え、GoogleのローカルAI対応、Microsoftの長時間エージェント拡張が確認された。モデル性能だけでなく、費用、ローカル実行、継続動作、組織内での管理まで含めた選定が必要となる。

<!-- daily:2026-09-27:end -->

<!-- daily:2026-09-29:start -->
## 9月29日（火）— 開発ツール・OSS

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


### この日のまとめ

GitHub Actionsではself-hosted runnerの最低バージョン要件が本日から全面適用されるため、対象環境は更新状況の確認を優先する。開発支援ではDependabotのrunner割り当てが細かくなり、CopilotにはGPT-6.1 Solが追加された。OSSではAIエージェントを実行環境側から制御するOpenShellが公開され、エージェント運用の安全策として検証対象になる。

<!-- daily:2026-09-29:end -->

<!-- daily:2026-09-30:start -->
## 9月30日（水）— Web・バックエンド開発

### 1. Spring Boot 4.2.0 M2などSpring各プロジェクトのマイルストーン版が公開

- **重要度:** 中
- **対象:** Spring Boot 4系を評価しているJavaバックエンド開発者
- **要点:** Springは9月29日の週間まとめで、9月24日にSpring Boot 4.2.0 M2、Spring Data 2026.1.0-M2、Spring Security 7.2.0-M2など複数のマイルストーン版を公開したことを案内した。Spring Boot 4.2.0 M2ではLDAP向けSSL Bundle、OpenTelemetry semantic conventions、共通OTLP endpoint・header・compression設定などが追加されている。
- **業務への影響:** Spring Boot 4.2系への移行を検討している環境では、監視設定やLDAP接続まわりの新機能を事前検証できる。マイルストーン版のため、本番採用ではなく評価用途が中心となる。
- **対応:** 試験導入候補

**出典**
- [Spring: This Week in Spring - September 29th, 2026](https://spring.io/blog/2026/09/29/this-week-in-spring-september-29th-2026/)

### 2. Cloudflare Browser Runで1セッションへの複数クライアント同時接続が可能に

- **重要度:** 中
- **対象:** Cloudflare Workersからブラウザ自動化・Web操作を行う開発者
- **要点:** Browser Runの同一セッションへ複数のWorkersから同時接続できるようになった。各接続は独立したChrome DevTools Protocol接続となり、browser contextを分けることでページ・Cookie・storageを分離できる。利用には @cloudflare/puppeteer 1.1.0以降が必要。
- **業務への影響:** ブラウザを毎回新規起動せず複数処理で共有できるため、起動待ち時間と同時ブラウザ数を抑えやすくなる。共有時はbrowser contextによる状態分離が必要。
- **対応:** 試験導入候補

**出典**
- [Cloudflare Changelog: Connect multiple clients to one Browser Run session](https://developers.cloudflare.com/changelog/post/2026-09-29-concurrent-session-connections/)

### 3. GoDaddyがNode.js HostingとデプロイAPIを公開

- **重要度:** 低
- **対象:** 小規模Node.js Webアプリを簡単に公開したい開発者、AIコーディングツールからデプロイを自動化したい開発者
- **要点:** GoDaddyはNode.js Hostingを公開し、ZIPまたはGitHubリポジトリからアプリを配置できるようにした。APIからアプリ作成、ソース配置、公開、環境変数管理、ビルド・アプリログ取得まで操作でき、公開環境にはHTTPS、CDN、WAF、Managed MySQLが含まれる。
- **業務への影響:** Node.jsアプリの構築から公開までをAPI経由で自動化でき、AIコーディングエージェントからのデプロイ先候補が増える。公開にはGoDaddy Web Hostingプランが必要。
- **対応:** 情報共有のみ

**出典**
- [GoDaddy: Node.js Hosting](https://www.godaddy.com/hosting/nodejs)


### この日のまとめ

本日は、Spring Boot 4.2系の評価材料が増えたほか、Webアプリの実行・公開を自動化するサービス側の更新が目立った。特にCloudflare Browser Runの複数接続はブラウザ自動化の実行効率に直接関わる変更であり、該当用途では @cloudflare/puppeteer の更新とbrowser context分離を確認する価値がある。

<!-- daily:2026-09-30:end -->

<!-- daily:2026-10-01:start -->
## 10月1日（木）— セキュリティ

### 1. Cisco Catalyst SD-WAN Managerの認証バイパス脆弱性が実際に悪用

- **重要度:** 高
- **対象:** Cisco Catalyst SD-WAN Managerを運用する組織
- **要点:** CVE-2026-76504はAPIのセッションベース認証を回避し、認証なしのリモート攻撃者が管理者権限でAPIへアクセスできる脆弱性で、CVSS 3.1は9.8。Ciscoは2026年9月に実際の悪用を確認しており、影響する全構成に対して修正版への更新を求めている。
- **業務への影響:** SD-WANの管理基盤自体が侵害される可能性があり、ネットワーク設定や管理機能へ高い権限で到達されるリスクがある。回避策はなく、更新と侵害痕跡の確認を優先する必要がある。
- **対応:** 今すぐ確認

**出典**
- [Cisco Security Advisory: CVE-2026-76504](https://www.cisco.com/c/en/us/support/docs/csa/cisco-sa-sdwan-webauth-xr8beuuU.html)
- [SecurityWeek: Cisco Patches Exploited Catalyst SD-WAN Zero-Day Vulnerability](https://www.securityweek.com/cisco-patches-exploited-catalyst-sd-wan-zero-day-vulnerability/)

### 2. Citrix NetScalerのRCE脆弱性2件で悪用を確認

- **重要度:** 高
- **対象:** NetScaler ADC / NetScaler Gatewayを運用する組織
- **要点:** CitrixはCVE-2026-88771とCVE-2026-88772について、未対策環境での悪用を確認している。CVE-2026-88771はデフォルト構成を含むNetScaler ADC / Gatewayで認証なしの任意コマンド実行につながり、CVE-2026-88772はDTLSが有効な構成でメモリ破壊からRCEまたはDoSにつながる。
- **業務への影響:** インターネット境界に配置されることが多い製品のため、侵害時は内部ネットワークへの足掛かりとなる可能性がある。Citrixは修正版への即時更新を強く推奨している。
- **対応:** 今すぐ確認

**出典**
- [Citrix Security Bulletin CTX697096](https://support.citrix.com/external/article/CTX697096/citrix-netscaler-adc-and-citrix-netscale.htm)

### 3. Zimbra CVE-2026-73570の実攻撃が報告

- **重要度:** 高
- **対象:** Zimbra Collaboration SuiteでSNMP通知を有効化している環境
- **要点:** CVE-2026-73570はSNMP監視コンポーネントのコマンドインジェクション脆弱性で、Zimbra 10.1.20で修正されている。公開情報では、パッチ配布後かつ公表前の段階から実際の攻撃で悪用されていたことが報告された。
- **業務への影響:** 条件を満たす環境では、細工したSMTPリクエストからZimbraユーザー権限でのリモートコード実行につながる可能性がある。10.1.20未満の対象環境では更新状況の確認が必要。
- **対応:** 今すぐ確認

**出典**
- [Zimbra Security Advisories](https://wiki.zimbra.com/wiki/Zimbra_Security_Advisories)
- [SecurityWeek: Zimbra Vulnerability Exploited in the Wild Prior to Public Disclosure](https://www.securityweek.com/zimbra-vulnerability-exploited-in-the-wild-prior-to-public-disclosure/)

### 4. WatchGuard Fireware OSのBOVPN over TLSに重大なコードインジェクション

- **重要度:** 高
- **対象:** WatchGuard FireboxでBOVPN over TLSを利用する組織
- **要点:** CVE-2026-86131はBOVPN over TLSクライアントの設定処理におけるコードインジェクションで、攻撃者が制御するリモートVPNサーバーへ接続したFirebox上でroot権限の任意コマンド実行につながる。CVSS v4.0は9.2。
- **業務への影響:** Fireware OS 2026.3.2、2026.2.3、12.12.3、T15/T35向け12.5.21で修正されている。WatchGuardは公開時点で実悪用を確認していないが、該当構成では更新を優先する必要がある。
- **対応:** 今週中に確認

**出典**
- [WatchGuard PSIRT: CVE-2026-86131](https://psirt.watchguard.com/CVE-2026-86131)


### この日のまとめ

本日は、Cisco Catalyst SD-WAN Manager、Citrix NetScaler、Zimbraで実際の悪用が確認または報告された脆弱性を優先した。特にインターネット境界や管理基盤に位置する製品は、修正適用だけでなく侵害痕跡の確認も必要となる。WatchGuard Fireware OSについても重大なRCE脆弱性が公開されており、該当構成では修正版への更新状況を確認する。

<!-- daily:2026-10-01:end -->
