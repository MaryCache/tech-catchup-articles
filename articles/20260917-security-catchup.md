---
title: "2026-09-17 セキュリティ 技術キャッチアップ"
emoji: "🔐"
type: "tech"
topics: ["security", "oracle", "chrome", "gitlab", "cve"]
published: true
---

# 2026-09-17 セキュリティ 技術キャッチアップ

## 概要

2026年9月17日時点のセキュリティ関連情報を整理した。直近24時間の更新を優先し、既に悪用が確認されている脆弱性など、対応優先度が高い事項については直近7日まで対象を広げている。

## 重要な更新

### 1. Oracleが9月のCritical Security Patch Updateを公開、673件の新規セキュリティパッチ

- **重要度:** 高
- **対象:** Oracle Database、Fusion Middleware、E-Business Suite、Java SE、HelidonなどOracle製品の管理者・開発者
- **要点:** Oracleは9月15日、17製品群を対象とするCritical Security Patch Updateを公開した。新規セキュリティパッチは673件で、Oracle Databaseだけでも11件、E-Business Suiteでは159件が含まれる。Oracle Databaseでは5件、E-Business Suiteでは19件が認証なしでリモートから悪用可能とされている。
- **業務への影響:** 対象製品が広く、サーバー製品だけでなくJava SEやHelidonも含まれる。利用中のOracle製品とバージョンを照合し、公開されたリスクマトリクスに基づいて適用順を決める必要がある。
- **対応:** 今すぐ確認

**出典**
- [Oracle Critical Security Patch Update Advisory - September 2026](https://www.oracle.com/security-alerts/cspusep2026.html)
- [Oracle Security Blog: September 2026 Critical Security Patch Update Released](https://blogs.oracle.com/security/september-2026-critical-security-patch-update)

### 2. Chrome 153が42件のセキュリティ修正を含んで公開

- **重要度:** 高
- **対象:** Chromeを利用する開発者・利用者、ブラウザを管理する担当者
- **要点:** GoogleはChrome 153.0.8010.47/.48をWindowsとmacOS向け、153.0.8010.47をLinux向けに公開した。42件のセキュリティ修正が含まれ、WebGLの境界外読み取り、InternalsとWorkersのUse After Freeの3件がCriticalとして記載されている。V8の整数オーバーフローなどHighの脆弱性も複数修正された。
- **業務への影響:** 開発端末や社内端末でChromeの更新を固定・遅延している場合は影響を受ける。段階配信のため、管理対象端末で更新状況を確認する必要がある。
- **対応:** 今すぐ確認

**出典**
- [Chrome Releases: Stable Channel Update for Desktop](https://chromereleases.googleblog.com/2026/09/stable-channel-update-for-desktop_0541751186.html)

### 3. GitLabのCVE-2026-85706が実際に悪用、未更新のself-managed環境は要確認

- **重要度:** 高
- **対象:** self-managed GitLab CE / EEを運用するチーム
- **要点:** GitLabが9月10日に修正したCVE-2026-85706は、Repository Commits APIのパストラバーサルにより、認証なしでサーバー上の任意ファイルを読み取られる可能性がある脆弱性で、CVSS 10.0と評価されている。修正版は19.1.8、19.2.6、19.3.2で、公開後に実環境での悪用が確認されている。
- **業務への影響:** GitLabの設定ファイルやログなどから認証情報・シークレットが漏れる可能性がある。インターネットから到達可能なself-managed GitLabを未修正で運用している場合は、更新に加えて侵害の痕跡確認も必要になる。
- **対応:** 今すぐ確認

**出典**
- [Rapid7: CVE-2026-85706 Critical GitLab Path Traversal Exploited in the Wild](https://www.rapid7.com/blog/post/etr-cve-2026-85706-critical-gitlab-path-traversal-exploited-in-the-wild/)

### 4. AcronisのcPanel / WHM向けBackup pluginで権限昇格、限定的な悪用を確認

- **重要度:** 中
- **対象:** Acronis Backup plugin for cPanel & WHM、Acronis Backup extension for PleskをLinuxで利用する管理者
- **要点:** CVE-2026-87886は不適切なファイル権限に起因するローカル権限昇格の脆弱性で、CVSS 7.8と評価されている。cPanel & WHM向けpluginでは限定的な標的型攻撃での悪用が確認されている。cPanel & WHM向けはbuild 1.9.3.1021未満、Plesk向けはbuild 1.8.11.638未満が影響を受ける。
- **業務への影響:** Webホスティング環境で該当pluginを利用している場合、既にサーバーへ足場を持つ攻撃者による権限昇格につながる。該当環境では修正版への更新と不審な操作の確認が必要になる。
- **対応:** 今すぐ確認

**出典**
- [Help Net Security: Acronis backup plugin flaw exploited in targeted attacks](https://www.helpnetsecurity.com/2026/09/16/acronis-backup-plugin-vulnerability-exploited-cve-2026-87886/)

## まとめ

本日はOracleの大規模なセキュリティ更新とChrome 153の公開が直近24時間の主要事項となる。Oracle製品は対象範囲が広いため、利用製品ごとのリスクマトリクス確認が必要である。GitLab CVE-2026-85706とAcronis CVE-2026-87886は実際の悪用が確認されており、該当環境では単なる更新確認ではなく、侵害有無の確認も優先する必要がある。
