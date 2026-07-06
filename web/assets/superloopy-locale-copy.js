// Superloopy copy data: asset swaps, proof rewrites, and the locale dictionary.
// Loaded before superloopy-content-enhancements.js, which reads window.SUPERLOOPY_COPY.
(() => {
  window.SUPERLOOPY_COPY = {
    assetReplacements: [
      { pattern: /Illustrations_1_|small_Illustrations_1_|thumbnail_Illustrations_1_/i, src: "/assets/generated/proof-evidence.png", alt: "Evidence receipts and audit trail", kind: "proof" },
      { pattern: /Illustrations_2_|small_Illustrations_2_|thumbnail_Illustrations_2_/i, src: "/assets/generated/skill-lanes.png", alt: "Parallel skill lanes converging into work cards", kind: "proof" },
      { pattern: /Illustrations_3_|small_Illustrations_3_|thumbnail_Illustrations_3_/i, src: "/assets/generated/visible-progress.png", alt: "Visible loop progress with completed checkpoints", kind: "proof" },
      { pattern: /Illustrations_4_|small_Illustrations_4_|thumbnail_Illustrations_4_/i, src: "/assets/generated/final-gate.png", alt: "Final evidence gate with pass and blocker markers", kind: "proof" },
      { pattern: /Home_58f1320870|small_Home_58f1320870|thumbnail_Home_58f1320870/i, src: "/assets/generated/visible-progress.png", alt: "Superloopy progress board", kind: "proof" },
      { pattern: /Cases_22ef812550|small_Cases_22ef812550|thumbnail_Cases_22ef812550/i, src: "/assets/generated/proof-evidence.png", alt: "Superloopy evidence board", kind: "proof" },
      { pattern: /Career_11036fa188|small_Career_11036fa188|thumbnail_Career_11036fa188/i, src: "/assets/generated/skill-lanes.png", alt: "Superloopy skill lanes board", kind: "proof" },
      { pattern: /Contact_428653b350|small_Contact_428653b350|thumbnail_Contact_428653b350/i, src: "/assets/generated/final-gate.png", alt: "Superloopy final gate board", kind: "proof" },
      { pattern: /new04_73bbfe5166|small_new04_73bbfe5166|thumbnail_new04_73bbfe5166/i, src: "/crew/nami.png", alt: "Nami crew member illustration", kind: "crew" },
      { pattern: /image10_c81ccfd2c1|small_image10_c81ccfd2c1|thumbnail_image10_c81ccfd2c1/i, src: "/crew/zoro.png", alt: "Zoro crew member illustration", kind: "crew" },
      { pattern: /image11_504ca1615b|small_image11_504ca1615b|thumbnail_image11_504ca1615b/i, src: "/crew/robin.png", alt: "Robin crew member illustration", kind: "crew" },
      { pattern: /image12_9d60a96787|small_image12_9d60a96787|thumbnail_image12_9d60a96787/i, src: "/crew/franky.png", alt: "Franky crew member illustration", kind: "crew" },
      { pattern: /case01_91b5071604|small_case01_91b5071604|thumbnail_case01_91b5071604/i, src: "/crew/robin.png", alt: "Robin crew member illustration", kind: "crew" },
      { pattern: /image02_5e18a58ad7|small_image02_5e18a58ad7|thumbnail_image02_5e18a58ad7/i, src: "/crew/jinbe.png", alt: "Jinbe crew member illustration", kind: "crew" },
      { pattern: /image03_7e6f96f0d8|small_image03_7e6f96f0d8|thumbnail_image03_7e6f96f0d8/i, src: "/crew/zoro.png", alt: "Zoro crew member illustration", kind: "crew" },
      { pattern: /image04_98af0e89ab|small_image04_98af0e89ab|thumbnail_image04_98af0e89ab/i, src: "/crew/usopp.png", alt: "Usopp crew member illustration", kind: "crew" },
      { pattern: /image13_5197330e1c|small_image13_5197330e1c|thumbnail_image13_5197330e1c/i, src: "/crew/robin.png", alt: "Robin crew member illustration", kind: "crew" },
      { pattern: /image14_new_3a84c48c80|small_image14_new_3a84c48c80|thumbnail_image14_new_3a84c48c80/i, src: "/crew/franky.png", alt: "Franky crew member illustration", kind: "crew" },
      { pattern: /image15_4ccc129c87|small_image15_4ccc129c87|thumbnail_image15_4ccc129c87/i, src: "/crew/nami.png", alt: "Nami crew member illustration", kind: "crew" },
      { pattern: /image2[2-7]_[a-z0-9]+|small_image2[2-7]_[a-z0-9]+|thumbnail_image2[2-7]_[a-z0-9]+/i, src: "/crew/robin.png", alt: "Robin crew member illustration", kind: "crew" }
    ],
    proofCopyReplacements: [
      [/we handle everything[\s\S]*cost-effective performance\.?/i, "Superloopy keeps the loop tied to the task: goal, command, artifact, and final report all point to the same proof."],
      [/we optimize your budget[\s\S]*cost-per-hire low\.?/i, "Each pass records what changed, what command proved it, and where the receipt lives inside the project."],
      [/why wait weeks[\s\S]*most suited candidates\.?/i, "When the gate cannot pass, the report says why, names the blocker, and leaves the evidence already found."],
      [/(candidate|healthcare|recruit|job\s+ad|qualified\s+candidates|cost-per-hire|traffic|CPA|CR%|ridesharing|hiring)/i, "Superloopy keeps the work bounded, records the proof, and names the blocker when the loop cannot pass."]
    ],
    proofCaseCopy: [
      [/^US-based ridesharing company|^US recruitment agency/i, "Every loop ends with evidence you can reopen."],
      [/^Delivered 400[\s\S]*driver roles\.?|candidate flow[\s\S]*healthcare niches/i, "Superloopy writes commands, screenshots, changed files, and notes under `.superloopy/evidence`, so the final report can name passed checks and blockers."],
      [/^OPEN PROOF FLOW\s*→?$/i, ""]
    ],
    localeTexts: {
      // Hero
      "Codex and Claude Code workflows": { de: "Workflows für Codex und Claude Code", ko: "Codex와 Claude Code 워크플로", es: "Flujos de trabajo para Codex y Claude Code" },
      "Take control of agent work": { de: "Agentenarbeit unter Kontrolle", ko: "에이전트 작업을 통제하세요", es: "Controla el trabajo de agentes" },
      "Superloopy runs agent work in a loop until proof exists: plan, act, evidence, gate.": { de: "Superloopy führt Agentenarbeit im Loop aus, bis Belege vorliegen: Plan, Aktion, Evidenz, Gate.", ko: "Superloopy는 계획, 실행, 증거, 게이트가 남을 때까지 에이전트 작업을 루프로 돌립니다.", es: "Superloopy ejecuta el trabajo del agente en loop hasta que exista prueba: plan, acción, evidencia y gate." },
      "Start loop": { de: "Loop starten", ko: "루프 시작", es: "Iniciar loop" },
      "Install loop": { de: "Loop installieren", ko: "루프 설치", es: "Instalar loop" },
      "Scroll Down": { de: "Nach unten scrollen", ko: "아래로 스크롤", es: "Desplázate hacia abajo" },
      // Intro
      "Evidence-first loops for Codex and Claude Code": { de: "Evidenz zuerst: Loops für Codex und Claude Code", ko: "Codex와 Claude Code를 위한 증거 우선 루프", es: "Loops con evidencia primero para Codex y Claude Code" },
      "Superloopy keeps agents moving inside a bounded loop, then lets evidence decide when the work is done.": { de: "Superloopy hält Agenten in einem begrenzten Loop in Bewegung – und Belege entscheiden, wann die Arbeit fertig ist.", ko: "Superloopy는 에이전트를 정해진 루프 안에서 계속 움직이게 하고, 작업 완료는 증거가 결정합니다.", es: "Superloopy mantiene al agente en un loop acotado y deja que la evidencia decida cuándo el trabajo está terminado." },
      "01 Looped work": { de: "01 Arbeit im Loop", ko: "01 루프로 도는 작업", es: "01 Trabajo en loop" },
      "02 Agent rhythm": { de: "02 Agenten-Rhythmus", ko: "02 에이전트 리듬", es: "02 Ritmo del agente" },
      "03 Proof gate": { de: "03 Beleg-Gate", ko: "03 증거 게이트", es: "03 Gate de prueba" },
      // Feature cards
      "Every run writes artifacts under .superloopy/evidence, so results can be checked after the chat.": { de: "Jeder Lauf schreibt Artefakte nach .superloopy/evidence, sodass Ergebnisse auch nach dem Chat prüfbar bleiben.", ko: "모든 실행은 산출물을 .superloopy/evidence에 기록하므로, 채팅이 끝난 뒤에도 결과를 확인할 수 있습니다.", es: "Cada ejecución escribe artefactos en .superloopy/evidence, así los resultados se pueden revisar después del chat." },
      "Use loopy for focused work, research, frontend, and clone flows without changing the proof rule.": { de: "Nutze loopy für fokussierte Arbeit, Recherche, Frontend und Clone-Flows – die Beweisregel bleibt dieselbe.", ko: "집중 작업, 리서치, 프런트엔드, 클론 플로에 loopy를 그대로 쓰세요. 증거 규칙은 바뀌지 않습니다.", es: "Usa loopy para trabajo enfocado, investigación, frontend y flujos de clonado sin cambiar la regla de la prueba." },
      "Plans, commands, screenshots, and reports stay linked to the goal instead of disappearing into chat.": { de: "Pläne, Befehle, Screenshots und Berichte bleiben mit dem Ziel verknüpft, statt im Chat zu verschwinden.", ko: "계획, 명령, 스크린샷, 보고서는 채팅 속으로 사라지지 않고 목표와 연결된 채 남습니다.", es: "Los planes, comandos, capturas e informes quedan ligados a la meta en vez de perderse en el chat." },
      "Completion requires a named artifact and a clear pass, blocker, or next action.": { de: "Fertig heißt: ein benanntes Artefakt und ein klares Ergebnis – bestanden, blockiert oder nächster Schritt.", ko: "완료로 인정되려면 이름이 명시된 산출물과 함께 통과, 블로커, 다음 행동 중 하나가 분명해야 합니다.", es: "Completar exige un artefacto con nombre y un resultado claro: aprobado, bloqueado o siguiente acción." },
      // Proof cards
      "Agents move fast. Superloopy makes done mean proven.": { de: "Agenten sind schnell. Superloopy sorgt dafür, dass fertig auch bewiesen heißt.", ko: "에이전트는 빠르게 움직입니다. Superloopy는 '완료'가 '증명됨'이 되게 합니다.", es: "Los agentes van rápido. Con Superloopy, terminado significa probado." },
      "Bounded task loops": { de: "Begrenzte Task-Loops", ko: "범위가 정해진 작업 루프", es: "Loops de tarea acotados" },
      "Evidence that survives the chat": { de: "Belege, die den Chat überleben", ko: "채팅이 끝나도 남는 증거", es: "Evidencia que sobrevive al chat" },
      "A final report with blockers named": { de: "Ein Abschlussbericht, der Blocker benennt", ko: "블로커까지 명시한 최종 보고서", es: "Un informe final con los bloqueos nombrados" },
      "Read proof": { de: "Beleg lesen", ko: "증거 보기", es: "Ver la prueba" },
      "Close proof": { de: "Beleg schließen", ko: "증거 닫기", es: "Cerrar prueba" },
      "Open proof": { de: "Beweis öffnen", ko: "증거 열기", es: "Abrir prueba" },
      "Superloopy keeps the loop tied to the task: goal, command, artifact, and final report all point to the same proof.": { de: "Superloopy hält den Loop an der Aufgabe: Ziel, Befehl, Artefakt und Abschlussbericht zeigen auf denselben Beweis.", ko: "Superloopy는 루프를 작업에 묶어 둡니다. 목표, 명령, 산출물, 최종 보고서가 모두 같은 증거를 가리킵니다.", es: "Superloopy mantiene el loop atado a la tarea: meta, comando, artefacto e informe final apuntan a la misma prueba." },
      "Each pass records what changed, what command proved it, and where the receipt lives inside the project.": { de: "Jeder Durchlauf hält fest, was sich geändert hat, welcher Befehl es belegt und wo der Nachweis im Projekt liegt.", ko: "매 회차마다 무엇이 바뀌었는지, 어떤 명령으로 확인했는지, 증빙이 프로젝트 어디에 있는지 기록합니다.", es: "Cada pasada registra qué cambió, qué comando lo probó y dónde queda el comprobante dentro del proyecto." },
      "When the gate cannot pass, the report says why, names the blocker, and leaves the evidence already found.": { de: "Wenn das Gate nicht besteht, sagt der Bericht warum, benennt den Blocker und lässt die gefundenen Belege da.", ko: "게이트를 통과하지 못하면 보고서는 그 이유와 블로커를 밝히고, 이미 찾은 증거를 남깁니다.", es: "Cuando el gate no pasa, el informe dice por qué, nombra el bloqueo y deja la evidencia ya encontrada." },
      "Superloopy keeps the work bounded, records the proof, and names the blocker when the loop cannot pass.": { de: "Superloopy hält die Arbeit begrenzt, sichert den Beweis und benennt den Blocker, wenn der Loop nicht durchkommt.", ko: "Superloopy는 작업 범위를 지키고 증거를 기록하며, 루프가 통과하지 못하면 블로커를 명시합니다.", es: "Superloopy mantiene el trabajo acotado, registra la prueba y nombra el bloqueo cuando el loop no puede pasar." },
      "Every loop ends with evidence you can reopen.": { de: "Jeder Loop endet mit Belegen, die du wieder öffnen kannst.", ko: "모든 루프는 다시 열어볼 수 있는 증거로 끝납니다.", es: "Cada loop termina con evidencia que puedes reabrir." },
      "Superloopy writes commands, screenshots, changed files, and notes under `.superloopy/evidence`, so the final report can name passed checks and blockers.": { de: "Superloopy schreibt Befehle, Screenshots, geänderte Dateien und Notizen nach `.superloopy/evidence`, damit der Abschlussbericht bestandene Checks und Blocker benennen kann.", ko: "Superloopy는 명령, 스크린샷, 변경 파일, 메모를 `.superloopy/evidence`에 기록해, 최종 보고서가 통과한 검사와 블로커를 밝힐 수 있게 합니다.", es: "Superloopy escribe comandos, capturas, archivos modificados y notas en `.superloopy/evidence`, para que el informe final pueda nombrar los checks aprobados y los bloqueos." },
      "A focused work loop that ends with named artifacts and a clear verdict": { de: "Ein fokussierter Arbeits-Loop, der mit benannten Artefakten und einem klaren Urteil endet", ko: "이름이 명시된 산출물과 분명한 판정으로 끝나는 집중 작업 루프", es: "Un loop de trabajo enfocado que termina con artefactos nombrados y un veredicto claro" },
    "The final report lists what passed, what is blocked, and the exact files, commands, and screenshots that prove it.": { de: "Der Abschlussbericht listet, was bestanden ist, was blockiert ist und welche Dateien, Befehle und Screenshots es genau belegen.", ko: "최종 보고서에는 통과한 것, 막힌 것, 그리고 이를 증명하는 파일·명령·스크린샷이 정확히 적힙니다.", es: "El informe final lista qué pasó, qué está bloqueado y los archivos, comandos y capturas exactos que lo prueban." },
    "Every pass writes its receipt before the next one starts, so progress is never just a claim.": { de: "Jeder Durchlauf schreibt seinen Nachweis, bevor der nächste startet – Fortschritt bleibt nie nur eine Behauptung.", ko: "다음 회차가 시작되기 전에 매 회차의 증빙이 먼저 기록되므로, 진행 상황이 말뿐인 주장으로 남지 않습니다.", es: "Cada pasada escribe su comprobante antes de que empiece la siguiente, así el progreso nunca es solo una afirmación." },
    "Research loops that end with reopenable sources, not confident summaries": { de: "Research-Loops, die mit nachprüfbaren Quellen enden statt mit selbstsicheren Zusammenfassungen", ko: "확신에 찬 요약이 아니라 다시 열어볼 수 있는 출처로 끝나는 리서치 루프", es: "Loops de investigación que terminan con fuentes reabribles, no con resúmenes seguros" },
    "Research passes cite their sources, so claims can be checked instead of trusted.": { de: "Research-Durchläufe zitieren ihre Quellen – Behauptungen lassen sich prüfen statt glauben.", ko: "리서치 회차는 출처를 남기므로, 주장을 믿는 대신 확인할 수 있습니다.", es: "Las pasadas de investigación citan sus fuentes, así las afirmaciones se pueden verificar en vez de creer." },
    "Weak evidence is flagged during the loop, not discovered after the work is merged.": { de: "Schwache Belege fallen schon im Loop auf, nicht erst nach dem Merge.", ko: "허술한 증거는 머지된 뒤가 아니라 루프가 도는 동안 걸러집니다.", es: "La evidencia débil se marca durante el loop, no se descubre después de mergear el trabajo." },
    "Frontend loops proven with screenshots, checks, and a final gate": { de: "Frontend-Loops, belegt mit Screenshots, Checks und einem finalen Gate", ko: "스크린샷과 검사, 최종 게이트로 증명되는 프런트엔드 루프", es: "Loops de frontend probados con capturas, checks y un gate final" },
    "Frontend passes capture before-and-after screenshots for every visible change.": { de: "Frontend-Durchläufe halten jede sichtbare Änderung mit Vorher-nachher-Screenshots fest.", ko: "프런트엔드 회차는 눈에 보이는 모든 변경에 전후 스크린샷을 남깁니다.", es: "Las pasadas de frontend capturan capturas de antes y después para cada cambio visible." },
    "Visual checks run inside the loop, so regressions surface while the context is still fresh.": { de: "Visuelle Checks laufen im Loop – Regressionen zeigen sich, solange der Kontext noch frisch ist.", ko: "시각 검사는 루프 안에서 돌기 때문에, 맥락이 살아 있을 때 회귀가 드러납니다.", es: "Los checks visuales corren dentro del loop, así las regresiones aparecen mientras el contexto sigue fresco." },
    "A focused work loop that keeps every pass tied to the goal.": { de: "Ein fokussierter Arbeits-Loop, der jeden Durchlauf ans Ziel bindet.", ko: "매 회차를 목표에 묶어 두는 집중 작업 루프입니다.", es: "Un loop de trabajo enfocado que mantiene cada pasada ligada a la meta." },
    "Commands, changed files, and reports land in the project, so the verdict at the gate is checkable, not just confident.": { de: "Befehle, geänderte Dateien und Berichte landen im Projekt – das Urteil am Gate ist prüfbar, nicht nur selbstsicher.", ko: "명령, 변경 파일, 보고서가 프로젝트에 남으므로 게이트의 판정은 자신감이 아니라 확인으로 뒷받침됩니다.", es: "Comandos, archivos modificados e informes quedan en el proyecto, así el veredicto del gate se puede comprobar, no solo confiar." },
    "Research passes that leave sources you can reopen.": { de: "Research-Durchläufe, die Quellen hinterlassen, die man wieder öffnen kann.", ko: "다시 열어볼 수 있는 출처를 남기는 리서치 회차입니다.", es: "Pasadas de investigación que dejan fuentes que puedes reabrir." },
    "Each claim points at where it came from, and the final report separates supported findings from open questions.": { de: "Jede Behauptung zeigt auf ihre Quelle, und der Abschlussbericht trennt belegte Befunde von offenen Fragen.", ko: "모든 주장은 출처를 가리키고, 최종 보고서는 뒷받침된 결론과 열린 질문을 구분합니다.", es: "Cada afirmación apunta a su origen, y el informe final separa los hallazgos respaldados de las preguntas abiertas." },
    "Frontend loops proven with screenshots and checks.": { de: "Frontend-Loops, belegt mit Screenshots und Checks.", ko: "스크린샷과 검사로 증명되는 프런트엔드 루프입니다.", es: "Loops de frontend probados con capturas y checks." },
    "Every visible change ships with before-and-after captures, so review starts from evidence instead of memory.": { de: "Jede sichtbare Änderung kommt mit Vorher-nachher-Aufnahmen – Review startet bei den Belegen, nicht beim Gedächtnis.", ko: "눈에 보이는 모든 변경에 전후 캡처가 따라오므로, 리뷰는 기억이 아니라 증거에서 시작합니다.", es: "Cada cambio visible llega con capturas de antes y después, así la revisión empieza por la evidencia y no por la memoria." },
    "Proof flow for agent work": { de: "Beweis-Flow für Agentenarbeit", ko: "에이전트 작업 증거 플로", es: "Flujo de prueba para trabajo de agentes" },
      "Proof flow for research loops": { de: "Beweis-Flow für Research-Loops", ko: "리서치 루프 증거 플로", es: "Flujo de prueba para loops de investigación" },
      "Proof flow for frontend loops": { de: "Beweis-Flow für Frontend-Loops", ko: "프런트엔드 루프 증거 플로", es: "Flujo de prueba para loops de frontend" },
      // Stats
      "One prompt becomes a bounded loop": { de: "Aus einem Prompt wird ein begrenzter Loop", ko: "하나의 프롬프트가 정해진 루프가 됩니다", es: "Un prompt se convierte en un loop acotado" },
      "Plan, act, evidence, and gate keep the agent moving without losing the proof.": { de: "Plan, Aktion, Evidenz und Gate halten den Agenten in Bewegung, ohne den Beweis zu verlieren.", ko: "계획, 실행, 증거, 게이트가 에이전트를 계속 움직이게 하면서도 증거를 놓치지 않습니다.", es: "Plan, acción, evidencia y gate mantienen al agente en marcha sin perder la prueba." },
      "Reports say what passed, what is missing, and what to do next.": { de: "Berichte sagen, was bestanden ist, was fehlt und was als Nächstes zu tun ist.", ko: "보고서에는 무엇이 통과했고, 무엇이 빠졌고, 다음에 무엇을 할지가 적힙니다.", es: "Los informes dicen qué pasó la prueba, qué falta y qué hacer después." },
      // CTA
      "Built for Codex and Claude Code workflows that need receipts": { de: "Für Codex- und Claude-Code-Workflows, die Belege brauchen", ko: "증빙이 필요한 Codex·Claude Code 워크플로를 위해 만들어졌습니다", es: "Hecho para flujos de Codex y Claude Code que necesitan comprobantes" },
      "Focus on the task. Let the loop demand proof.": { de: "Konzentrier dich auf die Aufgabe. Der Loop verlangt den Beweis.", ko: "작업에만 집중하세요. 증거는 루프가 요구합니다.", es: "Céntrate en la tarea. Deja que el loop exija la prueba." },
      // Steps
      "Steps": { de: "Schritte", ko: "단계", es: "Pasos" },
      "Set the goal": { de: "Ziel setzen", ko: "목표 설정", es: "Define la meta" },
      "Act in loops": { de: "In Loops arbeiten", ko: "루프로 실행", es: "Actúa en loops" },
      "Capture evidence": { de: "Belege sichern", ko: "증거 저장", es: "Captura evidencia" },
      "Pass the gate": { de: "Gate bestehen", ko: "게이트 통과", es: "Supera el gate" },
      "Define the objective, success criteria, and evidence folder before the agent starts moving.": { de: "Definiere Ziel, Erfolgskriterien und Evidenzordner, bevor der Agent loslegt.", ko: "에이전트가 움직이기 전에 목표, 성공 기준, 증거 폴더를 정합니다.", es: "Define el objetivo, los criterios de éxito y la carpeta de evidencia antes de que el agente empiece." },
      "The agent keeps taking the next visible action, with each pass tied back to the goal.": { de: "Der Agent geht immer den nächsten sichtbaren Schritt, und jeder Durchlauf bleibt ans Ziel gebunden.", ko: "에이전트는 눈에 보이는 다음 행동을 이어가고, 매 회차는 목표와 다시 연결됩니다.", es: "El agente sigue dando el siguiente paso visible, y cada pasada queda ligada a la meta." },
      "Commands, screenshots, reports, and audit files land where they can be opened and rerun.": { de: "Befehle, Screenshots, Berichte und Audit-Dateien landen dort, wo man sie öffnen und erneut ausführen kann.", ko: "명령, 스크린샷, 보고서, 감사 파일은 다시 열고 실행할 수 있는 곳에 남습니다.", es: "Comandos, capturas, informes y archivos de auditoría quedan donde se pueden abrir y volver a ejecutar." },
      "The final report separates finished work from blockers, with artifacts named in the open.": { de: "Der Abschlussbericht trennt Erledigtes von Blockern und benennt die Artefakte offen.", ko: "최종 보고서는 끝난 일과 블로커를 구분하고, 산출물을 그대로 명시합니다.", es: "El informe final separa el trabajo terminado de los bloqueos y nombra los artefactos abiertamente." },
      // Install
      "Install once. Then type loopy.": { de: "Einmal installieren. Dann loopy tippen.", ko: "한 번 설치하고 loopy만 입력하세요.", es: "Instala una vez. Luego escribe loopy." },
      "Copy": { de: "Kopieren", ko: "복사", es: "Copiar" },
      "Run in a terminal, then restart Codex and approve the hooks.": { de: "Im Terminal ausführen, dann Codex neu starten und die Hooks bestätigen.", ko: "터미널에서 실행한 뒤 Codex를 재시작하고 훅을 승인하세요.", es: "Ejecútalo en una terminal, reinicia Codex y aprueba los hooks." },
      "Run inside Claude Code, then approve the plugin hooks.": { de: "In Claude Code ausführen und die Plugin-Hooks bestätigen.", ko: "Claude Code 안에서 실행하고 플러그인 훅을 승인하세요.", es: "Ejecútalo dentro de Claude Code y aprueba los hooks del plugin." },
      "I understand Superloopy writes evidence and a final report in the project.": { de: "Mir ist klar, dass Superloopy Belege und einen Abschlussbericht im Projekt ablegt.", ko: "Superloopy가 프로젝트에 증거와 최종 보고서를 기록한다는 점을 이해합니다.", es: "Entiendo que Superloopy escribe evidencia y un informe final en el proyecto." },
      // FAQ
      "What makes Superloopy different from a prompt?": { de: "Was unterscheidet Superloopy von einem Prompt?", ko: "Superloopy는 프롬프트와 무엇이 다른가요?", es: "¿En qué se diferencia Superloopy de un prompt?" },
      "Superloopy keeps quality tied to evidence:": { de: "Superloopy koppelt Qualität an Belege:", ko: "Superloopy는 품질을 증거와 연결합니다:", es: "Superloopy ata la calidad a la evidencia:" },
      "Goal criteria. The loop starts with a concrete objective and the artifacts needed to prove it.": { de: "Zielkriterien. Der Loop startet mit einem konkreten Ziel und den Artefakten, die es belegen.", ko: "목표 기준. 루프는 구체적인 목표와 이를 증명할 산출물을 정하는 데서 시작합니다.", es: "Criterios de meta. El loop empieza con un objetivo concreto y los artefactos que lo prueban." },
      "Evidence capture. Commands, screenshots, reports, and changed files are written where they can be opened later.": { de: "Belegsicherung. Befehle, Screenshots, Berichte und geänderte Dateien werden dort abgelegt, wo man sie später öffnen kann.", ko: "증거 기록. 명령, 스크린샷, 보고서, 변경된 파일은 나중에 열어볼 수 있는 곳에 기록됩니다.", es: "Captura de evidencia. Comandos, capturas, informes y archivos modificados se guardan donde se pueden abrir después." },
      "Gate check. Superloopy does not call work done unless the proof is named or the blocker is explicit.": { de: "Gate-Prüfung. Superloopy meldet Arbeit erst als fertig, wenn der Beweis benannt oder der Blocker klar ist.", ko: "게이트 확인. 증거가 명시되거나 블로커가 분명하지 않으면 Superloopy는 작업을 완료로 처리하지 않습니다.", es: "Revisión del gate. Superloopy no da el trabajo por terminado si la prueba no está nombrada o el bloqueo no es explícito." },
      "Where does the evidence live?": { de: "Wo liegen die Belege?", ko: "증거는 어디에 저장되나요?", es: "¿Dónde vive la evidencia?" },
      "Artifacts live in the project under .superloopy/evidence. That keeps the proof beside the work, not buried in chat history.": { de: "Artefakte liegen im Projekt unter .superloopy/evidence. So bleibt der Beweis bei der Arbeit statt im Chatverlauf.", ko: "산출물은 프로젝트의 .superloopy/evidence 아래에 저장됩니다. 증거가 채팅 기록이 아니라 작업 옆에 남습니다.", es: "Los artefactos viven en el proyecto, en .superloopy/evidence. Así la prueba queda junto al trabajo, no enterrada en el chat." },
      "The final report points back to the files, commands, screenshots, and notes that matter.": { de: "Der Abschlussbericht verweist auf die Dateien, Befehle, Screenshots und Notizen, die zählen.", ko: "최종 보고서는 중요한 파일, 명령, 스크린샷, 메모를 다시 가리킵니다.", es: "El informe final apunta a los archivos, comandos, capturas y notas que importan." },
      "Does it work with Codex and Claude Code?": { de: "Funktioniert es mit Codex und Claude Code?", ko: "Codex와 Claude Code 모두에서 쓸 수 있나요?", es: "¿Funciona con Codex y Claude Code?" },
      "Yes. Superloopy is a command layer for Codex work and supports Claude Code workflows too. The same evidence rule applies across lanes.": { de: "Ja. Superloopy ist eine Befehlsschicht für Codex und unterstützt auch Claude-Code-Workflows. Die Beweisregel gilt überall gleich.", ko: "네. Superloopy는 Codex 작업을 위한 명령 레이어이며 Claude Code 워크플로도 지원합니다. 증거 규칙은 어디서나 동일합니다.", es: "Sí. Superloopy es una capa de comandos para Codex y también soporta flujos de Claude Code. La misma regla de evidencia aplica en todos los carriles." },
      "What happens when the loop cannot finish?": { de: "Was passiert, wenn der Loop nicht fertig wird?", ko: "루프가 끝나지 못하면 어떻게 되나요?", es: "¿Qué pasa cuando el loop no puede terminar?" },
      "Then the report says so. A loop can finish as passed, blocked, or incomplete, but it must leave a reason and the evidence it found.": { de: "Dann steht genau das im Bericht. Ein Loop kann als bestanden, blockiert oder unvollständig enden – aber immer mit Begründung und den gefundenen Belegen.", ko: "그럴 땐 보고서에 그대로 적힙니다. 루프는 통과, 블로커, 미완료로 끝날 수 있지만 이유와 찾은 증거는 반드시 남겨야 합니다.", es: "Entonces el informe lo dice. Un loop puede terminar aprobado, bloqueado o incompleto, pero debe dejar una razón y la evidencia que encontró." },
      "That is the point: no confident ending without proof. You get the next action instead of a tidy guess.": { de: "Genau darum geht es: kein selbstsicheres Ende ohne Beweis. Du bekommst den nächsten Schritt statt einer glatten Vermutung.", ko: "그게 핵심입니다. 증거 없이 자신만만하게 끝내지 않습니다. 그럴듯한 추측 대신 다음 행동을 받습니다.", es: "Esa es la idea: ningún final confiado sin prueba. Recibes la siguiente acción en vez de una suposición pulida." },
      // Footer
      "Get Superloopy": { de: "Hol dir Superloopy", ko: "Superloopy 받기", es: "Consigue Superloopy" },
      "Done means proven.": { de: "Fertig heißt bewiesen.", ko: "완료는 곧 증명입니다.", es: "Terminado significa probado." }
    },
    footerTitles: {
      en: ["Get", "Superloopy"],
      de: ["Hol dir", "Superloopy"],
      ko: ["Superloopy", "받기"],
      es: ["Consigue", "Superloopy"]
    },
  };
})();

