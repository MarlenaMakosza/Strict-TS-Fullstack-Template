# Pierwsze kroki

## Wymagania

- Node.js 24 (wersja jest w `.nvmrc`; ze starszą `npm install` odmówi instalacji)
- Docker, dla PostgreSQL
- git

## Instalacja

```sh
git clone https://github.com/MarlenaMakosza/Ultimate-TS-AI-project.git
cd Ultimate-TS-AI-project
nvm use
cp .env.example .env
npm run firstrun:dev
```

`firstrun:dev` instaluje zależności i sprawdza typy. Potem uruchamia PostgreSQL, wykonuje migracje
i wypełnia bazę danymi.

## Na co dzień

```sh
npm run dev             # uruchamia src/index.ts i restartuje go po każdej zmianie
npm run validate        # szybkie bramki jakości
npm run validate:full   # wszystkie bramki: odpal przed uznaniem zadania za skończone
```

Pozostałe komendy są w [Skryptach](./scripts.md), a to, co sprawdza każda bramka, w
[Bramkach jakości](./quality-gates.md).

## Struktura projektu

```text
src/                  kod aplikacji
  db/                 schemat i klient Drizzle
tests/unit/           testy jednostkowe Vitest
tests/e2e/features/   scenariusze Gherkin (specyfikacja)
tests/e2e/steps/      step definitions i fixtures
dev/db/               skrypty migracji i danych testowych
dev/quality/          bramka CRAP
docs/                 ta dokumentacja (VitePress); polska wersja w docs/pl/
.archgate/adrs/       decyzje architektoniczne (ADR)
.agents/roles/        instrukcje ról dla agentów AI
.claude/              adapter dla Claude Code (hooki, uprawnienia, agenci)
.github/              workflow CI, właściciele kodu, szablon opisu PR
```
