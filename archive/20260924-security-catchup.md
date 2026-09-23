---
date: "2026-09-24"
category: "セキュリティ"
slug: "security"
items: 4
---

# 2026-09-24 セキュリティ 技術キャッチアップ

## 概要

2026年9月24日時点で、直近24時間を中心にセキュリティ情報を調査した。実際の悪用が確認されている脆弱性と、認証なしで遠隔コード実行に至る可能性がある企業向け製品の更新を優先した。

## 重要な更新

### 1. Check Point Management ServerのCVE-2026-93616が実際の攻撃で悪用

- **重要度:** 高
- **対象:** Check Point Security Management Server、Multi-Domain Server、Log Server、SmartEventを運用する組織
- **要点:** Check PointはCVE-2026-93616について、認証前の攻撃によってManagement Serverへ任意のスクリプトをアップロード・実行できる脆弱性を公表し、実際の悪用を確認している。Security Management基盤はポリシーや管理情報を集約するため、侵害時の影響範囲が大きい。
- **業務への影響:** 対象環境ではJumbo Hotfix等の適用に加え、既に侵害されていないかログやベンダー公開の確認手順を用いた調査が必要になる。
- **対応:** 今すぐ確認

**出典**
- [Check Point: Security Advisory – Active Exploitation of CVE-2026-85102 and CVE-2026-93616](https://blog.checkpoint.com/security/security-advisory-action-required-active-exploitation-of-cve-2026-85102-and-a-management-pre-authentication-vulnerability-cve-2026-93616/)

### 2. F5 BIG-IP APMのCVE-2026-94127がゼロデイとして悪用

- **重要度:** 高
- **対象:** BIG-IP APMをOAuth Authorization Serverとして利用する組織
- **要点:** F5はBIG-IP Access Policy ManagerのCVE-2026-94127について、実際の悪用を確認した。APM access policyとOAuth Authorization Server profileを同じvirtual serverに設定した構成で、認証されていない遠隔の攻撃者が任意コードを実行できる可能性がある。CVSS v3.1は9.8。
- **業務への影響:** 該当構成のBIG-IPは認証基盤や外部公開サービスの入口に置かれることが多く、侵害時の影響が大きい。F5が公開したengineering hotfixの適用と侵害痕跡の確認を優先する必要がある。
- **対応:** 今すぐ確認

**出典**
- [Rapid7: CVE-2026-94127 Critical Unauthenticated RCE in F5 BIG-IP APM](https://www.rapid7.com/blog/post/etr-cve-2026-94127-critical-unauthenticated-rce-in-f5-big-ip-apm/)

### 3. Arista VeloCloud OrchestratorのCVE-2026-93952が悪用中

- **重要度:** 高
- **対象:** VeloCloud Orchestrator On-Premを証明書ベースのEdge認証で運用する組織
- **要点:** AristaはVeloCloud Orchestrator On-PremのCVE-2026-93952が実際に悪用されていることを公表した。証明書ベースでEdgeを認証する構成が対象で、VCOの認証情報なしに特権的な内部機能へアクセスされる可能性がある。CVSS v3.1は10.0。
- **業務への影響:** 5.2系と6.4系には修正版が提供されている一方、公開時点では6.1系と7.0系の修正が未提供だった。対象環境では修正版の有無を確認し、Web UIへのアクセス制限や侵害痕跡の調査を並行して行う必要がある。
- **対応:** 今すぐ確認

**出典**
- [Arista Security Advisory 0183](https://www.arista.com/en/support/advisories-notices/security-advisory/24765-security-advisory-0183)

### 4. SolarWinds Observability Self-Hosted 2026.2.3で遠隔コード実行脆弱性を修正

- **重要度:** 高
- **対象:** SolarWinds Observability Self-Hostedを運用する組織
- **要点:** SolarWinds Observability Self-Hosted 2026.2.3で、CVE-2026-28324とCVE-2026-28325を含む遠隔コード実行につながる脆弱性が修正された。CVE-2026-28324はCVSS 9.8とされ、特定の構成では認証されていない攻撃者から到達可能と報告されている。
- **業務への影響:** Observabilityサーバーは監視対象や運用情報へ広く接続するため、該当製品を利用している場合は構成条件を確認し、2026.2.3への更新を検討する必要がある。
- **対応:** 今週中に確認

**出典**
- [SolarWinds Observability Self-Hosted Release Notes](https://documentation.solarwinds.com/en/success_center/orionplatform/content/release_notes/solarwinds_platform_2026-2-3_release_notes.htm)

## まとめ

本日はネットワーク・認証・管理基盤を狙う重大な脆弱性が集中した。Check Point、F5 BIG-IP APM、Arista VeloCloud Orchestratorはいずれも実際の悪用が確認されており、該当製品を運用する環境ではパッチ適用だけでなく侵害痕跡の確認も必要となる。SolarWinds Observability Self-Hostedについても、対象構成では認証なしの遠隔コード実行につながるため更新状況を確認する。