# AGENTS.md

## このリポジトリの責務

このリポジトリは、技術キャッチアップ記事の Markdown を保管・検証し、Zenn 公式の GitHub 連携で公開するための受け皿である。

記事本文の生成、技術ニュースの収集、LLM による調査・執筆は別の仕組みが担当する。

## やってはいけないこと

- 技術ニュース収集機能を勝手に追加しない。
- LLM API を追加しない。
- OpenAI / Anthropic などの API キーを要求しない。
- Zenn への非公式投稿 API を使用しない。
- Playwright などで Zenn へのログイン・投稿を自動化しない。
- 過去の記事を勝手に削除しない。
- `published: false` の記事を勝手に `true` へ変更しない。
- 記事本文を AI エージェント側で自動改稿しない。
- API キー、GitHub Token、Zenn の Cookie やログイン情報などの秘密情報を保存しない。

## 許可されること

- Markdown 検証の改善。
- Zenn CLI の安全なアップデート。
- CI の改善。
- README の更新。
- ディレクトリ整理。
- セキュリティアップデート。

## 記事の扱い

- 記事は `articles/YYYYMMDD-<category>-catchup.md` の形式で保存する。
- `published: false` も有効な調査記録として保持する。
- 記事本文に手を入れる必要が生じた場合は、依頼された範囲だけを変更する。

## 検証

変更後は最低限、次を実行する。

```bash
npm ci
npm run validate
npm run zenn:check
```

GitHub Actions は検証専用とし、Zenn への投稿処理を追加しない。

Actions の権限は必要最小限に保ち、外部 Action を追加する場合は提供元と利用バージョンを確認する。
