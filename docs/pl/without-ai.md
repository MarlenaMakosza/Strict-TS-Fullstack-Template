# Bez AI

Konfiguracja agentów AI jest opcjonalna. Bramki jakości, hooki gita i CI działają tak samo, gdy
kod piszą ludzie, i żadne z nich nie wywołuje modelu AI.

## Zostaw pliki i nie zwracaj na nie uwagi

Pliki AI same nic nie robią:

- `AGENTS.md`, `CLAUDE.md`, `.agents/` i `.claude/` czyta tylko narzędzie AI do pisania kodu.
- Workflow AI review (`.github/workflows/ai-review.yml`) uruchamia się tylko dla PR z etykietą
  `ai-review` i potrzebuje sekretu `OPENROUTER_API_KEY`.

Możesz je więc zostawić i nigdy z nich nie korzystać.

## Usuń konfigurację AI

Usuń te pliki i katalogi. Wszystkie bramki dalej przechodzą bez nich:

```sh
rm -rf AGENTS.md CLAUDE.md .agents .claude docs/ai-workflow.md docs/pl/ai-workflow.md \
  docs/without-ai.md docs/pl/without-ai.md docs/edge-cases .github/workflows/ai-review.yml
```

Potem usuń pozostałe odwołania:

- `README.md`, `docs/index.md` i `docs/pl/index.md`: notkę „AI jest opcjonalne” na górze, sekcję o
  pracy z agentami AI, wiersz o agentach w „Co dostajesz” oraz linki „Praca z agentami AI” i
  „Bez AI” w „Dokumentacji”.
- `.vitepress/config.ts`: grupę „AI agents” / „Agenci AI” oraz wpis „Use without AI” / „Bez AI” w
  obu panelach bocznych.
- `docs/getting-started.md` i `docs/pl/getting-started.md`: sekcję „Opcjonalnie: codebase-memory-mcp
  dla agentów AI”, wiersz „Bez agentów AI”, link do statystyk AI, wiersze `.agents/` i
  `.claude/` w strukturze projektu oraz wzmianki o `AGENTS.md` i rolach w sekcji „Własny
  projekt na bazie szablonu”.
- `docs/quality-gates.md` i `docs/pl/quality-gates.md`: ostatni akapit, o Stop hooku w Claude Code.
- `docs/code-review.md` i `docs/pl/code-review.md`: wiersze o agencie `reviewer` i o opcjonalnym AI
  review.
- `docs/tools.md` i `docs/pl/tools.md`: część o AI review w wierszu GitHub Actions.
- `.github/CODEOWNERS`: wiersze dla `AGENTS.md`, `CLAUDE.md`, `.claude/` i `.agents/`.
- `.github/PULL_REQUEST_TEMPLATE.md`: sekcję „AI assistance”.
- `.github/ISSUE_TEMPLATE/feature.yml` i `task.yml`: wzmianki o agencie specifier i rolach agentów.
- `.gitignore`: wiersz `.claude/settings.local.json`.

Strony arc42 w `docs/architecture/` i ADR-y dalej wspominają o agentach AI. Opisują ten szablon,
więc i tak przepisz je pod swój projekt.

Na koniec uruchom `npm run autofix`, żeby poprawić formatowanie, a potem `npm run validate:full`,
żeby sprawdzić, że wszystkie bramki dalej przechodzą.
