# 4. Strategia rozwiązania

| Cel                       | Podejście                                                                                                                  |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Poprawność                | Warstwy bramek: lint i typy, testy z progiem pokrycia, mutation testing, CRAP, duplikacja, reguły ADR, scenariusze Gherkin |
| Szybka informacja zwrotna | Trzy poziomy: hooki gita przy każdym commicie, `validate` przed końcem pracy, `validate:full` i CI przed merge             |
| Specyfikacja              | Zachowanie najpierw opisują scenariusze Gherkin; testy jednostkowe i kod powstają po nich w TDD                            |
| Architektura              | Decyzje to ADR-y, a reguły Archgate sprawdzają je w kodzie                                                                 |
| Elastyczność              | Każde narzędzie ma własny plik konfiguracji i da się je usunąć osobno; konfiguracja AI mieści się w kilku plikach          |
