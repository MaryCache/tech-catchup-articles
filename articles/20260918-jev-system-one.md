---
title: "『生成しないAI』Jevで、AIエージェントの「意味判断」を分離する"
emoji: "🧩"
type: "tech"
topics: ["ai", "llm", "agent", "jev", "claudecode"]
published: false
---

TypeSafe AIが公開した最初の **System One Model**、「Jev」をEarly Accessで触っています。

TypeSafe AIはJevを「高速」「低コスト」「ハルシネーションしない」と紹介しています。

Jevは自由文生成を主目的にしません。あらかじめ定義した型に沿って、判断と確率を返します。

私のClaude Code環境では、Jevを知る前から機械的な制御を入れていました。`PreToolUse` hookによる危険操作のブロック、認証情報へのアクセス制限、Green / Yellow / Red の権限境界です。

Jevで追加できるのは、その既存の制御と生成LLMの間にある**semantic decision layer**です。deterministicな条件式へ落としにくい意味判断を、typedな出力としてコードへ戻せます。

この記事では、Jevの小規模実験、TypeSafeコミュニティでの議論、共有された実装事例を整理します。

---

## 1. 「文章を生成しないAI」を見つけた

TypeSafe AIは、System One Modelsを「ソフトウェア内部で高速な意思決定を行うためのモデル」として紹介しています。その最初の公開モデルがJevです。

概念的には、通常の生成LLMとの違いをこう捉えると分かりやすいです。

```text
従来の生成LLM

Prompt / Context
      ↓
Free-form text
```

```text
Jev

State + Predefined Questions
      ↓
Typed Decisions + Probabilities
```

Jevのインターフェースでは、自由文を生成する代わりに、あらかじめ定義した型に沿った判断と確率を返します。

「ハルシネーションしない」という表現は分解して読む必要があります。

Jevは、事前に定義されていない自由な文字列や候補を勝手に生成しません。**候補の中から選んだ判断そのものは誤る可能性があります**。

out-of-schemaな出力を防ぐことと、意味判断の正しさは別です。

この記事ではJevを、typed decisionを返すソフトウェア部品として扱います。

---

## 2. Jevは「semantic if」の判定部分に見える

TypeSafeが公開しているワークフローでは、主に次の3種類の判断プリミティブが使われています。

- **Noul**: yes / no の問いに対して確率を返す
- **Choice**: 定義された候補の中から選び、候補ごとの分布を返す
- **Score**: 定義された尺度上で評価する

これを触ったとき、私は便宜的にJevを

> **これまでコードだけでは書きにくかった「semantic if」の条件判定部分を切り出すもの**

として捉えました。

たとえば普通のコードなら、次のような条件分岐は簡単です。

```ts
if (user.age >= 18) {
  // ...
}
```

次の条件は、単純な比較演算子では書きにくいです。

```text
この変更は要求された作業範囲を逸脱しているか？
この文章は既知の事実と矛盾しているか？
このユーザー入力は敵意を含んでいるか？
この記憶は現在のタスクに関連しているか？
```

私の環境では、破壊的操作や認証情報アクセスのように条件を機械的に書けるものはコードで止めていました。

```text
この変更はscope creepか？
この操作は「危険」とまでは言えないが、人間確認へ回すべきか？
この文章はルールの意図に反しているか？
```

**ルールはあるが機械的な条件式へ落としにくい判断**は、Claude自身の自然言語理解へ残っていました。

Jevは制御フローを実行しません。**コード側が条件分岐に利用できる意味的な観測値**を返します。

このsemantic decision layerが、既存構成に追加できる新しい部品です。

---

## 3. Claude CodeではJev以前から機械的制御を使っていた

私のClaude Code環境には、Jevを知る前から明示的なauthority boundaryがあります。

例です。`settings.json` では `.env`、credentials、秘密鍵などへの `Read` をdenyしています。さらに `PreToolUse` hookからPython製のguardを呼び、Claudeが判断を誤っても一部の破壊的操作を**実行前にコードで止める**ようにしています。

guardの対象には、たとえば次のようなものがあります。

