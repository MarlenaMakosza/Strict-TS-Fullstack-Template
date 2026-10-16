# 1. Wprowadzenie i cele

## Cel

Szablon dla projektów w czystym TypeScript na Node.js, bez frameworka. Ustawia surowy zestaw
narzędzi i bramki jakości, żeby nowy projekt startował od sprawdzeń na profesjonalnym poziomie,
zamiast dokładać je później.

## Użytkownicy

- Programiści, którzy zaczynają nowy projekt w TypeScript i chcą surowych sprawdzeń od pierwszego
  dnia.
- Programiści, którzy pozwalają agentom AI pisać kod i chcą, żeby o tym, co wejdzie do projektu,
  decydowały automatyczne sprawdzenia.

## Cele jakości

| Priorytet | Cel                       | Co to znaczy                                                                                 |
| --------- | ------------------------- | -------------------------------------------------------------------------------------------- |
| 1         | Poprawność                | Kod, który przechodzi bramki, ma testy i typy oraz jest sprawdzony pod kątem znanych pułapek |
| 2         | Szybka informacja zwrotna | Szybkie bramki trwają około minuty; wolne uruchamiają się przed merge i w CI                 |
| 3         | Elastyczność              | Każde narzędzie da się wyłączyć albo wymienić, a konfigurację AI usunąć                      |