(() => {
  const LOCALES = [{ code: "en", label: "EN" }, { code: "de", label: "DE" }, { code: "ko", label: "KR" }, { code: "es", label: "ES" }];
  const LOCALE_TEXT_REPLACEMENTS = window.SUPERLOOPY_COPY.localeTexts;
  const FOOTER_TITLE_BY_LOCALE = window.SUPERLOOPY_COPY.footerTitles;
  function normalizedText(node) {
    return (node.textContent || "").replace(/\s+/g, " ").trim();
  }
  function escapeHtml(value) {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function splitCharsMarkup(value) {
    return Array.from(value).map((char, index) => `<span class="char" style="--d:${(index * 0.02).toFixed(2).replace(/\.?0+$/, "")}s">${char === " " ? "&nbsp;" : escapeHtml(char)}</span>`).join("");
  }
  function renderCustomLinkText(control, value) {
    const text = control.querySelector(".custom-link__text, .btn__text, .btn__chars");
    if (!text) return false;
    const chars = splitCharsMarkup(value);
    text.innerHTML = `<span>${chars}</span><span>${chars}</span>`;
    return true;
  }
  function activeLocale() {
    return localeCode(localStorage.getItem("superloopy-locale") || document.documentElement.lang || "en");
  }
  function localeCode(code) {
    return code === "kr" ? "ko" : LOCALES.some((locale) => locale.code === code) ? code : "en";
  }
  let localeLookup = null;
  function localeLookupMap() {
    if (localeLookup) return localeLookup;
    localeLookup = new Map();
    for (const [base, values] of Object.entries(LOCALE_TEXT_REPLACEMENTS)) {
      for (const item of [base, ...Object.values(values)]) {
        const variant = item.toLowerCase();
        localeLookup.set(variant, base);
        localeLookup.set(`${variant} ${variant}`, base);
        localeLookup.set(`${variant}${variant}`.replace(/\s+/g, ""), base);
      }
    }
    return localeLookup;
  }
  function applyLocalizedCopy(code = activeLocale()) {
    const locale = localeCode(code);
    const lookup = localeLookupMap();
    document.querySelectorAll("a, button, h1, h2, h3, h4, p, span, li, div").forEach((node) => {
      // Only leaf divs: a container div whose text happens to match would have its
      // child markup flattened by the textContent write below.
      if (node.tagName === "DIV" && node.childElementCount > 0) return;
      if (node.classList?.contains("superloopy-start-loop-button") || node.classList?.contains("superloopy-github-text-link") || node.classList?.contains("faqs-title")) return;
      if (node.closest?.(".custom-link") && !node.classList?.contains("custom-link")) return;
      const text = normalizedText(node);
      const lower = text.toLowerCase();
      const compact = lower.replace(/\s+/g, "");
      const hit = node.dataset.superloopyCopyKey || lookup.get(lower) || lookup.get(compact);
      if (!hit) return;
      node.dataset.superloopyCopyKey = hit;
      const nextText = locale === "en" ? hit : LOCALE_TEXT_REPLACEMENTS[hit]?.[locale] || hit;
      if (node.classList?.contains("custom-link") && renderCustomLinkText(node, nextText)) return;
      node.textContent = nextText;
    });
  }
  function applyLocale(code) {
    code = localeCode(code);
    localStorage.setItem("superloopy-locale", code);
    document.documentElement.lang = code;
    document.querySelectorAll("[data-superloopy-locale]").forEach((button) => {
      const isActive = button.getAttribute("data-superloopy-locale") === code;
      button.classList.toggle("is-active", isActive);
      button.toggleAttribute("disabled", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    applyLocalizedCopy(code);
    renderFooterTitle(code);
  }
  function localeMarkup() {
    return LOCALES.map((locale) => `<button type="button" data-superloopy-locale="${escapeHtml(locale.code)}" aria-pressed="false">${escapeHtml(locale.label)}</button>`).join("");
  }
  function wireLocaleButtons(list) {
    list.querySelectorAll("[data-superloopy-locale]").forEach((button) => {
      if (button.dataset.superloopyLocaleWired === "true") return;
      button.dataset.superloopyLocaleWired = "true";
      button.addEventListener("click", () => applyLocale(button.getAttribute("data-superloopy-locale") || "en"));
    });
  }
  function renderLocaleList(list) {
    // Guard on the node actually existing, not a dataset flag: React re-renders can
    // strip our appended span while the attribute survives, which would leave the
    // list permanently empty.
    list.dataset.superloopyLocales = "true";
    list.classList.add("superloopy-locale-list");
    if (!list.querySelector(":scope > .superloopy-locale-buttons")) {
      const own = document.createElement("span");
      own.className = "superloopy-locale-buttons";
      own.innerHTML = localeMarkup();
      list.append(own);
    }
    if (list.parentElement?.classList.contains("mr-30")) {
      list.parentElement.classList.add("superloopy-locale-shell");
    }
    wireLocaleButtons(list);
  }
  function renderLocaleOptions() {
    const headerActions = document.querySelector(".fixed.right-0.top-0");
    if (headerActions) {
      const localeSlot = headerActions.querySelector(".mr-30") || headerActions;
      if (!localeSlot.querySelector(".superloopy-locale-list, [class*='styles_list__']")) {
        const headerList = document.createElement("div");
        headerList.className = "superloopy-locale-list";
        localeSlot.append(headerList);
      }
      const headerLists = Array.from(headerActions.querySelectorAll(".superloopy-locale-list"));
      headerLists.forEach((list, index) => {
        if (index > 0) {
          list.remove();
          return;
        }
        if (index === 0) renderLocaleList(list);
      });
    }
    const localeParents = new Set(Array.from(document.querySelectorAll("button"))
      .filter((button) => /^(en|de|kr|ko|es)$/i.test(normalizedText(button)))
      .map((button) => button.parentElement)
      .filter(Boolean));
    document.querySelectorAll("[class*='styles_list__'], .superloopy-locale-list").forEach((list) => localeParents.add(list));
    localeParents.forEach((list) => {
      if (list.classList.contains("superloopy-locale-list")) {
        renderLocaleList(list);
        return;
      }
      const buttonTexts = Array.from(list.children)
        .filter((child) => child instanceof HTMLButtonElement)
        .map((child) => normalizedText(child).toLowerCase());
      if (!buttonTexts.includes("en") || !buttonTexts.includes("de")) return;
      renderLocaleList(list);
    });
    applyLocale(activeLocale());
  }
  function renderFooterTitle(code = activeLocale()) {
    const title = document.querySelector(".footer-title, footer h2, footer [class*='title']");
    if (!title) return;
    const words = FOOTER_TITLE_BY_LOCALE[code] || FOOTER_TITLE_BY_LOCALE.en;
    const nextText = words.join(" ");
    if (title.dataset.superloopyFooterTitle === nextText && title.querySelector(".superloopy-footer-word")) return;
    title.dataset.superloopyFooterTitle = nextText;
    title.classList.add("superloopy-footer-two-line");
    title.querySelectorAll(".superloopy-footer-word").forEach((word) => word.remove());
    words.forEach((word) => {
      const span = document.createElement("span");
      span.className = "superloopy-footer-word";
      span.textContent = word;
      title.append(span);
    });
  }
  window.SuperloopyLocale = { activeLocale, applyLocale, applyLocalizedCopy, renderLocaleOptions, renderFooterTitle };
})();
