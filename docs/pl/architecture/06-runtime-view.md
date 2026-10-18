# 6. Widok czasu działania

Jak części współpracują w scenariuszach, które mają znaczenie.

## Start i zatrzymanie serwera

1. `node src/index.ts` wczytuje `apps/api/src/env.ts`.
2. `apps/api/src/env.ts` czyta `.env` przez dotenv i sprawdza `process.env` przez Zod.
3. Błędne albo brakujące zmienne: proces kończy się błędem, który wymienia każdy zły klucz (zobacz
   ADR `ARCH-001`).
4. Poprawne zmienne: `apps/api/src/index.ts` buduje aplikację przez `createApp()` i nasłuchuje na
   `PORT` (ADR `ARCH-003`). W logu pojawia się `Server started`.
5. Po `SIGINT` albo `SIGTERM` serwer przestaje przyjmować nowe zapytania, kończy otwarte i się
   zamyka.

## Aplikacja w trybie development

`npm run dev` uruchamia API na porcie 3000 i Vite na porcie 5173. Przeglądarka pobiera aplikację z
Vite; każde zapytanie do `/api/…` trafia do Vite, który przekazuje je do API (ADR `ARCH-005`).
Przeglądarka widzi więc jedno źródło i nie potrzebuje CORS. Aplikacja sprawdza każdą odpowiedź
przez Zod, zanim jej użyje.

## Zapytanie

1. Zapytanie dostaje identyfikator: ten z nagłówka `X-Request-Id` albo nowy.
2. Hono dopasowuje ścieżkę do trasy w `apps/api/src/server/app.ts`.
3. Schemat Zod trasy sprawdza dane wejściowe. Błędne dane dostają `400` z
   `{"error":"Invalid request","issues":[…]}`, jeden wpis na każde błędne pole.
4. Obsługa trasy odpowiada JSON-em. Nieznana ścieżka dostaje `404` z `{"error":"Not found"}`.
5. Błąd w obsłudze trasy trafia do logu ze szczegółami; klient dostaje `500` z ogólnym komunikatem.
6. Odpowiedź niesie identyfikator zapytania i nagłówki bezpieczeństwa, a jedna linia logu zapisuje
   metodę, ścieżkę, status, czas i identyfikator.

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
