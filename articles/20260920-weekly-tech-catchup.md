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
