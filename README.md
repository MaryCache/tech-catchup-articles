# tech-catchup-articles

ChatGPT の `/tech-catchup daily` が毎日収集する技術キャッチアップをGitHubへ蓄積し、Zenn公式GitHub連携で週刊記事として公開するためのリポジトリ。

記事生成・ニュース収集・LLM呼び出しはこのリポジトリでは行わない。ここでは日次アーカイブ、Zenn公開用週刊記事、静的検証、Zenn CLIによる確認を扱う。

## 全体構成

```text
ChatGPT Automation
        ↓
/tech-catchup daily
        ↓
曜日別テーマで調査
        ↓
archive/YYYYMMDD-<category>-catchup.md
（日次の原本・Zenn対象外）
        ↓
articles/YYYYMMDD-weekly-tech-catchup.md
（日曜〜土曜の1記事を毎日更新）
        ↓
Zenn公式GitHub連携
        ↓
週1本の記事として公開
```

## 曜日別カテゴリ

| 曜日 | カテゴリ | slug |
| --- | --- | --- |
| 日 | 生成AI・AI開発 | `ai-dev` |
| 月 | IT全般・週間総括 | `it-weekly` |
| 火 | 開発ツール・OSS | `devtools-oss` |
| 水 | Web・バックエンド開発 | `web-backend` |
| 木 | セキュリティ | `security` |
| 金 | クラウド・インフラ・DevOps | `cloud-devops` |
| 土 | 先端技術・論文→実用 | `research-tech` |

週刊記事は日曜日始まり・土曜日終わり。

## 日次アーカイブ

毎日の調査結果は次の形式で保存する。

```text
archive/YYYYMMDD-<category>-catchup.md
```

`archive/` はZennの公開対象外。採用0件の日も含めて、調査履歴をGitHubへ残す。

## Zenn公開用週刊記事

Zennへ公開するのは週1本。

```text
articles/YYYYMMDD-weekly-tech-catchup.md
```

先頭の日付は、その週の日曜日。

例:

```text
articles/20260920-weekly-tech-catchup.md
```

同じ週は毎日このファイルを更新し、その日の曜日セクションだけを追加・置換する。

Front Matter例:

```yaml
---
title: "2026-09-20〜2026-09-26 技術キャッチアップ"
emoji: "🧭"
type: "tech"
topics: ["tech", "engineering", "ai", "security", "oss"]
published: true
---
```

週の最初の実行が0件の場合は `published: false`。後日、公開価値のある項目が追加された時点で、その週刊記事を `published: true` に切り替える。

## 既存の日次記事

週刊方式へ移行する前に `articles/YYYYMMDD-<category>-catchup.md` として作成された記事は履歴として保持する。新規のdaily実行では、この旧形式を追加しない。

## セットアップ

```bash
npm ci
```

## ローカルプレビュー

```bash
npm run preview
```

## 検証

```bash
npm run validate
npm run zenn:check
```

GitHub Actionsでも `main` へのpushとpull requestのたびに検証を実行する。

## Zennとの接続

公開にはZenn公式のGitHub連携を使う。独自の投稿APIや投稿用GitHub Actionsは使わない。

- repository: `MaryCache/tech-catchup-articles`
- branch: `main`
- Zenn公開対象: `articles/*.md`
- 日次原本: `archive/*.md`

`books/` はZennの標準ディレクトリ構造に合わせて空ディレクトリ用ファイルを保持する。

## 公開制御

```yaml
published: true
```

公開対象。

```yaml
published: false
```

非公開。週の初回が0件の場合などに使用する。
