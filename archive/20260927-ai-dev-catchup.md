---
date: "2026-09-27"
category: "生成AI・AI開発"
slug: "ai-dev"
items: 4
---

# 2026-09-27 生成AI・AI開発 技術キャッチアップ

## 概要

2026年9月27日時点で直近24時間を中心に調査した。直近24時間に限定すると重要な新規発表が少なかったため、直近7日以内の主要変更から、モデル選定やAI開発基盤へ影響する4件を採用した。

## 重要な更新

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

## まとめ

OpenAIとAnthropicのモデル更新に加え、GoogleのローカルAI対応、Microsoftの長時間エージェント拡張が確認された。モデル性能だけでなく、費用、ローカル実行、継続動作、組織内での管理まで含めた選定が必要となる。
