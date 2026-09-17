---
title: "JevでAIエージェントの「意味判断」を分離する"
emoji: "🧩"
type: "tech"
topics: ["ai", "llm", "agent", "jev", "claudecode"]
published: false
---

私はClaude Codeを、自分用のルールとhookを追加しながら使っています。

Jevを知る前から、機械的に判定できる危険操作はコード側で止めていました。`PreToolUse` hookで破壊的なGit操作や危険な削除をブロックし、`.env` やcredentialsへのアクセスも制限しています。操作権限は `AUTHORITY.md` で Green / Yellow / Red に分けています。

この構成でも、コードだけでは判定しにくい処理が残ります。

```text
この変更はscope creepか？
この操作は人間確認へ回すべきか？
この文章はルールの意図に反しているか？
この記憶は今のタスクに関連しているか？
```

こうした判断は、これまでClaude自身の自然言語理解に任せていました。

そこでTypeSafe AIの **Jev** を試しました。Jevは自由文を生成せず、事前に定義した質問に対して型付きの判断と確率を返します。

この記事で扱うのは、JevそのもののAPI紹介だけではありません。主題は、**決定論的なコードと生成LLMの間に「意味判断だけを担当する層」を置けるか**です。

以下の順で整理します。

1. Jevが何を返すモデルなのか
2. 既存のClaude Code構成のどこに入るのか
3. 自然言語ルールを判定させたとき何が起きたか
4. confidenceをどう扱うべきか
5. コミュニティで共有されたVelvetの実装事例から何を学べるか
6. Browser Agent、Prompt Injection、RPGへどう応用できるか

---

## 1. Jevは何を返すのか

最初に、この記事で前提にするJevの性質を整理します。後の章では、この出力形式を使って自然言語ルールを判定し、コード側の制御につなげます。

TypeSafe AIはSystem One Modelsを、ソフトウェア内部の意思決定に使うモデルとして公開しています。その最初の公開モデルがJevです。

通常の生成LLMとの違いは、出力形式を見ると分かりやすいです。

```text
生成LLM

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

Jevの主要な判断プリミティブとして、次の3種類が使われています。

- **Noul**: yes / no の問いに対して確率を返す
- **Choice**: 定義された候補から選び、候補ごとの分布を返す
- **Score**: 定義された尺度上で評価する

たとえば、通常のコードで次の条件は簡単に書けます。

```ts
if (user.age >= 18) {
  // ...
}
```

一方、次の条件は単純な比較演算子では書けません。

```text
この変更は要求された範囲を逸脱しているか？
この文章は既知の事実と矛盾しているか？
この入力は敵意を含んでいるか？
```

私はJevを、こうした **semantic if の判定材料を返す部品**として捉えています。

Jevは制御フローを実行しません。Jevが返した判断を使って、実際に分岐するのはコード側です。

ここで「ハルシネーションしない」という表現は分解して読む必要があります。Jevは事前に定義されていない自由文や候補を生成しません。**候補の中から選んだ意味判断そのものは誤る可能性があります**。

つまり、out-of-schemaな出力を防ぐことと、判断の正しさは別です。

この性質を前提にすると、Jevをどこへ置くべきかが決まります。次の章では、私がすでに使っていた機械的制御と、その外側に残っていた意味判断を分けます。

---

## 2. 既存のClaude Code構成に残っていた「意味判断」

Jevを導入する前から、機械的に表現できるルールはClaudeの外側へ出していました。この章では、すでにコード化できていた部分と、まだ生成LLM側に残っていた部分を整理します。

私のClaude Code環境には、`settings.json` のpermissionsと `PreToolUse` hookがあります。hookからPython製のguardを呼び、Claudeが判断を誤っても一部の危険操作を実行前に止めます。

対象には、たとえば次のものがあります。

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

認証情報については、`.env`、credentials、秘密鍵などへのアクセスも別途制限しています。

これとは別に `AUTHORITY.md` を置き、操作を3段階に分類しています。

```text
Green  → Claudeの判断で実行してよい
Yellow → 人間確認が必要
Red    → 実行禁止

不明   → Yellow
```

ここまでを分けると、構成は次のようになります。

```text
機械的に判定できる禁止事項
→ permissions / hook / code

人間が書いた運用ルール
→ CLAUDE.md / AUTHORITY.md

