# Strict TS Fullstack Template

[English](../index.md) | Polski

> [!NOTE]
> **AI jest opcjonalne.** Bramki jakości, hooki gita i CI działają tak samo, gdy kod piszą ludzie.
> Zobacz [Bez AI](./without-ai.md).

Gotowy do użycia produkcyjnego szablon fullstack w TypeScript: API HTTP na Hono w Node.js i
frontend w React z Vite, w jednym monorepo.

Pisanie nietrywialnego kodu w TypeScript jest trudne. Język ma mnóstwo drobnych pułapek, które w
pewnych okolicznościach sprawiają poważne problemy, dlatego lintery i inne narzędzia jakości kodu
są tak ważne. Ten szablon zawiera duży zestaw takich narzędzi, surowo skonfigurowanych i gotowych
do użycia, żeby od samego początku pisać kod profesjonalnej jakości.

Te same bramki działają, niezależnie od tego, czy kod piszą ludzie, czy agenci AI. Ludziom
wyłapują błędy, zanim kod trafi do review. W pracy z agentami AI idą dalej: zostaje tylko kod,
który przejdzie wszystkie ograniczenia. Inspiracją dla pracy z agentami był
[post Roberta C. Martina (Uncle Bob)](https://x.com/unclebobmartin/status/2080257779395154409).

## Co dostajesz

- **Fullstack w TypeScript w jednym monorepo.** Backend (`apps/api`) działa na Node.js 24 prosto
  z plików `.ts`: Hono obsługuje trasy pod `/api/`, Zod sprawdza ich dane wejściowe i zmienne
  środowiskowe, a `/api/openapi.json` opisuje API. Frontend (`apps/web`) to React z Vite i
  Tailwind CSS. Wspólny kod jest w `packages/shared`.
- **Surowy lint.** ESLint z regułami opartymi na typach i około 20 wtyczkami, Prettier, cspell
  (angielski i polski) oraz knip do wykrywania nieużywanego kodu.
- **PostgreSQL z Drizzle.** Bazę uruchamia Docker Compose. Są też migracje i skrypt z danymi
  testowymi (Faker).
- **Sprawdzanie bezpieczeństwa.** `npm audit` zatrzymuje CI przy znanej podatności o wysokiej albo
  krytycznej wadze w zależności runtime, `eslint-plugin-security` wyłapuje ryzykowne wzorce w
  kodzie, a `SECURITY.md` mówi, jak zgłosić lukę prywatnie.
- **Testy na każdym poziomie.** Vitest do testów jednostkowych, z fast-check do testów
  property-based; testy integracyjne na prawdziwym PostgreSQL w Dockerze (Testcontainers);
  Playwright ze scenariuszami Gherkin (playwright-bdd) dla API i dla aplikacji webowej w
  przeglądarce, ze sprawdzaniem dostępności przez axe; i Stryker do mutation
  testing.
- **Metryki jakości.** Próg pokrycia testami, wynik CRAP dla każdej funkcji i wykrywanie
  skopiowanego kodu.
- **Reguły architektury i dokumentacja.** ADR-y w `.archgate/adrs/`, sprawdzane przez Archgate, i
  strona VitePress z architekturą arc42 po angielsku i po polsku, publikowana na GitHub Pages.
- **Logowanie przez pino.** Jeden logger w `apps/api/src/logger.ts`: linie JSON na produkcji,
  czytelne linie podczas pracy, poziom z `LOG_LEVEL` i ukrywanie sekretów, takich jak hasła i
  tokeny. Logi idą na stderr.
- **Automatyczne wydania.** release-please czyta
  [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), utrzymuje aktualny PR z
  następną wersją i `CHANGELOG.md`, a po jego merge'u oznacza wydanie tagiem.
- **Konfiguracja agentów AI, która działa z każdym narzędziem.** `AGENTS.md` zawiera reguły, są
  osobne role dla agentów, a opcjonalny adapter podłącza Claude Code.
- **CI na GitHub Actions.** Hooki gita, formularze zgłoszeń, które proszą o scenariusze Gherkin, i
  opcjonalne review drugim modelem AI.

## Instalacja

```sh
git clone https://github.com/MarlenaMakosza/Strict-TS-Fullstack-Template.git
cd Strict-TS-Fullstack-Template
```

## Szybki start

Potrzebujesz Node.js 24 (patrz `.nvmrc`) i Docker.

```sh
nvm use
cp apps/api/.env.example apps/api/.env
npm run firstrun:dev
npm run validate
npm run dev   # aplikacja na http://localhost:5173, API na http://localhost:3000
```

## Praca z agentami AI

Reguły dla każdego agenta są w `AGENTS.md`, a sześć ról w `.agents/roles/` dzieli zadanie od
specyfikacji po dokumentację. Opcjonalny adapter w `.claude/` podłącza Claude Code. Nie korzystasz
z agentów AI? Wszystko inne działa bez nich tak samo. Opis krok po kroku jest na stronie
[Praca z agentami AI](./ai-workflow.md), a to, jak usunąć konfigurację AI, na stronie
[Bez AI](./without-ai.md).

## Dokumentacja

Online: **[marlenamakosza.github.io/Strict-TS-Fullstack-Template/pl](https://marlenamakosza.github.io/Strict-TS-Fullstack-Template/pl/)**.

- [Pierwsze kroki](./getting-started.md): wymagania, instalacja, struktura projektu
- [Bramki jakości](./quality-gates.md): co sprawdza każda bramka i kiedy się uruchamia
- [Skrypty](./scripts.md): wszystkie skrypty npm
- [Narzędzia](./tools.md): wszystkie narzędzia i powód, dla którego są w projekcie
- [Praca z agentami AI](./ai-workflow.md): praca z agentami krok po kroku
- [Bez AI](./without-ai.md): jak usunąć konfigurację AI
