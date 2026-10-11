# Ultimate TS project

[English](README.md) | Polski

Szablon projektu w czystym TypeScript na Node.js, bez frameworka. Ma surowe bramki jakości, więc
kod mogą pisać agenci AI, a bramki go sprawdzają.

Pomysł pochodzi od Roberta C. Martina (Uncle Bob): nie czytaj każdej linii, którą piszą agenci.
Zamiast tego otocz ich ograniczeniami (testy jednostkowe, scenariusze Gherkin, pokrycie testami,
mutation testing, metryki jakości) i przyjmuj tylko kod, który przejdzie je wszystkie. Człowiek
odpowiada za specyfikację i bramki. Agenci odpowiadają za implementację.

## Co dostajesz

- **TypeScript na Node.js 24.** Node uruchamia pliki `.ts` bezpośrednio, bez kroku budowania
  podczas pracy. Zod sprawdza zmienne środowiskowe i inne dane na granicach aplikacji.
- **PostgreSQL z Drizzle.** Bazę uruchamia Docker Compose. Są też migracje i skrypt z danymi
  testowymi (Faker).
- **Surowy lint.** ESLint z regułami opartymi na typach i około 20 wtyczkami, Prettier, cspell
  (angielski i polski) oraz knip do wykrywania nieużywanego kodu.
- **Testy na trzech poziomach.** Vitest do testów jednostkowych, Playwright ze scenariuszami Gherkin (playwright-bdd)
  do testów end-to-end i Stryker do mutation testing.
- **Metryki jakości.** Próg pokrycia testami, wynik CRAP dla każdej funkcji i wykrywanie
  skopiowanego kodu.
- **Reguły architektury.** ADR-y w `.archgate/adrs/`, sprawdzane przez Archgate.
- **Konfiguracja agentów AI, która działa z każdym narzędziem.** `AGENTS.md` zawiera reguły, są
  osobne role dla agentów, a opcjonalny adapter podłącza Claude Code.
- **CI na GitHub Actions.** Hooki gita, Conventional Commits i opcjonalne review drugim modelem AI.

## Szybki start

Potrzebujesz Node.js 24 (patrz `.nvmrc`) i Docker.

```sh
nvm use
cp .env.example .env
npm run firstrun:dev
```

`firstrun:dev` instaluje zależności i sprawdza typy. Potem uruchamia PostgreSQL, wykonuje migracje
i wypełnia bazę danymi. Dalej:

```sh
npm run dev        # uruchamia src/index.ts i restartuje go po zmianach
npm run validate   # odpala bramki jakości
```

## Bramki jakości

| Bramka               | Narzędzie             | Nie przechodzi, gdy                                |
| -------------------- | --------------------- | -------------------------------------------------- |
| Lint                 | ESLint                | jest jakikolwiek błąd albo ostrzeżenie             |
| Typy                 | `tsc --noEmit`        | jest jakikolwiek błąd typów                        |
| Formatowanie         | Prettier              | plik nie jest sformatowany                         |
| Pisownia             | cspell                | jest nieznane słowo                                |
| Nieużywany kod       | knip                  | jest nieużywany plik, eksport albo zależność       |
| Testy jednostkowe    | Vitest                | test nie przechodzi albo pokrycie spada < 90%      |
| Wynik CRAP           | `dev/quality/crap.ts` | funkcja ma wynik powyżej 30                        |
| Skopiowany kod       | jscpd                 | jest kopia długości 50 tokenów lub więcej          |
| Architektura         | Archgate              | reguła z ADR-a jest złamana                        |
| Mutation testing     | Stryker               | wynik mutacji spada poniżej 80%                    |
| Testy akceptacyjne   | Playwright + Gherkin  | scenariusz nie przechodzi                          |
| Wiadomość w commicie | commitlint            | wiadomość nie jest w formacie Conventional Commits |

Wynik CRAP (Change Risk Anti-Patterns) łączy złożoność (cyclomatic complexity) z pokryciem testami:
złożoność² × (1 − pokrycie)³ + złożoność. Funkcja nie przechodzi, gdy jest jednocześnie
skomplikowana i słabo przetestowana. Prosta albo w pełni przetestowana funkcja zawsze przechodzi.

Bramki działają na trzech poziomach:

- `npm run validate`: wszystkie szybkie bramki. Tę komendę odpala Stop hook w Claude Code.
- `npm run validate:full`: `validate`, potem mutation testing, scenariusze Gherkin i budowanie
  dokumentacji. Przejście tej komendy oznacza, że zadanie jest skończone.
- CI: te same bramki przy każdym wypchnięciu na `main` i w każdym PR.

## Praca z agentami AI

Opis krok po kroku z przykładowymi poleceniami jest w [`GUIDE-pl.md`](GUIDE-pl.md).

Reguły dla każdego agenta są w [`AGENTS.md`](AGENTS.md). Codex, Cursor, Copilot i większość innych
narzędzi czyta ten plik bezpośrednio. Claude Code czyta `CLAUDE.md`, który tylko importuje
`AGENTS.md`.

