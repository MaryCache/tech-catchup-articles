---
title: "『生成しないAI』Jevを触ってみたら、LLMに任せすぎていたことに気づいた"
emoji: "🧩"
type: "tech"
topics: ["ai", "llm", "agent", "jev", "claudecode"]
published: false
---

TypeSafe AIが公開した最初の **System One Model**、「Jev」をEarly Accessで触っています。

最初に気になったのは、公式がかなり強い言葉で「高速」「低コスト」「ハルシネーションしない」と打ち出していたことでした。

ただ、実際にAPIを触ってみると、JevはChatGPTやClaudeのような生成LLMをそのまま小型・高速化したものではありませんでした。

むしろ、**文章生成を捨てて、ソフトウェアから直接使える“判断”に特化したモデル**です。

そして触っているうちに、Jevそのもの以上に面白いことに気づきました。

> 私たちはこれまで、LLMという一つの箱に「理解」「判断」「制御」「生成」を詰め込みすぎていたのではないか？

この記事では、Jevを実際に試した小規模な実験、TypeSafeコミュニティでの議論、コミュニティで共有されていた実装事例から得た知見を整理します。

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

ここで「ハルシネーションしない」という表現には注意が必要です。

Jevは、事前に定義されていない自由な文字列や候補を勝手に生成しない、という意味では生成LLMとはかなり性質が違います。一方で、**候補の中から選んだ判断そのものが常に正しいわけではありません**。

「out-of-schemaな出力を作らないこと」と「意味判断を間違えないこと」は別です。

この違いを理解したあたりから、Jevを「新しいLLM」として見るよりも、ソフトウェアの部品として考える方がしっくりくるようになりました。

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

一方で、

```text
この変更は要求された作業範囲を逸脱しているか？
この文章は既知の事実と矛盾しているか？
このユーザー入力は敵意を含んでいるか？
この記憶は現在のタスクに関連しているか？
```

といった条件は、単純な比較演算子では書きにくい。

これまでは、この種の判断を丸ごとLLMへ投げることが多かったと思います。

Jevは制御フローそのものを実行するわけではありません。Jevが返すのは、**コード側が条件分岐に利用できる意味的な観測値**です。

---

## 3. 今までLLMに任せすぎていたのでは？

Coding Agentを含むLLMエージェントでは、1つのモデルに多くの責務を持たせがちです。

```text
現在の状況を理解する
        ↓
ルールを読む
        ↓
意味を判断する
        ↓
次の行動を計画する
        ↓
ツール実行を要求する
        ↓
ホスト側が実行する
        ↓
結果を文章で説明する
```

もちろん、これは非常に便利です。

ただ、そのすべてを同じ生成モデルの推論へ載せる必要があるのか、と考えるようになりました。

現時点では、私はだいたい次のように責務を分けて考えています。

```text
Deterministic processing   → Code
Semantic / fuzzy decision  → Jev
Deep reasoning             → Reasoning model
Free-form generation       → Generative LLM
Authority / State mutation → Code
Hard invariant             → Code / Proof system
```

要するに、

> **機械的に制御できるものは、できるだけ機械側へ戻す。**

Jevを触って最初に得た大きな気づきはこれでした。

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

ただし、これは私が作った小さなテストセットでの結果です。Jev全般の精度を示すベンチマークではありません。

この時点で面白かったのは、分類精度以上に **confidence** の挙動でした。

---

## 5. confidenceが面白かった

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

一方、`upload_to_preview` というケースでは、ルールを書き換えることで期待した分類になったにもかかわらず、confidenceは **0.28** のままでした。

ルールを読み直すと、そのケースを判断するための根拠や境界条件がまだ十分に明示されていませんでした。

ここで最初に考えたのが、

> **low confidenceを、自然言語ルールの曖昧さを探すためのシグナルとして使えるのではないか？**

という仮説です。

つまり、

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

というループです。

これはかなり面白く、Jevを「ルール実行器」だけでなく、**自然言語ルールのリンターのように使えるかもしれない**と考えました。

ただし、後でこの理解は少し修正することになります。

---

## 6. 「細かく書けば明確になる」とも限らなかった

さらにルールを書き換えていると、別の面白い挙動が出ました。

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

つまり、**条件を細かく書けば書くほど、モデルにとって明確になるとは限らなかった**わけです。

Bでは判定自体は正しくなりましたが、どの条件に該当するかの境界が複雑になったためか、confidenceはかなり低いままでした。

一方Cでは、先に保守的なデフォルトを置き、そこから外れる条件だけを明示することで、判定とconfidenceの両方が安定しました。

この少数の実験だけから一般則にはできませんが、少なくとも私のケースでは、

> **細分化 = 明確化ではない**

というのは大きな発見でした。

自然言語ルールも、

```text
原則
+
少数の明確な例外
```

という形の方が扱いやすい場合がありそうです。

---

## 7. 実装事例を読んだらconfidenceへの理解が変わった