ルールを読んだ上で必要になる意味判断
→ Claude
```

問題は最後の層です。

`AUTHORITY.md` にルールを書いても、「このケースがそのルールに該当するか」は自然言語の解釈を必要とします。たとえば次のような判断です。

```text
この変更はscope creepか？
この操作はYellowへ回すべきか？
このケースは例外条件に入るか？
```

ここを生成LLMから分離して、typedな判断として取り出せるかを試したのが次の実験です。

---

## 3. 自然言語ルールをRed / Yellow / Greenへ分類させる

最初の実験では、実際に使っている自然言語ルールをJevへ渡し、ケースを `Red / Yellow / Green` に分類させました。ここでは精度そのものより、判定結果とconfidenceがルール変更にどう反応するかを見ます。

分類の意味は次の通りです。

- **Red**: 明確に拒否・停止する
- **Yellow**: 慎重に扱う、または確認へ回す
- **Green**: そのまま進めてよい

手元のテストケースで回帰チェックした結果は、次の通りでした。

- Red: **8 / 8**
- Green / Yellow: **14 / 14**

これは私が作った小さなテストセットでの結果です。Jev全般の精度を示すベンチマークではありません。

このテストで注目したのがconfidenceです。ルール文を変えると、分類だけでなくconfidenceも大きく変わるケースがありました。

### `vague_autonomy_skill`

最初の結果は次の通りです。

```text
Before
  result: green
  confidence: 0.68
```

ルールの曖昧な部分を修正すると、次の結果になりました。

```text
After
  result: yellow
  confidence: 1.00
```

分類が期待値へ変わり、confidenceも上がりました。

### `upload_to_preview`

別のケースでは、ルールを書き換えて期待した分類になった後も、confidenceは **0.28** のままでした。

ルールを読み直すと、そのケースを判断するための根拠や境界条件が十分に明示されていませんでした。

この結果から、最初は次の使い方を考えました。

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

つまり、low confidenceを自然言語ルールの曖昧さを探す手がかりにする方法です。

この時点で確認できたのは、low confidenceが調査対象を見つける手がかりになったことまでです。次の追加実験とVelvetの実装事例を使って、confidenceの扱いを整理します。

---

## 4. ルールを細分化してもconfidenceは上がらない

次に確認したのは、ルールの書き方です。「条件を細かく分ければ判断しやすくなる」という仮説を試しました。

同じ種類のルールを3通りに書き換えた結果は、概念的に次の通りです。

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

このテストでは、条件を増やしたBで判定は正しくなりましたが、confidenceは0.28まで下がりました。Cでは、保守的なデフォルトを固定し、明確な例外だけを置くことで判定とconfidenceの両方が安定しました。

少数例なので一般化はできません。確認できたのは、**細分化と明確化は同じではない**ということです。

自然言語ルールでは、次の形が安定するケースがありました。

```text
原則
+
少数の明確な例外
```

ここまでの実験で、confidenceはルール設計の診断材料になりました。この実験だけではconfidenceの意味までは決められません。

その判断材料になったのが、TypeSafeのDiscordコミュニティで共有されていたVelvetの実装レポートです。

---

## 5. VelvetではJevを「判断専用レーン」として使っていた

Velvetのレポートでは、Jevを既存LLMの置き換えとして使っていません。Jevを **typed-decision lane** として既存システムの横に追加しています。

この章では、Velvetの設計から次の4点を取り上げます。

1. 判断と権限を分ける
2. confidenceを自動化レベルの信号として使う
3. 複雑な判断をAtomic Questionへ分解する
4. 本番投入前にshadowで評価する

### 5.1 判断と権限を分ける

レポートの基本原則は次の一文です。

> The model can propose what happens next; it never decides what became true.

モデルは次の行動を提案できます。何が事実になったかを確定するのはサーバーコードです。

Jevは、

- proseを生成しない
- stateを直接変更しない
- commandをauthorizeしない

という位置に置かれています。

候補を実際の処理へマッピングするのもサーバーコードです。

この設計では、Jevの判断精度と、システムがJevへ渡す権限を別々に管理できます。

### 5.2 confidenceを自動化レベルの信号として使う

Velvetはconfidenceを、正答率そのものとして扱っていません。運用ポリシーの入力として使っています。

```text
High confidence
  → act

Middle confidence
  → confirm / additional review

Low confidence
  → fallback
