---
date: "2026-10-01"
category: "セキュリティ"
slug: "security"
items: 4
---

# 2026-10-01 セキュリティ 技術キャッチアップ

## 概要

2026年10月1日時点で、直近24時間を中心にセキュリティ更新を調査した。実際の悪用が確認されたネットワーク境界製品の脆弱性を最優先し、直近7日以内に公開された重大な修正を補完的に採用した。

## 重要な更新

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

## まとめ

本日は、Cisco Catalyst SD-WAN Manager、Citrix NetScaler、Zimbraで実際の悪用が確認または報告された脆弱性を優先した。特にインターネット境界や管理基盤に位置する製品は、修正適用だけでなく侵害痕跡の確認も必要となる。WatchGuard Fireware OSについても重大なRCE脆弱性が公開されており、該当構成では修正版への更新状況を確認する。
