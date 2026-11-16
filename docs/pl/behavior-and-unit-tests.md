# Testy zachowania i jednostkowe

Projekt ma dwa rodzaje testów Vitest. Vitest traktuje je tak samo: te same `describe`, `it` i
`expect`, ten sam runner i konfiguracja. Różnią się tym, co test importuje i co sprawdza. Katalog
mówi ludziom i agentom, którym rodzajem jest test.

## Różnica

|                       | Test zachowania                                                        | Test jednostkowy                                       |
| --------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------ |
| Importuje             | tylko punkt wejścia aplikacji: `createApp` albo `<App>`                | jeden moduł: `greet`, `fetchGreeting`                  |
| Wywołuje              | HTTP `app.request('/api/greeting?name=Ada')` albo kliknięcie przycisku | funkcję wprost: `greet(' Ada ')`                       |
| Sprawdza              | status, JSON, tekst na ekranie                                         | wynik funkcji i to, co zrobiła ze swoimi zależnościami |
| Po przebudowie środka | dalej przechodzi                                                       | może wymagać zmiany                                    |
| Katalog               | `tests/behavior/`                                                      | `tests/unit/`                                          |

## Po co oba

- **Testy zachowania** sprawdzają, co dostaje użytkownik albo klient API. Idą za scenariuszami
  Gherkin, więc dowodzą specyfikacji, i przeżywają przebudowę kodu, bo nie wiedzą nic o kodzie w środku.
  Każda zmiana zaczyna się od takiego testu (TDD outside-in).
- **Testy jednostkowe** sprawdzają wnętrze jednego modułu: każdą gałąź, każdy przypadek brzegowy
  i to, co moduł robi ze swoimi zależnościami (fałszywy `fetch`, fałszywy logger). Docierają do
  przypadków, które trudno ustawić z zewnątrz, i wskazują dokładnie ten moduł, który się zepsuł.

Oba liczą się do pokrycia 90% i do mutation testing. Scenariusz Gherkin nie liczy się do żadnego,
więc nigdy ich nie zastępuje.

## Ta sama reguła z dwóch stron

Powitanie obcina spacje wokół imienia:

```ts
// tests/behavior/server/app.test.ts: z zewnątrz, przez HTTP
const response = await appWithLogger().app.request('/api/greeting?name=%20Ada%20');
await expect(response.json()).resolves.toStrictEqual({ message: 'Hello, Ada!' });

// tests/unit/greet.test.ts: od środka, jedna funkcja
expect(greet('  Ada ')).toBe('Hello, Ada!');
```

## Przykłady w kodzie

- Zachowanie: `apps/api/tests/behavior/server/app.test.ts`, `apps/web/tests/behavior/App.test.tsx`.
- Jednostkowe: `apps/api/tests/unit/greet.test.ts`, `apps/web/tests/unit/api/greeting.test.ts`.
- Property-based (rodzaj testu jednostkowego): „for any name” w `apps/api/tests/unit/greet.test.ts`.

Zasady dla agentów są w sekcji „Test levels” w `AGENTS.md`.