```

さらに、用途ごとの評価データから **Platt scaling** によるcalibrationを行っています。

その理由の一つとして、判断が正しいケースでもconfidenceが低めに出るsystematic under-confidenceが観測されています。

一方、narration-related laneでは、held-out data上でcalibration後の結果がraw confidenceより悪化した例も報告されています。

この事例を踏まえると、私の実験で使ったconfidenceの解釈は次のように整理できます。

```text
誤った解釈
Low confidence = ルールが曖昧

使える解釈
Low confidence = 確認・調査対象
```

low confidenceの原因は複数考えられます。

- ルール自体が曖昧
- contextが足りない
- 候補同士の意味が近い
- model側のconfidence bias
- calibrationが合っていない
- 判断対象そのものが難しい

つまり、confidenceは**この判断をどこまで自動実行へ使うか**を決めるための観測値として扱えます。

### 5.3 Atomic Questionへ分解する

Velvetは複雑な判断を、一つの大きな問いとして投げません。

たとえば、

```text
この状況で次に何をするべき？
```

という問いを、次のように分解します。

```text
この候補は進行に寄与している？
優先度はどの程度？
このfactと矛盾している？
このmemoryは現在の文脈に関連している？
このhazardは存在する？
severityはどの程度？
```

同じstateに対して複数のNoul / Choice / Scoreを評価し、その後にコード側で、

- threshold
- weighting
- ordering
- legality
- composition

を処理します。

```text
             ┌→ Jev: Question A ─┐
Input State ─┼→ Jev: Question B ─┼→ Server Code → Final Decision
             └→ Jev: Question C ─┘

                     threshold
                     weighting
                     legality
                     composition
```

Jevの出力はsemantic observationsです。最終的な制御フローはコードが所有します。

candidate setもサーバー側が先に決めます。

```text
candidate_a
candidate_b
candidate_c
none_of_these
```

Jevはこの候補の中から判断し、サーバー側が戻り値をvalidationします。

closed candidate setだけで安全性は保証できません。候補設計やコード側に誤りがある可能性は残ります。それでも、モデルが候補外の操作や値を作る範囲を減らせます。

### 5.4 Shadow → Evaluate → Promote

VelvetはJevへ本番権限を渡す前にshadowで動かします。

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

報告時点でspeaker-routingだけがactive-capableで、他はshadow / evidence-only / unwiredを含んでいました。

ここまでがVelvetの設計です。次に、同じレポートに載っていた実測値を確認します。

---

## 6. Velvetの実測値

この章の数字は、**Velvetという特定システム・特定評価条件での結果**です。Jev一般の性能保証ではありません。

### レイテンシ

Room routing:

```text
Before
mean 1514 ms / p50 1459 ms

After gated
mean 353 ms / p50 125 ms
```

Director:

```text
Before
mean 1473 ms / p50 1402 ms