```text
git push --force
git reset --hard
git clean -f
git branch -D
git checkout .
--no-verify
--no-gpg-sign
危険なrootへの rm -rf
保護ファイルの削除
認証情報クラスへの書き込み
```

これとは別に、自然言語側にも `AUTHORITY.md` を置き、操作を Green / Yellow / Red に分類しています。

```text
Green  → Claudeの判断で実行してよい
Yellow → 人間確認が必要
Red    → 実行禁止

不明   → Yellow
```

構成は次の通りです。

```text
絶対に止められるもの
→ permissions / hook / code

判断ルール
→ CLAUDE.md / AUTHORITY.md

曖昧な意味判断
→ Claude
```

Jevで、自然言語ルールと生成LLMの間に**typedでprobabilisticなsemantic decision layer**を追加できます。

```text
Deterministic hard rule    → Code / Hook
Semantic / fuzzy decision  → Jev
Deep reasoning             → Reasoning model
Free-form generation       → Generative LLM
Authority / State mutation → Code
Hard invariant             → Code / Proof system
```

Jevは、既存の機械的制御では表現しきれずLLM側へ残っていた意味判断を分離する部品として使えます。

---

## 4. まず自然言語ルールの判定を試した

最初の実験として、自然言語で書いたルールをJevに読ませ、ケースを `Red / Yellow / Green` に分類させてみました。

ここでの意味は次の通りです。

- **Red**: 明確に拒否・停止する
- **Yellow**: 慎重に扱う、または確認へ回す
- **Green**: そのまま進めてよい

手元のテストケースで回帰チェックした結果は、

- Red: **8 / 8**
- Green / Yellow: **14 / 14**

でした。

これは私が作った小さなテストセットでの結果です。Jev全般の精度を示すベンチマークではありません。

このテストでは **confidence** の挙動も確認しました。

---

## 5. confidenceの挙動

ルール文を調整していると、判定結果だけでなくconfidenceが大きく変化するケースがありました。

たとえば `vague_autonomy_skill` というケースでは、当初は次の結果でした。

```text
Before
  result: green
  confidence: 0.68
```

ルールの曖昧な部分を修正すると、

```text
After
  result: yellow
  confidence: 1.00
```

となりました。

期待した分類へ変わっただけでなく、confidenceも大きく上昇しました。

`upload_to_preview` では、ルールを書き換えて期待した分類になった後も、confidenceは **0.28** のままでした。

ルールを読み直すと、そのケースを判断するための根拠や境界条件がまだ十分に明示されていませんでした。

最初の仮説は、**low confidenceを自然言語ルールの曖昧さを探すシグナルとして使う**ことでした。

```text
ルールを書く
    ↓
Jevでケースを判定する
    ↓
想定外の結果 / low confidenceを見る
    ↓
ルールを修正する
    ↓
再実行する
```

この結果から、Jevを**自然言語ルールのリンター**として使う仮説を置きました。

Velvetの実装事例を読んで、この仮説を修正しました。

---

## 6. 細分化してもconfidenceは上がらなかった

さらにルールを書き換えると、別の挙動が出ました。

概念的には次の3パターンです。

```text
A. Greenをデフォルトにし、例外を書く
   → 判定ミス
   → confidence 0.91

B. 条件を複数の明示的なルールへ細分化
   → 判定成功
   → confidence 0.28

C. Yellowをデフォルトにし、明確な例外を書く
   → 判定成功
   → confidence 0.91
```

この実験では、細分化とconfidenceの上昇は一致しませんでした。

Bは判定に成功し、confidenceは0.28でした。Cは判定に成功し、confidenceは0.91でした。

少数例なので一般化はできません。私のテストでは、**細分化 = 明確化ではない**という結果でした。

自然言語ルールは、

```text
原則
+
少数の明確な例外
```

という形で安定するケースがありました。

---

## 7. 実装事例を読んだらconfidenceへの理解が変わった

この実験結果をTypeSafeのDiscordコミュニティへ共有していたところ、別の参加者がJevを組み込んだ「Velvet」のsuccess reportを投稿していました。

