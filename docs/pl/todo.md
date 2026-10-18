# Do zrobienia

Znane obejścia i zaplanowana praca, każde z warunkiem, który je kończy. Gdy zamkniesz pozycję, usuń
ją tutaj i w [Ryzykach i długu technicznym](./architecture/11-risks.md), jeśli tam jest.

## Obejścia do usunięcia

| Obejście                                                                  | Dlaczego jest                                                                                                                                                                                                                                                                                                       | Usuń je, gdy                                                                                                                                        |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Katalog główny ma `react` i `react-dom` 19 w zależnościach deweloperskich | VitePress 1.6 przynosi Reacta 18 przez DocSearch, a npm położył go wyżej niż Reacta 19 z aplikacji webowej, więc Testing Library renderowało złą kopią. Wpis w katalogu głównym sprawia, że npm kładzie na górze Reacta 19. `npm run quality:one-react` (część `validate`) zatrzymuje się, jeśli wrócą dwie wersje. | VitePress 2 będzie stabilny: używa DocSearch 4, który nie zależy od Reacta. Wtedy usuń oba wpisy, wyjątek knip dla nich i krok `quality:one-react`. |
| Brak lintowania dostępności                                               | `eslint-plugin-jsx-a11y` nie miał wydania od 2024 i nie obsługuje ESLint 10.                                                                                                                                                                                                                                        | On albo utrzymywany następca obsłuży ESLint 10. Do tego czasu dostępność sprawdza axe w scenariuszach w przeglądarce.                               |
| Stryker uruchamia Vitest przez command runner                             | `@stryker-mutator/vitest-runner` nie działa z Vitest 5 (stryker-js #6210).                                                                                                                                                                                                                                          | To zgłoszenie zostanie naprawione: przełącz `testRunner` z powrotem na `vitest`, który jest szybszy.                                                |

## Zaplanowane

- **Scenariusze Gherkin w przeglądarce**: scenariusze na prawdziwej aplikacji webowej, z axe do
  sprawdzania dostępności, oraz role agentów `ux-designer` i `ui-reviewer`.
- **`/api/users`**: użytkownicy z bazy danych i `/api/health`, który sprawdza też bazę.
- **CORS na produkcję**: potrzebny, gdy aplikacja webowa i API działają pod różnymi adresami.
- **Kontrakt OpenAPI jako plik** (`apps/api/openapi.json`), sprawdzany w CI, żeby aplikacja webowa
  generowała z niego typy, zamiast powtarzać schematy.

## Do rozważenia

- Strona z dokumentacją API na podstawie `/api/openapi.json`: Scalar albo Swagger UI. Do ustalenia:
  tylko w trybie development, czy też na produkcji, włączana ustawieniem.
- `Dockerfile` do wdrożenia API i serwowania zbudowanej aplikacji webowej.
- pnpm zamiast npm: każda paczka widzi tylko swoje zależności, co na dobre kończy konflikty przy
  hoistingu, takie jak ten z Reactem. Warto, jeśli będzie ich więcej.
- Turborepo albo Nx, gdy CI zacznie być wolne.
- Dev container, polecane rozszerzenia VS Code oraz `concurrency` i cache przeglądarek Playwright w
  CI.