この実験結果をTypeSafeのDiscordコミュニティへ共有していたところ、別の参加者がJevを組み込んだ「Velvet」のsuccess reportを投稿していました。

この資料がかなり参考になりました。

Velvetでは、Jevを既存のLLMを丸ごと置き換えるモデルとしてではなく、**typed-decision lane**として既存システムの横に追加しています。

報告書で示されていた基本原則は、次の一文に集約されています。

> The model can propose what happens next; it never decides what became true.

意訳すると、

> **モデルは「次に何をするか」を提案できる。ただし「何が事実になったか」を決めるのはモデルではない。**

という考え方です。

Jevは、

- proseを生成しない
- stateを直接変更しない
- commandをauthorizeしない

という位置に置かれています。

Jevの判断を受けて、候補を実際の処理へマッピングするのはサーバーコードです。

これは、私がJevを触りながら考えていた「判断と権限を分ける」という方向性を、かなり徹底して実装した例に見えました。

---

## 8. confidenceは「正しさ」ではなく「どこまで任せるか」

Velvetで特に面白かったのがconfidenceの使い方です。

confidenceをそのまま「正答確率」として信じるのではなく、概念的に次のようなポリシーへ使っています。

```text
High confidence
  → act

Middle confidence
  → confirm / additional review

Low confidence
  → fallback
```

さらに、生のconfidenceをそのまま使うのではなく、用途ごとの評価データから **Platt scaling** によるcalibrationも行っていました。

理由の一つは、実測上「判断は正しいのにconfidenceが低め」というsystematic under-confidenceが観測されたからです。

しかもcalibrationが常に改善するわけではなく、narration-related laneではheld-out data上でraw confidenceより悪化した例も報告されています。

ここで、私の最初の仮説を少し修正しました。

```text
最初に考えたこと
Low confidence = ルールが曖昧かもしれない
```

から、

```text
今の理解
Low confidence = 何かを確認・調査した方がよいシグナル
```

へ。

low confidenceになる理由は、ルールの曖昧さだけとは限りません。

私なりに原因候補を整理すると、

- ルール自体が曖昧
- 判断に必要なcontextが足りない
- 候補同士の意味が近い
- モデル側のconfidence bias
- calibrationが合っていない
- そもそも判断が難しい

などが考えられます。

つまりconfidenceは、単なるモデル側の診断値ではなく、

> **この判断へ、システムがどこまで自動実行の権限を渡すか**

を決める入力として使える。

この見方は、Jevを触り始めたときには持っていませんでした。

---

## 9. 一つの巨大な質問ではなく、Atomic Questionへ分解する

Velvetでもう一つ参考になったのが、複雑な判断を一問で聞かないことです。

たとえば、

```text
この状況で次に何をするべき？
```

と丸ごと聞く代わりに、

```text
この候補は進行に寄与している？
優先度はどの程度？
このfactと矛盾している？
このmemoryは現在の文脈に関連している？
このhazardは存在する？
severityはどの程度？
```

のように、小さなNoul / Choice / Scoreへ分解します。

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

ここでJevが出しているのは最終決定ではなく、**semantic observations**です。

最終的な制御フローはコードが所有する。

この分離はかなり重要だと思います。

---

## 10. candidateもコード側が発行する

Velvetでは、候補集合もサーバー側が先に決めています。

たとえば、

```text
candidate_a
candidate_b
candidate_c
none_of_these
```

という候補だけをJevへ渡す。

Jevはその中から判断し、サーバー側は戻ってきた値をさらにvalidationします。

この設計の面白いところは、

> **「AIが十分賢いから安全」ではなく、「AIが間違えたときにできることをコード側で狭める」**

という発想になっていることです。

もちろん、closed candidate setにしただけでシステム全体が安全になるわけではありません。

候補設計そのものが間違っている可能性もありますし、コード側にバグがある可能性もあります。Jevが候補の中から誤ったものを高confidenceで選ぶこともあり得ます。

それでも、モデルが勝手に新しい操作や値を発明できる範囲を減らせるのは大きい。

AIの精度だけへ依存するのではなく、**権限境界をコードで持つ**という設計です。

---

## 11. Shadow → Evaluate → Promote

新しい判断モデルを本番へ入れるとき、いきなり権限を渡さないという点も参考になりました。

Velvetでは、まずshadowで動かします。

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

ただし、すべてが本番権限を持っていたわけではありません。speaker-routingだけがactive-capableで、他はshadow / evidence-only / unwiredを含んでいました。

「実装できた」ことと「本番で任せてよい」ことを分けているのが印象的です。

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

特にp50の差はかなり大きいです。

### Structured output

同じレポートでは、測定対象laneでJevは100% schema-validだった一方、比較対象の既存LLM経路ではroutingが95%、Directorが96%でした。

ここも「LLMは一般に5%壊れる」という意味ではありません。

あくまで、このシステム、この比較経路、この実験で観測された数字です。

