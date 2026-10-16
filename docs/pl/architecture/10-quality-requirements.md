# 10. Wymagania jakościowe

Cele jakości z [sekcji 1](./01-introduction-goals.md), zamienione w mierzalne scenariusze. Ogólne
sprawdzenia to [bramki jakości](../quality-gates.md); ta strona dodaje to, czego bramka nie wyrazi,
i jest miejscem na wymagania konkretnego projektu.

## Scenariusze dla tego szablonu

| Cel                       | Scenariusz                                            | Miara                                                                  |
| ------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------- |
| Poprawność                | Zmiana psuje zachowanie opisane w scenariuszu Gherkin | CI nie przechodzi przed merge                                          |
| Poprawność                | Test przechodzi, choć niczego nie sprawdza            | Wynik mutacji spada poniżej 80%, CI nie przechodzi                     |
| Poprawność                | Złożona funkcja nie ma testów                         | Wynik CRAP powyżej 30, `validate` nie przechodzi                       |
| Szybka informacja zwrotna | Programista odpala szybkie bramki przed commitem      | `npm run validate` trwa wyraźnie poniżej minuty                        |
| Szybka informacja zwrotna | Otwarto pull request                                  | Wszystkie checki CI kończą się w kilka minut                           |
| Elastyczność              | Projekt usuwa konfigurację AI                         | Wszystkie bramki dalej przechodzą (sprawdzone przy pisaniu instrukcji) |
| Elastyczność              | Projekt wymienia albo usuwa jedno narzędzie           | Zmienia się jeden plik konfiguracji i jego skrypty, nic więcej         |

## Wymagania twojego projektu

Każde wymaganie zapisz jako scenariusz z miarą, żeby dało się je sprawdzić:

```text
<cel jakości>: gdy <sytuacja>, wtedy <oczekiwany wynik>, mierzone przez <liczba albo sprawdzenie>.
```

Przykłady tego, co projekty często dodają:

- **Wydajność:** "Graf 2000 postaci renderuje się w mniej niż 1 s na przeciętnym laptopie."
- **Bezpieczeństwo:** "Nie mergujemy zależności ze znaną podatnością o wysokiej albo krytycznej
  wadze" (`npm audit` w CI).
- **Dostępność:** "Każda strona przechodzi automatyczne sprawdzenie dostępności" (np. axe w
  scenariuszach Playwright).
- **Niezawodność:** "Nieudane połączenie z bazą daje jasny komunikat i aplikacja się nie uruchamia."

Gdzie się da, zamień wymaganie w bramkę: test, krok w CI, regułę ESLint albo regułę Archgate.
Resztę zostaw tutaj, żeby reviewer mógł sprawdzić ją ręcznie.
