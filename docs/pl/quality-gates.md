# Bramki jakości

Bramka to automatyczne sprawdzenie, które kod musi przejść, zanim trafi do projektu. Każda bramka
działa tak samo dla kodu pisanego przez ludzi i przez agentów AI.

## Bramki

| Bramka               | Narzędzie                    | Nie przechodzi, gdy                                                    | Konfiguracja                            |
| -------------------- | ---------------------------- | ---------------------------------------------------------------------- | --------------------------------------- |
| Lint                 | ESLint                       | jest jakikolwiek błąd albo ostrzeżenie                                 | `eslint.config.js`                      |
| Typy                 | `tsc --noEmit`               | jest jakikolwiek błąd typów                                            | `tsconfig.json`                         |
| Formatowanie         | Prettier                     | plik nie jest sformatowany                                             | `.prettierrc`                           |
| Pisownia             | cspell                       | jest nieznane słowo                                                    | `cspell.json`                           |
| Nieużywany kod       | knip                         | jest nieużywany plik, eksport albo zależność                           | `knip.json`                             |
| Testy jednostkowe    | Vitest                       | test nie przechodzi albo pokrycie spada poniżej 90%                    | `apps/*/vitest.config.ts`               |
| Testy integracyjne   | Vitest + Testcontainers      | test na prawdziwej bazie danych nie przechodzi                         | `apps/api/vitest.integration.config.ts` |
| Wynik CRAP           | `dev/quality/crap.ts`        | funkcja ma wynik powyżej 30                                            | `dev/quality/crap.ts`                   |
| Skopiowany kod       | jscpd                        | jest kopia długości 50 tokenów lub więcej                              | `.jscpd.json`                           |
| Jeden React          | `dev/quality/one-version.ts` | `react` albo `react-dom` jest zainstalowany w więcej niż jednej wersji | `quality:one-react` w `package.json`    |
| Architektura         | Archgate                     | reguła z ADR-a jest złamana                                            | `.archgate/adrs/`                       |
| Mutation testing     | Stryker                      | wynik mutacji spada poniżej 80%                                        | `apps/*/stryker.config.json`            |
| Testy akceptacyjne   | Playwright + Gherkin (+ axe) | scenariusz nie przechodzi albo strona łamie WCAG 2.1 AA                | `playwright.config.ts`                  |
| Dokumentacja         | VitePress                    | dokumentacja się nie buduje albo link jest martwy                      | `.vitepress/config.ts`                  |
| Wiadomość w commicie | commitlint                   | wiadomość nie jest w formacie Conventional Commits                     | `commitlint.config.js`                  |
| Zależności           | `npm audit`                  | zależność runtime ma znaną podatność o wysokiej albo krytycznej wadze  | `security:audit` w `package.json`       |

## Wynik CRAP

Wynik CRAP (Change Risk Anti-Patterns) łączy złożoność (cyclomatic complexity) z pokryciem testami:

złożoność² × (1 − pokrycie)³ + złożoność

Funkcja nie przechodzi, gdy jest jednocześnie skomplikowana i słabo przetestowana. Prosta albo w
pełni przetestowana funkcja zawsze przechodzi. Złożoność pochodzi z reguły ESLint `complexity`, a
pokrycie z ostatniego `npm run test:coverage`.

## Kiedy bramki się uruchamiają

| Poziom             | Komenda                 | Co uruchamia                                                                                                                                         |
| ------------------ | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Każdy commit       | hooki gita (Husky)      | lint-staged na zmienionych plikach i commitlint na wiadomości                                                                                        |
| Przed końcem pracy | `npm run validate`      | wszystkie szybkie bramki: lint, typy, pisownia, nieużywany kod, testy, CRAP, jscpd, ADR-y                                                            |
| Definition of done | `npm run validate:full` | `validate`, potem audyt zależności, testy integracyjne, mutation testing, scenariusze Gherkin i budowanie dokumentacji                               |
| CI                 | GitHub Actions          | formatowanie, `validate`, testy integracyjne, mutation testing, scenariusze i budowanie dokumentacji przy każdym wypchnięciu na `main` i w każdym PR |

W Claude Code dodatkowo Stop hook odpala `npm run validate`, zanim Claude może skończyć zadanie.
Zobacz [Praca z agentami AI](./ai-workflow.md).

CI jest przygotowane tylko dla **GitHub Actions** (`.github/workflows/`). Na innej platformie, np.
GitLabie, w CI nic się nie uruchamia, dopóki go tam nie dodasz; hooki i komendy `npm run` działają
wszędzie tak samo. Każdy job w `.github/workflows/ci.yml` to `npm ci` i kilka komend `npm run`, więc
pipeline na innej platformie powtarza te komendy.