Velvetでは、Jevを**typed-decision lane**として既存システムの横に追加しています。

報告書で示されていた基本原則は、次の一文に集約されています。

> The model can propose what happens next; it never decides what became true.

意訳すると、**モデルは「次に何をするか」を提案し、「何が事実になったか」はサーバーコードが決める**という設計です。

Jevは、

- proseを生成しない
- stateを直接変更しない
- commandをauthorizeしない

という位置に置かれています。

Jevの判断を受けて、候補を実際の処理へマッピングするのはサーバーコードです。

判断と権限を分ける設計が、実装として具体化されています。

---

## 8. confidenceを自動化レベルの信号として使う

Velvetはconfidenceを運用ポリシーに使っています。

Velvetはconfidenceを、概念的に次のポリシーへ使っています。

```text
High confidence
  → act

Middle confidence
  → confirm / additional review

Low confidence
  → fallback
```

用途ごとの評価データから **Platt scaling** によるcalibrationも行っていました。

理由の一つは、実測上「判断は正しいのにconfidenceが低め」というsystematic under-confidenceが観測されたからです。

narration-related laneでは、held-out data上でcalibration後の結果がraw confidenceより悪化した例も報告されています。

最初の仮説は次の通りでした。

```text
Low confidence = ルールが曖昧かもしれない
```

現在は次のように扱っています。

```text
Low confidence = 確認・調査対象
```

low confidenceの原因候補は次の通りです。

- ルール自体が曖昧
- 判断に必要なcontextが足りない
- 候補同士の意味が近い
- モデル側のconfidence bias
- calibrationが合っていない
- そもそも判断が難しい


confidenceは、**この判断へシステムがどこまで自動実行の権限を渡すか**を決める入力として使えます。

---

## 9. Atomic Questionへ分解する

Velvetは複雑な判断をAtomic Questionへ分解しています。

例です。

```text
この状況で次に何をするべき？
```

この問いを、次のように分解します。

```text
この候補は進行に寄与している？
優先度はどの程度？
このfactと矛盾している？
このmemoryは現在の文脈に関連している？
このhazardは存在する？
severityはどの程度？
```

小さなNoul / Choice / Scoreへ分解します。

同じstateに対する複数の質問をJevで評価し、その後、

- threshold
- weighting
- ordering
- legality
- composition

などを通常のコードで処理します。

```text
             ┌→ Jev: Question A ─┐
Input State ─┼→ Jev: Question B ─┼→ Server Code → Final Decision
             └→ Jev: Question C ─┘

                     threshold
                     weighting
                     legality
                     composition
```

Jevの出力は**semantic observations**です。最終的な制御フローはコードが所有します。

---

## 10. candidateもコード側が発行する

Velvetでは、候補集合もサーバー側が先に決めています。

例です。

```text
candidate_a
candidate_b
candidate_c
none_of_these
```

という候補だけをJevへ渡す。

Jevはその中から判断し、サーバー側は戻ってきた値をさらにvalidationします。

candidate spaceをコード側で制限し、モデル精度だけに安全性を依存させません。

closed candidate setだけでシステム全体の安全性は保証できません。

候補設計そのものが間違っている可能性もありますし、コード側にバグがある可能性もあります。Jevが候補の中から誤ったものを高confidenceで選ぶこともあり得ます。

モデルが新しい操作や値を発明できる範囲は減らせます。**権限境界はコードが持ちます。**

---

## 11. Shadow → Evaluate → Promote

Velvetは本番権限を渡す前にshadowで動かします。

```text
既存システム
    ↓
Authoritative Decision

同じ入力
    ↓
Jev
    ↓
記録だけする
```

Jevの結果はまだ本番挙動へ反映しません。

その状態でログを集め、

- labeled corpusとの比較
- human review
- accuracy
- coverage
- calibration
- promotion gate

を確認し、基準を満たしたlaneだけをactive化します。

報告時点では7つのlaneが定義されていました。

- director-selection
- adventure-selection
- narration-verification
- memory-reranking
- speaker-routing
- guardrails
- cost-router

