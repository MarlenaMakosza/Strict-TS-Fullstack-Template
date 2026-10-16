# Architektura

Architektura tego szablonu opisana według [arc42](https://arc42.org/). arc42 ma dwanaście sekcji;
projekt opisuje tylko te, których potrzebuje. Projekt utworzony z szablonu zastępuje te strony
własnymi.

## Wszystkie sekcje arc42

| #   | Sekcja                   | Na jakie pytanie odpowiada                                            | W tym szablonie                                                                    |
| --- | ------------------------ | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 1   | Wprowadzenie i cele      | Do czego to służy, kto z tego korzysta, które cechy są najważniejsze  | [Wprowadzenie i cele](./01-introduction-goals.md)                                  |
| 2   | Ograniczenia             | Co jest ustalone z góry: technologia, zasady, organizacja             | [Ograniczenia](./02-constraints.md)                                                |
| 3   | Kontekst i zakres        | Gdzie kończy się system i z jakimi ludźmi oraz systemami rozmawia     | [Kontekst i zakres](./03-context-scope.md)                                         |
| 4   | Strategia rozwiązania    | Kilka kluczowych wyborów, które kształtują całą resztę                | [Strategia rozwiązania](./04-solution-strategy.md)                                 |
| 5   | Widok bloków budulcowych | Z jakich części składa się system i za co każda odpowiada             | [Bloki budulcowe](./05-building-blocks.md)                                         |
| 6   | Widok czasu działania    | Jak części współpracują w ważnych scenariuszach                       | [Widok czasu działania](./06-runtime-view.md)                                      |
| 7   | Widok wdrożenia          | Gdzie i jak system działa: serwery, kontenery, środowiska             | [Widok wdrożenia](./07-deployment-view.md)                                         |
| 8   | Koncepcje przekrojowe    | Zasady obowiązujące wszędzie: błędy, logowanie, nazwy, bezpieczeństwo | [Koncepcje przekrojowe i konwencje](./08-crosscutting-concepts-and-conventions.md) |
| 9   | Decyzje architektoniczne | Jakie ważne decyzje zapadły i dlaczego                                | [Decyzje](./decisions.md) (ADR-y w `.archgate/adrs/`)                              |
| 10  | Wymagania jakościowe     | Jak mierzyć cele jakości                                              | [Wymagania jakościowe](./10-quality-requirements.md)                               |
| 11  | Ryzyka i dług techniczny | Co może pójść źle i jakie skróty świadomie zrobiono                   | [Ryzyka i dług techniczny](./11-risks.md)                                          |
| 12  | Słownik                  | Pojęcia domeny, każde z jednym znaczeniem                             | [Słownik](./12-glossary.md)                                                        |

## Które sekcje opłacają się w projekcie prywatnym

W projekcie, który budujesz sama albo z agentami AI, większość arc42 jest opcjonalna. Warto mieć:

- **1. Wprowadzenie i cele:** kilka zdań o tym, do czego służy projekt i co jest najważniejsze.
  Trzyma zakres w ryzach i mówi agentowi, na czym ma się skupić.
- **9. Decyzje architektoniczne:** przyszła ty zapomni, dlaczego coś jest tak, a nie inaczej.
  Jeden ADR na ważną decyzję kosztuje niewiele, a Archgate zamienia go w sprawdzenie.
- **11. Ryzyka i dług techniczny:** lista świadomie zrobionych skrótów, żeby nie zginęły.
- **12. Słownik:** jedno znaczenie dla każdego pojęcia. Przy agentach AI to jeszcze ważniejsze:
  scenariusze, kod i agenci używają wtedy tych samych słów.

Pozostałe dodaj, gdy zaczną się opłacać:

- **2. Ograniczenia** i **4. Strategia rozwiązania:** krótka tabela każda, gdy stack się ustabilizuje.
- **5. Widok bloków budulcowych:** gdy kod ma więcej niż kilka modułów.
- **8. Koncepcje przekrojowe:** twoje konwencje kodu; szablon już je ma.
- **10. Wymagania jakościowe:** gdy projekt ma wymaganie, którego ogólne bramki nie obejmują, np.
  budżet wydajności.
- **3. Kontekst i zakres:** gdy projekt rozmawia z systemami zewnętrznymi.
- **6. Widok czasu działania** i **7. Widok wdrożenia:** tylko przy złożonych przepływach między
  częściami albo przy prawdziwym wdrożeniu na serwery.
