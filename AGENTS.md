# AGENTS.md

## このリポジトリの責務

このリポジトリは、技術キャッチアップの日次Markdownを保管し、週刊Markdownを検証し、Zenn公式GitHub連携で公開するための受け皿である。

記事本文の生成、技術ニュースの収集、LLMによる調査・執筆は別の仕組みが担当する。

## ディレクトリの責務

- `archive/`: 日次調査の原本。Zenn公開対象外。
- `articles/`: Zenn公開対象。新規daily運用では `YYYYMMDD-weekly-tech-catchup.md` を週1本作り、日々更新する。
- `books/`: Zenn標準構成維持用。書籍運用は現時点では行わない。

週刊記事は日曜日始まり・土曜日終わり。

## daily実行で許可される変更

- 当日分の `archive/YYYYMMDD-<category>-catchup.md` の作成・更新。
- 当週の `articles/YYYYMMDD-weekly-tech-catchup.md` の作成・更新。
- 同日再実行時に、週刊記事の同日マーカー区間だけを置換する。
- 週刊記事が `published: false` で、その週に初めて公開価値のある項目が追加された場合に限り `published: true` へ変更する。

## やってはいけないこと

- 技術ニュース収集機能をこのリポジトリへ追加しない。
- LLM APIを追加しない。
- OpenAI / AnthropicなどのAPIキーを要求しない。
- Zennへの非公式投稿APIを使用しない。
- PlaywrightなどでZennへのログイン・投稿を自動化しない。
- 過去の記事・アーカイブを勝手に削除しない。
- 過去週の記事本文をdaily実行から改稿しない。
- 同日の重複アーカイブを作らない。
- APIキー、GitHub Token、ZennのCookieやログイン情報などの秘密情報を保存しない。

## 保守作業として許可されること

- Markdown検証の改善。
- Zenn CLIの安全なアップデート。
- CIの改善。
- README更新。
- ディレクトリ整理。
- セキュリティアップデート。

## 検証

変更後は最低限、次を実行する。

```bash
npm ci
npm run validate
npm run zenn:check
```

GitHub Actionsは検証専用とし、Zennへの投稿処理を追加しない。

Actionsの権限は必要最小限に保ち、外部Actionを追加する場合は提供元と利用バージョンを確認する。