報告時点でspeaker-routingだけがactive-capableでした。他はshadow / evidence-only / unwiredを含んでいました。

---

## 12. Velvetで報告されていた実測値

ここからの数字は、**Velvetという特定システム・特定評価条件での結果**です。Jev一般の性能保証ではありません。

### レイテンシ

Room routingでは、

```text
Before
mean 1514 ms / p50 1459 ms

After gated
mean 353 ms / p50 125 ms
```

Directorでは、

```text
Before
mean 1473 ms / p50 1402 ms

After gated
mean 303 ms / p50 121 ms
```

と報告されていました。

p50はRoom routingで1459msから125ms、Directorで1402msから121msに低下しています。

### Structured output

同じレポートでは、測定対象laneでJevは100% schema-validでした。比較対象の既存LLM経路はroutingが95%、Directorが96%でした。

これは、このシステム、この比較経路、この実験で観測された数字です。LLM一般のschema-valid率を示しません。

### Cost

コストは用途で逆転しました。

```text
Room routing
LLM:       $0.0000261
Jev gated: $0.0000328
```

```text
Director
LLM:       $0.0001740
Jev gated: $0.0001281
```

routingではJev側が少し高く、Directorでは安い。

レポート自身のまとめは、

> cost is roughly neutral and latency is not

でした。

この事例では、コスト差よりレイテンシ差が明確でした。

---

## 13. 「100%」の読み方

Velvetの一部laneでは、acted subsetで100% accuracyという結果も出ています。

元レポートは次の限界を明記しています。

- corpusは小さい
- hand-labeled
- frozen dataset
- rareなerror tailが十分含まれていない可能性がある
- thresholdを同じcorpus上で選んだケースもある

という限界を書いています。

**現在の評価集合で誤りを観測しなかったことは、将来も誤らないことの証明ではありません。**

元資料もgreen gateをpromotion candidateとして扱い、proofとは扱っていません。confidenceとaccuracyは継続的な評価対象です。

---

## 14. Browser Agentの責務分離

`browser-use/jev-ultrafast` という公開リポジトリでは、Jevをブラウザ操作エージェントへ利用しています。

大まかな構造は次の通りです。

```text
Browser State / Indexed Elements
          ↓
         Jev
  operation + target
          ↓
    Browser Executor
```

Jevは「何をするか」「どの要素を対象にするか」を判断します。

`TYPE_TEXT` が選ばれ、実際に入力する文章が必要な場合だけ、小さな生成LLMへテキスト生成を依頼します。

```text
判断     → Jev
文章生成 → LLM
実行     → Code
```

という分離です。

モデル出力は、観測済みの要素へ解決した上でexecutorが操作します。モデル出力をそのままCSS selector、座標、shell command、JavaScriptとして実行しません。

---

## 15. Prompt Injectionのsemantic gate案

これは未実装の応用案です。Jevをuntrusted textとメインLLMの間のsemantic gateとして使います。

```text
Untrusted Text
      ↓
     Jev

contains_instruction?
attempts_instruction_override?
requests_secret?
requests_tool_use?
privilege_escalation?

      ↓
Policy Code
      ↓
allow / review / block
```

Jevはセキュリティ境界にしません。Jevも意味判断を誤る可能性があります。

例です。

- filesystem permission
- secret access
- production write
- destructive operation
- tool authorization

のような権限は、通常のコード、sandbox、approval flowで制御します。Jevは意味的に怪しい入力を検知する層として使います。

---

## 16. 自由入力RPG案

TypeSafeコミュニティでは、自由入力RPGへの応用も話しました。

プレイヤーは自然言語で好きな行動を入力できます。

物語・判定・状態更新は分離します。

```text
World Data
+ Current Game State
+ Player Free-form Input
          ↓
         Jev
   Semantic Decisions
          ↓
 Deterministic Game Logic
          ↓
    Confirmed State
          ↓
   Generative LLM
          ↓
  Dialogue / Narration
```

例です。

> 「宿屋の主人を脅して、地下室に何があるか吐かせる」

と入力したとします。

Jevには、

