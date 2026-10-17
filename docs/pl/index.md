# Ultimate TS project

[English](../index.md) | Polski

Gotowy do użycia produkcyjnego szablon projektu w czystym TypeScript na Node.js, bez frameworka.

Pisanie nietrywialnego kodu w TypeScript jest trudne. Język ma mnóstwo drobnych pułapek, które w
pewnych okolicznościach sprawiają poważne problemy, dlatego lintery i inne narzędzia jakości kodu
są tak ważne. Ten szablon zawiera duży zestaw takich narzędzi, surowo skonfigurowanych i gotowych
do użycia, żeby od samego początku pisać kod profesjonalnej jakości.

Te same bramki działają, niezależnie od tego, czy kod piszą ludzie, czy agenci AI. Ludziom
wyłapują błędy, zanim kod trafi do review. W pracy z agentami AI idą dalej: zostaje tylko kod,
który przejdzie wszystkie ograniczenia. Inspiracją dla pracy z agentami był
[post Roberta C. Martina (Uncle Bob)](https://x.com/unclebobmartin/status/2080257779395154409).

## Co dostajesz

Wbudowane od pierwszego commita:

- **Sprawdzanie bezpieczeństwa.** `npm audit` zatrzymuje CI przy znanej podatności o wysokiej albo
  krytycznej wadze w zależności runtime, `eslint-plugin-security` wyłapuje ryzykowne wzorce w
  kodzie, a `SECURITY.md` mówi, jak zgłosić lukę prywatnie.
- **Logowanie przez pino.** Jeden logger w `src/logger.ts`: linie JSON na produkcji, czytelne linie
  podczas pracy, poziom z `LOG_LEVEL` i ukrywanie sekretów, takich jak hasła i tokeny. Logi idą na
  stderr, więc stdout zostaje dla wyniku programu.
- **Automatyczne wydania.** release-please czyta
  [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), utrzymuje aktualny PR z
  następną wersją i `CHANGELOG.md`, a po jego merge'u oznacza wydanie tagiem.

A do tego:

- **TypeScript na Node.js 24.** Node uruchamia pliki `.ts` bezpośrednio, bez kroku budowania
  podczas pracy. Zod sprawdza zmienne środowiskowe i inne dane na granicach aplikacji.
- **Błędy jako wartości.** Typ `Result` w `src/shared/result.ts` dla operacji, które mogą się nie
  udać, więc TypeScript zmusza do obsłużenia błędu.
- **PostgreSQL z Drizzle.** Bazę uruchamia Docker Compose. Są też migracje i skrypt z danymi
  testowymi (Faker).
- **Surowy lint.** ESLint z regułami opartymi na typach i około 20 wtyczkami, Prettier, cspell
  (angielski i polski) oraz knip do wykrywania nieużywanego kodu.
- **Testy na każdym poziomie.** Vitest do testów jednostkowych, z fast-check do testów
  property-based; testy integracyjne na prawdziwym PostgreSQL w Dockerze (Testcontainers);
  Playwright ze scenariuszami Gherkin (playwright-bdd) do testów end-to-end; i Stryker do mutation
  testing.
- **Metryki jakości.** Próg pokrycia testami, wynik CRAP dla każdej funkcji i wykrywanie
  skopiowanego kodu.
- **Reguły architektury i dokumentacja.** ADR-y w `.archgate/adrs/`, sprawdzane przez Archgate, i
  strona VitePress z architekturą arc42 po angielsku i po polsku, publikowana na GitHub Pages.
- **Konfiguracja agentów AI, która działa z każdym narzędziem.** `AGENTS.md` zawiera reguły, są
  osobne role dla agentów, a opcjonalny adapter podłącza Claude Code.
- **CI na GitHub Actions.** Hooki gita, formularze zgłoszeń, które proszą o scenariusze Gherkin, i
  opcjonalne review drugim modelem AI.

## Instalacja

```sh
git clone https://github.com/MarlenaMakosza/Ultimate-TS-AI-project.git
cd Ultimate-TS-AI-project
```

## Szybki start

Potrzebujesz Node.js 24 (patrz `.nvmrc`) i Docker.

```sh
nvm use
cp .env.example .env
npm run firstrun:dev
npm run validate
```

## Praca z agentami AI

Reguły dla każdego agenta są w `AGENTS.md`, a sześć ról w `.agents/roles/` dzieli zadanie od
specyfikacji po dokumentację. Opcjonalny adapter w `.claude/` podłącza Claude Code. Nie korzystasz
z agentów AI? Wszystko inne działa bez nich tak samo. Opis krok po kroku i to, jak usunąć
konfigurację AI, jest na stronie [Praca z agentami AI](./ai-workflow.md).

## Dokumentacja

Online: **[marlenamakosza.github.io/Ultimate-TS-AI-project/pl](https://marlenamakosza.github.io/Ultimate-TS-AI-project/pl/)**.

- [Pierwsze kroki](./getting-started.md): wymagania, instalacja, struktura projektu
- [Bramki jakości](./quality-gates.md): co sprawdza każda bramka i kiedy się uruchamia
- [Skrypty](./scripts.md): wszystkie skrypty npm
- [Narzędzia](./tools.md): wszystkie narzędzia i powód, dla którego są w projekcie
- [Praca z agentami AI](./ai-workflow.md): praca z agentami krok po kroku
