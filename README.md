# tech-catchup-articles

ChatGPT の `/tech-catchup daily` が毎日生成する技術キャッチアップ記事を Markdown で蓄積し、Zenn 公式の GitHub 連携を通して公開するためのリポジトリ。

記事生成・ニュース収集・LLM 呼び出しはこのリポジトリでは行わない。ここでは `articles/` の保管、静的検証、Zenn CLI による確認だけを扱う。

## 全体構成

```text
ChatGPT Automation
        ↓
/tech-catchup daily
        ↓
Markdown生成
        ↓
GitHub / articles/*.md
        ↓
Zenn公式GitHub連携
        ↓
published: true の記事を公開
```

## 曜日別カテゴリ

| 曜日 | カテゴリ | slug |
| --- | --- | --- |
| 日 | 生成AI・AI開発 | `ai-development` |
| 月 | IT全般・週間総括 | `it-weekly` |
| 火 | 開発ツール・OSS | `devtools-oss` |
| 水 | Web・バックエンド | `web-backend` |
| 木 | セキュリティ | `security` |
| 金 | クラウド・インフラ・DevOps | `cloud-infra-devops` |
| 土 | 先端技術・論文→実用 | `emerging-tech` |

## 記事ファイル

記事は次の命名規則で `articles/` 直下に置く。

```text
articles/YYYYMMDD-<category>-catchup.md
```

例:

```text
articles/20260915-devtools-oss-catchup.md
```

Zenn CLI 0.5.4 では記事 slug は `a-z0-9`、`-`、`_` の12〜50文字。日次記事では運用を単純にするため、小文字英数字とハイフンだけを使う。

## Front Matter

日次記事では次の形式を使う。

```yaml
---
title: "2026-09-15 開発ツール・OSS 技術キャッチアップ"
emoji: "🛠️"
type: "tech"
topics:
  - github
  - oss
  - vscode
  - devtools
published: true
---
```

`type` は Zenn の仕様に合わせて `tech` または `idea`。日次記事では原則 `tech` を使う。

ニュースが0件だった日も記事ファイルは残し、`published: false` として調査記録を保持する。

## セットアップ

Zenn CLI 0.5.4 の実行には Node.js 22.12.0 以上が必要。

```bash
npm ci
```

## ローカルプレビュー

```bash
npm run preview
```

Zenn CLI のプレビューサーバーが起動する。終了するときは `Ctrl+C`。

## 検証

独自の静的検証:

```bash
npm run validate
```

Zenn CLI に記事を読み込ませる確認:

```bash
npm run zenn:check
```

`npm run validate` では、Front Matter の必須項目・型、ファイル名、Zenn slug 長、公開記事の本文・見出し・出典URL、明らかに不正な外部URLを確認する。

GitHub Actions でも `main` への push と pull request のたびに `npm ci`、`npm run validate`、`npm run zenn:check` を実行する。

## Zennとの接続

公開には Zenn 公式の GitHub 連携を使う。独自の投稿 API や投稿用 GitHub Actions は使わない。

初回だけ、Zenn 側で次の手動設定が必要。

1. Zenn にログインする。
2. Zenn の GitHub 連携画面を開き、`MaryCache/tech-catchup-articles` を連携する。
3. 同期対象ブランチを `main` に設定する。
4. `articles/20260915-zenn-connection-test.md` が非公開記事として認識されることを確認する。

以後は `main` に push された `articles/*.md` が Zenn 側へ同期される。

## 公開制御

```yaml
published: true
```

公開対象。

```yaml
published: false
```

非公開。ニュース0件の日や連携テストも削除せず、この状態で履歴として残す。
