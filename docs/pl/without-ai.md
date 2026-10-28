# Bez AI

Całą konfigurację AI usuwa jedna komenda:

```sh
node dev/remove-ai.ts --dry-run   # pokaż, co usunie, niczego nie zmieniaj
node dev/remove-ai.ts             # usuń
npm run autofix
npm run validate:full
```

Najpierw zrób commit swojej pracy. Wtedy `git diff` pokaże każdą zmianę skryptu, a `git checkout .`
cofnie je wszystkie. CI uruchamia skrypt przy każdym PR i sprawdza, czy po nim bramki dalej
przechodzą, więc skrypt jest zawsze aktualny.

## Co usuwa skrypt

**Pliki i katalogi:**

- `AGENTS.md`, `CLAUDE.md`, `.agents/` i `.claude/`: reguły, role i adapter dla Claude Code.
- `.github/workflows/ai-review.yml`: opcjonalne AI review PR.
- `docs/ai-workflow.md`, `docs/pl/ai-workflow.md`, tę stronę i jej angielską wersję.
- `dev/remove-ai.ts`, `dev/ai-markers.ts` i ich test: sam skrypt.

**Fragmenty innych plików**, oznaczone w nich komentarzami `ai:start` i `ai:end`:

- `README.md`, `docs/index.md` i `docs/pl/index.md`: notkę „AI jest opcjonalne”, akapit o agentach
  AI, wiersz o AI w „Co dostajesz”, sekcję o pracy z agentami AI i linki do stron o AI w
  „Dokumentacji”.
- `.vitepress/config.ts`: grupę „AI agents” / „Agenci AI” i tę stronę w obu panelach bocznych.
- `docs/getting-started.md`, `docs/quality-gates.md`, `docs/code-review.md` i `docs/tools.md`, po
  angielsku i po polsku: sekcje, wiersze i notki o agentach, Stop hooku w Claude Code, AI review i
  wierszach `Assisted-by`.
- `.github/workflows/ci.yml`: job, który sprawdza ten skrypt.
- `.github/PULL_REQUEST_TEMPLATE.md`: sekcję „AI assistance”.
- `.github/CODEOWNERS`: wiersze dla plików AI.
- `.gitignore`: wiersz dla osobistych ustawień Claude Code.

**Co zostaje:** wszystkie bramki jakości, hooki gita, CI, scenariusze Gherkin, ADR-y i strony
arc42. Zostają też listy przypadków brzegowych w `docs/edge-cases/` i projekty UX w `docs/ux/`: to
praktyka także dla ludzi. Człowiek pisze je sam; z konfiguracją AI szkice przygotowują role
edge-case hunter i ux-designer.

Strony arc42 i ADR-y w kilku miejscach dalej wspominają o agentach AI. Opisują ten szablon, więc i
tak przepisz je pod swój projekt.

## Albo zostaw pliki i nie zwracaj na nie uwagi

Pliki AI same nic nie robią:

- `AGENTS.md`, `CLAUDE.md`, `.agents/` i `.claude/` czyta tylko narzędzie AI do pisania kodu.
- Workflow AI review uruchamia się tylko dla PR z etykietą `ai-review` i potrzebuje sekretu
  `OPENROUTER_API_KEY`.

## Dodawanie treści tylko dla AI

Gdy dodajesz coś, co ma sens tylko z konfiguracją AI, otocz to znacznikami, żeby skrypt też to
usunął. Użyj stylu komentarzy danego pliku:

```md
<!-- ai:start -->

Tekst o agentach AI.

<!-- ai:end -->
```

W TypeScript pisz `// ai:start` i `// ai:end`; w YAML, `.gitignore` i `CODEOWNERS`: `# ai:start`
i `# ai:end`. Wiersz z `ai:to-end` usuwa wszystko od tego wiersza do końca pliku. Cały plik tylko
dla AI dopisz do `AI_PATHS` w `dev/remove-ai.ts`.