- **Najpierw specyfikacja.** Opisujesz zachowanie jako scenariusze Gherkin w
  `tests/e2e/features/*.feature`. Agent sprawia, że przechodzą, pracując w TDD. Przykład:
  `tests/e2e/features/greeting.feature`.
- **Co przeglądasz.** Nie przeglądasz implementacji. Przeglądasz scenariusze i zmiany w
  istniejących asercjach, które każdy agent wypisuje w końcowym raporcie.
- **Role.** `.agents/roles/` definiuje cztery główne role, które pracują w tej kolejności:
  1. `specifier`: przygotowuje scenariusze.
  2. `edge-case-hunter`: wypisuje przypadki brzegowe, od częstych po ekstremalne, w
     `docs/edge-cases/` i pyta cię o przypadki, których specyfikacja nie obejmuje.
  3. `implementer`: pisze testy, w tym po jednym na każdy przypadek brzegowy, i kod.
  4. `reviewer`: porównuje testy ze scenariuszami i przypadkami brzegowymi oraz porządkuje kod.

  Dwie kolejne role wchodzą, gdy są potrzebne: `architect` zapisuje decyzje jako ADR-y i
  egzekwuje je regułami Archgate, a `documenter` aktualizuje dokumentację VitePress, strony arc42,
  indeks ADR-ów i komentarze TSDoc.

- **Chronione pliki.** Agenci nie mogą zmieniać scenariuszy, konfiguracji bramek, hooków, CI ani
  reguł dla agentów.

Każda część konfiguracji pilnuje reguł na innym poziomie:

| Warstwa                 | Gdzie                         | Działa z                            |
| ----------------------- | ----------------------------- | ----------------------------------- |
| Instrukcje              | `AGENTS.md`, `.agents/roles/` | każdym agentem                      |
| Hooki gita              | `.husky/`                     | każdym agentem i każdym człowiekiem |
| CI i właściciele kodu   | `.github/`                    | wszystkim, co trafia na `main`      |
| Adapter dla Claude Code | `.claude/`                    | tylko z Claude Code                 |

Adapter dla Claude Code dodaje trzy rzeczy:

- Stop hook. Claude nie może skończyć, dopóki `validate` nie przechodzi.
- Reguły uprawnień, które blokują zmiany w chronionych plikach.
- Osobnego agenta dla każdej roli.

Adapter jest opcjonalny: hooki gita i CI egzekwują te same reguły bez niego.

### Opcjonalne review przez AI

PR z etykietą `ai-review` dostaje komentarz z review od drugiego modelu przez
OpenRouter. Powinien to być inny model niż ten, który pisał kod. Szuka problemów, których bramki
nie widzą: testów niezgodnych ze scenariuszami i zachowania, którego nie opisuje żaden scenariusz.
Żeby to włączyć, dodaj w ustawieniach repo na GitHubie secret `OPENROUTER_API_KEY` i zmienną
`AI_REVIEW_MODEL` (identyfikator modelu w OpenRouter).

## Struktura projektu

```text
src/                  kod aplikacji
  db/                 schemat i klient Drizzle
tests/unit/           testy jednostkowe Vitest
tests/e2e/features/   scenariusze Gherkin (specyfikacja)
tests/e2e/steps/      step definitions i fixtures
dev/db/               skrypty migracji i danych testowych
dev/quality/          bramka CRAP
docs/                 dokumentacja VitePress (arc42, ADR-y)
.archgate/adrs/       decyzje architektoniczne (ADR)
.agents/roles/        instrukcje ról dla agentów AI
.claude/              adapter dla Claude Code (hooki, uprawnienia, agenci)
.github/              workflow CI, właściciele kodu, szablon opisu PR
```

## Skrypty

| Skrypt                                 | Co robi                                                        |
| -------------------------------------- | -------------------------------------------------------------- |
| `dev` / `start`                        | uruchamia z restartem po zmianach / uruchamia zbudowaną wersję |
| `build`                                | kompiluje TypeScript i Tailwind CSS do `dist/`                 |
| `validate` / `validate:full`           | szybkie bramki / wszystkie bramki                              |
| `autofix`                              | poprawia lint i formatowanie                                   |
| `test` / `test:coverage`               | testy jednostkowe / z pokryciem                                |
| `test:mutation`                        | mutation testing (Stryker)                                     |
| `test:e2e` / `test:e2e:open`           | scenariusze Gherkin w Playwright, w terminalu / w trybie UI    |
| `quality:crap` / `quality:duplication` | wynik CRAP / skopiowany kod                                    |
| `db:start` / `db:sync` / `seed:dev`    | uruchamia PostgreSQL / generuje i wykonuje migracje / dane     |
| `docs:dev` / `docs:api`                | strona z dokumentacją / dokumentacja API z TSDoc               |
| `update-dependencies`                  | aktualizuje wszystkie zależności do najnowszych wersji         |

Pełna lista narzędzi z uzasadnieniem każdego jest w [docs/clean-start.md](docs/clean-start.md)
([wersja angielska](docs/clean-start.en.md)).

## Licencja

[MIT](LICENSE)
