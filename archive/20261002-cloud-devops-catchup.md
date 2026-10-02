---
date: "2026-10-02"
category: "クラウド・インフラ・DevOps"
slug: "cloud-devops"
items: 4
---

# 2026-10-02 クラウド・インフラ・DevOps 技術キャッチアップ

## 概要

2026年10月2日時点で、直近24時間を中心にクラウド、コンテナ、運用基盤の更新を調査した。直近24時間の重要な新規発表に加え、運用への影響が大きい直近数日の変更として、AWS App Meshのサポート終了、Spanner Omniの一般提供、Google Cloud Monitoringのアプリケーショントポロジー一般提供、Migrate to Containers CLIの脆弱性修正を採用した。

## 重要な更新

### 1. AWS App Meshのサポートが9月30日で終了

- **重要度:** 高
- **対象:** AWS App Meshを利用しているECS / EKS環境
- **要点:** AWS App Meshは2026年9月30日にサポートを終了した。終了後はApp MeshコンソールやApp Meshリソースへアクセスできなくなる。
- **業務への影響:** App Meshを継続利用していた環境ではサービスメッシュ構成を維持できないため、Amazon ECS Service Connectなどの代替手段への移行が必要になる。
- **対応:** 今すぐ確認

**出典**
- [AWS App Mesh documentation](https://docs.aws.amazon.com/app-mesh/latest/userguide/getting-started-kubernetes.html)

### 2. Spanner Omniが一般提供、オンプレミスや他クラウドでもSpannerを運用可能に

- **重要度:** 中
- **対象:** 分散SQLデータベースをオンプレミス、他クラウド、ハイブリッド環境で運用するチーム
- **要点:** Google Cloudは9月30日、Spanner Omniを一般提供した。LTS版「2026.r4-lts」が用意され、オンプレミスやGoogle Cloud以外のクラウドにもSpannerを配置できる。
- **業務への影響:** Spannerの分散SQL、強整合性、SQL・グラフ・Key-Value・全文検索・ベクトル検索などをGoogle Cloud外でも利用できる。LTS版は最大1年間セキュリティ修正が提供される。
- **対応:** 試験導入候補

**出典**
- [Google Cloud: Spanner Omni, now GA](https://cloud.google.com/blog/products/databases/spanner-omni-deploy-anywhere-version-of-spanner-is-now-ga)
- [Spanner Omni release notes](https://docs.cloud.google.com/spanner-omni/release-notes)

### 3. Google Cloud Monitoringのアプリケーショントポロジーが一般提供

- **重要度:** 中
- **対象:** Google Cloud上のアプリケーションやマイクロサービスを監視するチーム
- **要点:** Cloud Monitoringのapplication topology graphが一般提供になった。アプリケーション、サービス、ワークロード間の関係とトラフィックを可視化し、インシデントをアプリケーション構成と合わせて確認できる。
- **業務への影響:** 障害調査時にサービス間の依存関係と影響範囲を把握しやすくなり、複数サービスにまたがる問題の切り分けに利用できる。
- **対応:** 試験導入候補

**出典**
- [Google Cloud Monitoring release notes](https://docs.cloud.google.com/monitoring/docs/release-notes)

### 4. Migrate to Containers CLI 1.2.5がプラグインイメージの脆弱性を修正

- **重要度:** 中
- **対象:** Google Cloud Migrate to Containersを利用して既存ワークロードをコンテナ化するチーム
- **要点:** Google Cloudは10月1日、Migrate to Containers CLI 1.2.5とmodernization plugins 1.4.21を公開した。Apache、JBoss、Linux discovery / extractionなどのプラグインイメージでCVE-2026-17106とCVE-2026-84304が修正された。
- **業務への影響:** 対象プラグインを使う移行作業では、古いイメージを使い続けないようCLIとプラグインの更新状況を確認する必要がある。
- **対応:** 今週中に確認

**出典**
- [Migrate to Containers CLI release notes](https://docs.cloud.google.com/migrate/containers/docs/m2c-cli-relnotes)

## まとめ

本日は、AWS App Meshのサポート終了が既存環境へ直接影響する変更として最優先となる。Google CloudではSpanner OmniとCloud Monitoringの機能が一般提供となり、ハイブリッドなデータベース運用とサービス間依存関係の可視化が拡充された。Migrate to Containers利用環境では、脆弱性修正を含むCLIとプラグインの更新状況を確認する必要がある。
