# Przewodnik: praca z agentami AI

Jak dodać nową funkcjonalność do projektu, gdy kod piszą agenci AI, a ty pilnujesz specyfikacji.
Szczegółowe reguły dla agentów są w [`AGENTS.md`](AGENTS.md), a opis projektu w
[`README.md`](README.md).

## Ściągawka: agenci po kolei

| #   | Agent              | Co robi                                     | Co sprawdzasz ty                                |
| --- | ------------------ | ------------------------------------------- | ----------------------------------------------- |
| 1   | `specifier`        | Wymaganie → scenariusz Gherkin (`.feature`) | Odpowiadasz na pytania, zatwierdzasz `.feature` |
| 2   | `edge-case-hunter` | Lista przypadków brzegowych                 | Odpowiadasz na „Questions for the human”        |
| 3   | `architect`        | ADR i reguła Archgate (tylko gdy potrzeba)  | Zatwierdzasz albo odrzucasz ADR                 |
| 4   | `implementer`      | Testy i kod, aż bramki przejdą              | Raport: zmienione asercje, przypadki brzegowe   |
| 5   | `reviewer`         | Porównuje testy ze scenariuszem             | Lista niezgodności                              |
| 6   | `documenter`       | Dokumentacja, README, TSDoc                 | Zmienione strony w `docs/` i README             |

Przykładowe polecenia dla Claude Code:

```text
1. Użyj agenta specifier. Wymaganie: <co ma robić aplikacja>.
2. Użyj agenta edge-case-hunter dla cypress/e2e/<nazwa>.feature.
3. Użyj agenta architect. Czy <zmiana> wymaga decyzji architektonicznej? Jeśli tak, zaproponuj ADR z regułą.
4. Użyj agenta implementer dla cypress/e2e/<nazwa>.feature i docs/edge-cases/<nazwa>.md.
5. Użyj agenta reviewer dla zmian z <nazwa>.
6. Użyj agenta documenter dla zmian z <nazwa>.
```

W innych narzędziach (Codex, Cursor, Copilot…) zamiast „Użyj agenta X” napisz: „Przeczytaj
`AGENTS.md` i `.agents/roles/X.md`, a potem…”.

Na koniec:

```sh
npm run validate:full
```

## Idea w jednym zdaniu

**Ty mówisz, co program ma robić. Agent pisze kod. Automat sprawdza, czy kod jest dobry.**

Nie musisz czytać kodu agenta. Sprawdza go zestaw automatycznych testów i metryk, czyli bramek.
Kod, który nie przejdzie wszystkich bramek, nie wejdzie do projektu.

## Podział pracy

| Kto     | Co robi                                                | Gdzie                                      |
| ------- | ------------------------------------------------------ | ------------------------------------------ |
| Ty      | Opisujesz zachowanie programu i odpowiadasz na pytania | `cypress/e2e/*.feature`, raporty agentów   |
| Agenci  | Piszą scenariusze, testy, kod i dokumentację           | `cypress/`, `tests/unit/`, `src/`, `docs/` |
| Automat | Sprawdza wszystko bramkami                             | `npm run validate:full`, CI                |

Czytasz tylko:

- scenariusze `.feature`,
- pytania edge-case-huntera,
- raport agenta implementer, zwłaszcza zmienione asercje w istniejących testach,
- raport agenta reviewer.

Nie czytasz kodu w `src/` ani testów. Za ciebie robią to bramki i reviewer. Na początek możesz
jednak zaglądać w diff, dopóki nie zaufasz bramkom.

## Cały przebieg krok po kroku

Przykład: aplikacja ma witać po imieniu podanym jako argument.

### Krok 0: przygotowanie

```sh
cd /mnt/games/source/public/Ultimate-TS-AI-project
nvm use
git switch main && git pull
git switch -c feat/<nazwa>
```

Osobna gałąź pozwala łatwo wszystko wyrzucić, jeśli eksperyment nie wyjdzie.

### Krok 1: specifier, czyli scenariusz