### Cost

コストはさらに面白く、Jevが常に安かったわけではありません。

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

少なくともこの事例では、「何でも劇的に安くなる」より、**レイテンシ改善の方がはっきりしていた**という結果です。

---

## 13. 「100%」という数字には注意する

Velvetの一部laneでは、acted subsetで100% accuracyという結果も出ています。

ただし、元レポート自身がかなり慎重です。

- corpusは小さい
- hand-labeled
- frozen dataset
- rareなerror tailが十分含まれていない可能性がある
- thresholdを同じcorpus上で選んだケースもある

という限界を書いています。

要するに、

> **現在の評価集合で誤りを観測しなかったことは、将来も誤らないことの証明ではない。**

ということです。

元資料も「green gateはproofではなく、promotion candidateにすぎない」という立場を取っています。

confidenceもaccuracyも、単独の数字を信仰するのではなく、運用の中で継続して測るものだと感じます。

---

## 14. Browser Agentでも「判断・生成・実行」が分かれていた

この設計思想は、別のJev活用例でも見えます。

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

一方、`TYPE_TEXT` が選ばれ、実際に入力する文章が必要になった場合だけ、小さな生成LLMへテキスト生成を依頼します。

つまり、

```text
判断     → Jev
文章生成 → LLM
実行     → Code
```

という分離です。

さらにこの実装では、モデル出力をそのままCSS selectorや座標、shell command、JavaScriptとして実行しないようにし、実際に観測済みの要素へ解決した上でexecutorが操作します。

ここでも「モデルに何でも自由に出力させ、そのまま実行する」構造にはしていません。

---

## 15. Prompt Injectionの前段にも使えるのでは？

ここからは、まだ私が実装していない応用案です。

Jevを、untrusted textをメインLLMへ渡す前のsemantic gateとして使えないかと考えています。

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

ただし、これは **Jevをセキュリティ境界そのものにする** という意味ではありません。

Jevも意味判断を誤る可能性があります。

たとえば、

- filesystem permission
- secret access
- production write
- destructive operation
- tool authorization

のような権限は、最終的には通常のコードやsandbox、approval flowで制御すべきです。

Jevを置くなら、あくまで「意味的に怪しい入力を早い段階で検知する層」の一つとして、というのが今の考えです。

---

## 16. RPGを作ったらかなり面白そう

もう一つ、TypeSafeコミュニティで話していたのが自由入力RPGです。

プレイヤーは自然言語で好きな行動を入力できます。

ただし、物語・判定・状態更新を全部LLMへ任せません。

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

たとえば、

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

もちろん、**生成されたナレーション自体が確定stateと矛盾する可能性は残ります**。そのため必要なら、生成後に別のverificationを挟む設計も考えられます。

自由度を残しながら、世界の「事実」と「表現」を分離できるのではないか。これは実際に小さなゲームを作って試してみたいところです。

---

## 17. コミュニティでBend / Bend2を教えてもらった

RPG案をDiscordで話していたところ、deterministicなworld rulesの候補として **Bend / Bend2** を紹介されました。

Bend側は `LAWS.bend` を「proofで裏付けられたAGENTS.md」という方向性で紹介しています。

そこで考えたのが、次の分担です。

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

今のCoding Agentでは、`CLAUDE.md` や `AGENTS.md` に

```text
この条件では絶対にXしないでください
この不変条件を壊さないでください
```

と自然言語で書き、モデルが守ることを期待する場面があります。

その中で数学的・論理的に形式化できるものなら、instructionではなくcode / proof側へ移せる可能性があります。

ただし、形式検証そのものは昔からある技術ですし、Bend2自体も新しいコンパイラで、公式もまだ若い実装であることを明記しています。

ここはこの記事の本題ではないので、今後実際に触ってから別途書きたいと思います。

---

## 18. 「どのLLMを使うか」から「どの責務をどこへ渡すか」へ

Jevを触る前、AIを使ったシステムを考えるときの関心は、かなり「どのモデルを使うか」に寄っていました。

しかし、Jevを試し、コミュニティの実装事例を読み、他の応用例を追ううちに、少し見方が変わりました。

> **どのLLMを使うかだけではなく、どの責務を、どの部品へ割り振るか。**

現時点では、次の分担がかなりしっくりきています。

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

もちろん、Jevを使えばすべての問題が解決するわけではありません。

Jevも判断を間違えます。confidenceもそのまま正答率ではありません。ルールやcandidate setを設計する人間も間違えます。外側のコードにもバグはあります。

それでも、生成モデルへ「理解して、判断して、守って、実行して、説明して」と全部頼むのではなく、**AIへ渡す責務を必要な範囲へ切り出し、型とコードで境界を作る**という方向にはかなり可能性を感じています。

次は、ここまでの知見を使って、実際にJevを組み込んだ小さなRPGやCoding Agent向けのsemantic checkerを作ってみるつもりです。

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
