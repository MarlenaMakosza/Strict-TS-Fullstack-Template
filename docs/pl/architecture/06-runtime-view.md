# 6. Widok czasu działania

Jak części współpracują w scenariuszach, które mają znaczenie.

## Start aplikacji

1. `node src/index.ts` wczytuje `src/env.ts`.
2. `src/env.ts` czyta `.env` przez dotenv i sprawdza `process.env` przez Zod.
3. Błędne albo brakujące zmienne: proces kończy się błędem, który wymienia każdy zły klucz (zobacz
   ADR `ARCH-001`).
4. Poprawne zmienne: `src/index.ts` buduje powitanie i je wypisuje.

## Droga zmiany od commita do wydania

```text
commit ──▶ pre-commit: lint-staged (ESLint, Prettier, cspell na zmienionych plikach)
       ──▶ commit-msg: commitlint (Conventional Commits)
push   ──▶ pull request ──▶ CI: format:check, validate, docs:build · mutation · e2e
merge  ──▶ squash commit na main ──▶ release-please aktualizuje release PR
                                 ──▶ workflow Docs publikuje dokumentację
merge release PR ──▶ tag vX.Y.Z, GitHub Release z ZIP-em źródeł
```

## Agent AI kończy zadanie (Claude Code)

1. Agent próbuje zakończyć pracę.
2. Stop hook (`.claude/hooks/stop-validate.sh`) pomija sprawdzanie, gdy od ostatniego zielonego
   przebiegu nie zmienił się żaden plik. W przeciwnym razie odpala `npm run validate` i
   `npm run format:check`.
3. Czerwone bramki: hook odsyła błędy i agent pracuje dalej, maksymalnie 3 razy. Potem agent
   kończy i zgłasza problem.
4. Zielone bramki: agent pisze końcowy raport (zobacz `AGENTS.md`).