```text
action_type: threaten
npc_reaction: fearful
outcome: partial_success
information_disclosure: hint
```

のような「意味判断」だけをさせる。

その後、ゲームコードがworld dataを確認して、

- このNPCが実際に何を知っているか
- hintとして開示可能な事実は何か
- 好感度や恐怖値をどう更新するか
- quest flagを変更するか

を決定します。

LLMへ渡すのは、最後に確定したstateです。

```text
確定済み:
- 脅迫は部分的に成功
- NPCは怯えている
- 地下室そのものの存在だけを示唆した
- 鍵の場所はまだ明かしていない
```

LLMは、この事実を自然な台詞や描写へ変換する。

こうすればauthoritativeなworld stateをLLMへ直接更新させずに済みます。

**生成されたナレーション自体が確定stateと矛盾する可能性は残ります**。必要なら生成後にverificationを挟みます。

この構成では、世界の「事実」と「表現」を分離できます。小さなゲームで検証する予定です。

---

## 17. Bend / Bend2とproof

RPG案をDiscordで話していたところ、deterministicなworld rulesの候補として **Bend / Bend2** を紹介されました。

Bend側は `LAWS.bend` を「proofで裏付けられたAGENTS.md」という方向性で紹介しています。

分担案は次の通りです。

```text
Jev
→ fuzzy semantic judgment

Bend2 / Proof system
→ hard invariants

Code
→ state transition

Generative LLM
→ narration
```

私のClaude Code環境では、自然言語の `AUTHORITY.md` と `PreToolUse` hookのguardを併用しています。

```text
自然言語で方針を書く
        ↓
機械的に書ける禁止事項はhook / codeへ落とす
```

この運用はJev以前からあります。Bend2では、数学的・論理的に形式化できる不変条件を**proofの対象**にできます。

形式検証そのものは既存技術です。Bend2は新しいコンパイラで、公式も若い実装であることを明記しています。詳細は実際に触ってから別記事にします。

---

## 18. 責務分離をsemantic decisionまで広げる

私のClaude Code環境では、Jev以前からpermissions、hook、authority ruleを組み合わせて、モデルの権限を外側から制御していました。

残っていたのはsemantic decisionです。

```text
コードで判定できない意味的な部分
        ↓
だいたいClaudeに任せる
```

Jevでこの部分を分離できます。

> **「コードで書けない」ことと、「生成LLMに任せるしかない」ことは同じではない。**

現時点の分担は次の通りです。

```text
┌───────────────────────────┬────────────────────┐
│ Responsibility            │ Component          │
├───────────────────────────┼────────────────────┤
│ Deterministic processing  │ Code               │
│ Fuzzy semantic decisions  │ Jev                │
│ Deep reasoning            │ Reasoning model    │
│ Free-form generation      │ Generative LLM     │
│ Permissions / Mutation    │ Code               │
│ Hard invariants           │ Code / Proof       │
└───────────────────────────┴────────────────────┘
```

Jevは判断を間違えます。confidenceは正答率ではありません。ルールやcandidate setの設計にも誤りが入り得ます。外側のコードにもバグがあります。

Jevの役割は、決定論的な制御と生成LLMの間に**「意味を読むが、自由生成も状態変更もしない判断層」**を置くことです。

既存の責務分離をsemantic decisionまで拡張できます。次は、小さなRPGとCoding Agent向けsemantic checkerで検証します。

---

## 参考資料

- TypeSafe AI, *Introducing System One Models and Jev*  
  https://typesafe.ai/blog/introducing-system-one-models-and-jev
- TypeSafe AI, *Workflow evals*  
  https://evals.typesafe.ai/
- TypeSafe AI 公式サイト  
  https://typesafe.ai/
- browser-use, *jev-ultrafast*  
  https://github.com/browser-use/jev-ultrafast
- Bend / Bend2 landing page  
  https://victortaelin.github.io/bend2-landing/

Velvetに関する数値・設計は、TypeSafe Discordコミュニティで共有されていた `Jev (TypeSafe System One) success report` を参照しています。公開URLが確認できた場合は、公開前に追記予定です。