```text
Użyj agenta specifier. Wymaganie: gdy uruchomię aplikację z imieniem jako argumentem
(node src/index.ts Ada), ma przywitać po imieniu: "Hello, Ada!". Bez argumentu działa jak dotąd.
```

- Odpowiadasz na pytania agenta, np. czy przy imieniu wyświetlać środowisko albo co zrobić przy
  kilku argumentach.
- Claude pyta o zgodę na zapis pliku `.feature`. Przeczytaj scenariusz i zatwierdź.
- Plik `.feature` możesz też napisać sama. Musi zaczynać się od linii `Feature:`, np.:

```gherkin
Feature: Greeting by name

  Scenario: Greet by name
    When I start the app with name "Ada"
    Then the app prints "Hello, Ada!"
```

Wzorzec stylu to `cypress/e2e/greeting.feature`.

### Krok 2: edge-case-hunter, czyli przypadki brzegowe

```text
Użyj agenta edge-case-hunter dla cypress/e2e/<nazwa>.feature.
```

Agent zapisuje listę w `docs/edge-cases/<nazwa>.md`, od częstych po ekstremalne: pusty tekst, same
spacje, emoji, bardzo długie imię… Wzór to `docs/edge-cases/greeting.md`.

- **Odpowiadasz na sekcję „Questions for the human”.** To najważniejsza część. Każda odpowiedź to
  brakujący kawałek specyfikacji.
- Przypadki widoczne dla użytkownika możesz poprosić agenta specifier o dopisanie ich do `.feature`.
- Claude pyta o zgodę przy każdej zmianie w `docs/edge-cases/`.

### Krok 3: architect (tylko gdy potrzebny)

Potrzebny, gdy zadanie wymaga decyzji trudnej do odwrócenia: nowa zależność, nowa warstwa, sposób
przechowywania danych, konwencja błędów albo API. Argument z linii poleceń to nie taka decyzja,
ale możesz sprawdzić, czy agent to oceni tak samo:

```text
Użyj agenta architect. Czy ta zmiana wymaga ADR? Tylko oceń.
```

Gdy ADR jest potrzebny, architect zakłada go przez Archgate w `.archgate/adrs/` i, jeśli się da,
dopisuje regułę, która sprawdza decyzję automatycznie. Wzór to `ARCH-001`. Zmiany w ADR-ach
zatwierdzasz ty.

### Krok 4: implementer, czyli kod

```text
Użyj agenta implementer dla cypress/e2e/<nazwa>.feature i docs/edge-cases/<nazwa>.md.
```

Teraz nic nie robisz. Agent:

1. sprawdza ADR-y dla zmienianych plików (`npx archgate review-context`),
2. pisze test jednostkowy, który na razie nie przechodzi,
3. pisze kod, aż test przejdzie, potem porządkuje,
4. pisze testy dla przypadków brzegowych z listy,
5. pisze step definitions, czyli łączy zdania z `.feature` z kodem.

Stop hook nie pozwoli Claude'owi skończyć, dopóki `npm run validate` nie przejdzie.

Po skończeniu czytasz raport:

- **Commands**: jakie bramki odpalił i z jakim wynikiem.
- **Changed existing tests**: czy zmienił stare asercje i dlaczego. Agent mógłby „naprawić” test
  pod swój błędny kod, dlatego musi to zgłosić. Przy powitaniu po imieniu spodziewaj się zmian
  tam, gdzie `src/index.ts` składa komunikat.
- **Edge cases**: co przetestował, a co pominął i dlaczego.
- **Open questions**: co w specyfikacji było niejasne.

### Krok 5: reviewer, czyli kontrola

```text
Użyj agenta reviewer dla zmian z <nazwa>.
```

Sprawdza, czy testy naprawdę sprawdzają to, co mówi scenariusz, a nie tylko to, co kod akurat
robi. Sprawdza też, czy każdy przypadek brzegowy ma test. Czytasz jego listę niezgodności.

### Krok 6: documenter

```text
Użyj agenta documenter dla zmian z <nazwa>.
```

Aktualizuje README, strony w `docs/`, indeks ADR-ów i komentarze TSDoc. Pilnuje, żeby strona
VitePress budowała się bez martwych linków.

