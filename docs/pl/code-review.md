# Code review

Komentarze w review są w formacie [Conventional Comments](https://conventionalcomments.org/).
Etykieta na początku komentarza mówi, jakiego rodzaju to uwaga i czy blokuje merge, więc nikt nie
musi zgadywać tonu ani priorytetu.

## Format

```text
<label> (<decorations>): <subject>

<discussion>
```

- **label**: rodzaj komentarza, z tabeli poniżej.
- **decorations** (opcjonalnie): `blocking` (trzeba rozwiązać przed merge), `non-blocking` (można
  scalić bez tego) albo `if-minor` (rozwiąż, tylko jeśli zmiana jest mała).
- **subject**: sedno komentarza, w jednym zdaniu.
- **discussion** (opcjonalnie): uzasadnienie, przykład albo link.

## Etykiety

| Etykieta     | Do czego                                                 |
| ------------ | -------------------------------------------------------- |
| `praise`     | coś zrobionego dobrze, warto to zachować                 |
| `nitpick`    | drobna uwaga, kwestia gustu; zawsze non-blocking         |
| `suggestion` | konkretne ulepszenie; napisz, czy blokuje                |
| `issue`      | problem do poprawienia; dodaj sugestię, jeśli ją masz    |
| `todo`       | mała, konieczna zmiana, np. brakujący test               |
| `question`   | coś niejasnego albo do potwierdzenia                     |
| `thought`    | pomysł na później, nie prośba w tym PR                   |
| `chore`      | krok wymagany przed merge, np. aktualizacja dokumentacji |
| `note`       | informacja dla czytającego, nic do zrobienia             |

Etykiety i dekoracje zostają po angielsku: tak opisuje je specyfikacja i tak rozpoznają je
narzędzia.

## Przykłady

```text
issue (blocking): tests/unit/greet.test.ts:12 asserts the old greeting

The scenario in tests/e2e/features/greeting.feature now expects "Hello, Ada!".
```

```text
suggestion (non-blocking): extract the trimming into its own function

It would make the empty-name case easier to test on its own.
```

```text
praise: the edge case list covers every boundary of the input
```

## Kto z tego korzysta

- Ludzie robiący review PR.
- Agent `reviewer`, w swoim końcowym raporcie.
- Opcjonalne AI review w CI (zobacz [Praca z agentami AI](./ai-workflow.md)), w komentarzu do PR.

## Szybciej na GitHubie: zapisane odpowiedzi

Zapisz etykiety, których używasz najczęściej, jako zapisane odpowiedzi: GitHub → twój awatar →
**Settings → Saved replies**, np. odpowiedź o nazwie `issue-blocking` z treścią
`issue (blocking): `. W dowolnym polu komentarza naciśnij `Ctrl` + `.` (`Cmd` + `.` na macOS) i
wybierz odpowiedź.