After gated
mean 303 ms / p50 121 ms
```

p50はRoom routingで1459msから125ms、Directorで1402msから121msに低下しています。

### Structured output

測定対象laneで、Jevは100% schema-validでした。比較対象の既存LLM経路はroutingが95%、Directorが96%でした。

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

routingではJev側が少し高く、Directorでは安い結果です。

レポート自身のまとめは次の通りです。

> cost is roughly neutral and latency is not

この事例では、コスト差よりレイテンシ差が明確でした。

### 100%という数字の扱い

一部laneではacted subsetで100% accuracyという結果も出ています。

元レポートは、次の限界を明記しています。

- corpusは小さい
- hand-labeled
- frozen dataset
- rareなerror tailが十分含まれていない可能性がある
- thresholdを同じcorpus上で選んだケースもある

現在の評価集合で誤りを観測しなかったことは、将来も誤らないことの証明ではありません。

元資料もgreen gateをpromotion candidateとして扱い、proofとは扱っていません。

Velvetから得られる実務上のポイントは、精度の数字そのものより、**判断を小さく分け、権限をコードへ残し、shadowで測ってから自動化範囲を広げる**という導入手順です。

この構造は、別のJev実装にも現れています。

---

## 7. Browser Agentでも判断・生成・実行を分ける

`browser-use/jev-ultrafast` では、Jevをブラウザ操作エージェントへ使っています。この例を見ると、semantic decision layerをGUI操作へどう適用するかが分かります。

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

`TYPE_TEXT` が選ばれ、実際に入力する文章が必要になった場合だけ、小さな生成LLMへテキスト生成を依頼します。

```text
判断     → Jev
文章生成 → LLM
実行     → Code
```

モデル出力は観測済みの要素へ解決した上でexecutorが操作します。モデル出力をそのままCSS selector、座標、shell command、JavaScriptとして実行しません。

ここまでの例から、Jevの配置パターンはかなり明確になります。意味判断だけをJevへ渡し、実行権限と状態更新はコードへ残します。

このパターンを前提にすると、未実装の応用案も整理しやすくなります。

---

## 8. 応用案: Prompt Injectionのsemantic gate

最初の応用案はPrompt Injection対策です。これは未実装です。

untrusted textをメインLLMへ渡す前に、Jevで意味的な危険信号を取ります。

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

ここでも、Jevはセキュリティ境界にしません。Jev自身が意味判断を誤る可能性があるためです。

次の権限は、通常のコード、sandbox、approval flowで制御します。

- filesystem permission
- secret access
- production write
- destructive operation
- tool authorization

Jevの役割は、コードだけでは拾いにくい意味的な警告を追加することです。

同じ分離は、自由入力RPGにも使えます。

---

## 9. 応用案: 自由入力RPG

TypeSafeコミュニティでは、自由入力RPGへの応用も話しました。ここでは、プレイヤー入力の意味判断、ゲーム状態の更新、文章生成を分けます。

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

たとえば、プレイヤーが次のように入力します。

> 「宿屋の主人を脅して、地下室に何があるか吐かせる」

Jevには意味判断だけをさせます。

```text
action_type: threaten
npc_reaction: fearful
outcome: partial_success
information_disclosure: hint
```

その後、ゲームコードがworld dataを確認し、

- このNPCが実際に何を知っているか
- hintとして開示可能な事実は何か
- 好感度や恐怖値をどう更新するか
- quest flagを変更するか

を決定します。

LLMへ渡すのは、確定したstateです。

```text
確定済み:
- 脅迫は部分的に成功
- NPCは怯えている
- 地下室そのものの存在だけを示唆した
- 鍵の場所はまだ明かしていない
```

LLMはこの事実を台詞や描写へ変換します。

この構成なら、authoritativeなworld stateをLLMへ直接更新させずに済みます。

生成されたナレーションが確定stateと矛盾する可能性は残るため、必要なら生成後にverificationを入れます。

このRPG案をコミュニティで話したところ、hard invariantの扱いとしてBend / Bend2を紹介されました。

---

## 10. Bend / Bend2でhard invariantをさらに外へ出す

Bend側は `LAWS.bend` を「proofで裏付けられたAGENTS.md」という方向性で紹介しています。

この話は、Jevとは別の層に関係します。

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

私のClaude Code環境では、Jev以前から次の運用をしていました。

```text
自然言語で方針を書く
        ↓
機械的に書ける禁止事項はhook / codeへ落とす
```

Bend2は、このうち数学的・論理的に形式化できる不変条件をproofの対象へ移す候補です。

形式検証そのものは既存技術です。Bend2は新しいコンパイラで、公式も若い実装であることを明記しています。ここでは位置づけだけに留め、詳細は実際に触ってから別記事にします。

これで、この記事で扱った各層を一つの図にまとめられます。

---

## 11. まとめ: semantic decisionを独立した層にする

この記事では、Jevを既存のClaude Code構成へ追加する前提で整理しました。

Jev以前から、機械的に判定できる禁止事項はpermissions、hook、codeへ出していました。`AUTHORITY.md` には人間が読む運用ルールを置いていました。

残っていたのは、ルールを読んだ上で必要になる意味判断です。

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

Jevは、その意味判断をtypedな出力として切り出します。

この構成で重要なのは、Jevを正しさの保証装置として扱わないことです。Jevは判断を間違えます。confidenceは正答率ではありません。candidate setや外側のコードにも誤りは入り得ます。

その前提で、

```text
意味判断
→ Jev

自動化レベル
→ confidence + policy

候補・権限・状態更新
→ code

自由文生成
→ generative LLM
```

と責務を分けます。

私がJevで追加したかったのは、新しい万能モデルではありません。**決定論的な制御と生成LLMの間に置くsemantic decision layer**です。

次は、小さなRPGとCoding Agent向けsemantic checkerでこの構成を検証します。

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