### Krok 7: sprawdzenie i merge

```sh
npm run validate:full
git log main..
git push -u origin feat/<nazwa>
```

Otwórz pull request na GitHubie i poczekaj na zielone CI. Merge robisz ty.

## Co sprawdzają bramki

`npm run validate:full` sprawdza kolejno:

- czy kod jest poprawnie napisany: lint, typy, pisownia,
- czy nie ma nieużywanego kodu (knip),
- czy testy przechodzą i pokrywają co najmniej 90% kodu,
- czy żadna funkcja nie jest jednocześnie skomplikowana i słabo przetestowana (CRAP, próg 30),
- czy nie ma skopiowanego kodu (jscpd),
- czy kod przestrzega ADR-ów (Archgate),
- czy testy naprawdę coś łapią: mutation testing celowo psuje kod, a testy muszą to wykryć (próg
  80%),
- czy scenariusze Gherkin przechodzą,
- czy dokumentacja się buduje.

Dodatkowo:

- przy commicie git hook sprawdza formatowanie i format wiadomości (Conventional Commits),
- na GitHubie CI odpala bramki jeszcze raz,
- pull request z etykietą `ai-review` dostaje komentarz od innego modelu AI (wymaga konfiguracji,
  patrz niżej).

## Pliki: po co jest każdy

**Reguły dla agentów** (działają z każdym narzędziem):

- `AGENTS.md`: główne reguły, definition of done, format raportu, chronione pliki.
- `CLAUDE.md`: tylko odsyła do `AGENTS.md`.
- `.agents/roles/`: sześć ról z tego przewodnika.

**Bramki:**

- `vitest.config.ts`: próg coverage 90%.
- `stryker.config.json`: próg mutation testing 80%.
- `dev/quality/crap.ts`: liczy CRAP.
- `.jscpd.json`: wykrywanie skopiowanego kodu.
- `.archgate/adrs/`: decyzje architektoniczne i ich reguły.

**Wzorce do naśladowania:**

- `cypress/e2e/greeting.feature`: scenariusz Gherkin.
- `cypress/support/step-definitions/app.steps.ts`: step definitions.
- `docs/edge-cases/greeting.md`: lista przypadków brzegowych.
- `.archgate/adrs/ARCH-001-*.md` i `.rules.ts`: ADR z regułą.

**Tylko dla Claude Code** (opcjonalne, reszta działa bez tego):

- `.claude/settings.json`: co Claude może robić bez pytania, o co musi zapytać (zmiany w
  `.feature`, przypadkach brzegowych i ADR-ach), a czego nie może wcale (konfiguracja bramek).
- `.claude/hooks/stop-validate.sh`: nie pozwala skończyć z czerwonymi bramkami.
- `.claude/agents/`: role jako agenci Claude Code.

**GitHub:**

- `.github/workflows/ci.yml`: bramki na każdym push i PR.
- `.github/workflows/ai-review.yml`: opcjonalne review innym modelem.
- `.github/CODEOWNERS`: zmiany w ważnych plikach wymagają akceptacji właścicielki.

## Jednorazowe ustawienia

1. Node 24: `nvm use` w katalogu projektu. Przy starszym Node `npm install` odmówi instalacji.
2. GitHub, Settings → Branches → `main`:
   - włącz wymaganie przechodzącego CI,
   - opcja „Require review from Code Owners” ma sens tylko wtedy, gdy agenci wypychają zmiany z innego
     konta niż twoje.
3. AI review (opcjonalnie): dodaj secret `OPENROUTER_API_KEY` i zmienną `AI_REVIEW_MODEL`. Bez
   nich workflow się nie uruchamia i nic nie kosztuje.
4. GitLab: repo jest tam kopią, ale CI na GitLabie nie działa, bo GitLab nie czyta
   `.github/workflows/`. Wypychasz osobno: `git push gitlab main`.

## Jak zacząć

Najprostszy start: jedna mała funkcja, scenariusz w `.feature` i polecenie dla agenta implementer.
Potem przeczytaj jego raport. Pozostałe role dokładaj, gdy ten podstawowy cykl stanie się
naturalny.
