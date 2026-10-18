# 8. Koncepcje przekrojowe i konwencje kodu

Zasady obowiązujące w całym kodzie (arc42 nazywa je koncepcjami przekrojowymi): jak piszemy kod w
tym projekcie, zarówno ludzie, jak i agenci AI. ESLint, Prettier i TypeScript pilnują większości
mechaniki; ta strona opisuje decyzje, których nie sprawdzą. Gdy regułę już pilnuje narzędzie,
reguła o tym mówi.

## Nazwy

- Nazwy są **krótkie, ale jednoznaczne**: `getUserByEmail`, nie `getUserByEmailAddress`.
- Wartości logiczne zaczynają się od `is`, `has`, `can` albo `should` (`isActive`,
  `hasPermission`). Sprawdza to ESLint (`unicorn/consistent-boolean-name`).
- Akronimy piszemy wielkimi literami: `getUserID`, nie `getUserId`.
- Bez skrótów: `configuration`, nie `cfg`. Sprawdza to ESLint (`unicorn/name-replacements`) i
  dopuszcza kilka standardowych: `env`, `db`, `req`, `res`.

## Funkcje

- Funkcja robi **jedną rzecz**. Kilka kroków tego samego zadania jest w porządku.
- Guard clauses mogą wracać wcześniej, a ESLint (`no-else-return`) do nich zachęca. Poza nimi
  funkcja ma jedno wyjście.
- Długość nie jest miarą jakości. Złożoność jest: bramka CRAP odrzuca złożoną funkcję, która nie
  jest dobrze przetestowana (zobacz [Bramki jakości](../quality-gates.md)).

## Komentarze

- Komentuj **dlaczego**, a nie **co**: nazwa mówi co, komentarz wyjaśnia intencję i decyzje.
- Komentarz o tym _co_ to ostateczność, np. przy nieoczywistym algorytmie.
- `TODO` i `FIXME` są dozwolone jako tymczasowe znaczniki.
- Każda eksportowana funkcja, typ i stała ma komentarz **TSDoc** (`/** … */`). TypeDoc buduje z nich
  dokumentację API, a ESLint (`tsDoc/syntax`) sprawdza składnię.

```ts
/**
 * Calculates the discount for a user.
 * A trial user counts as premium for the first 30 days.
 *
 * @param user - The user to evaluate.
 * @returns The discount, from 0 to 1.
 */
export function getDiscount(user: User): number {
```

Kod i komentarze w kodzie piszemy po angielsku.

## Błędy

- Logika aplikacji zwraca **Result** z `apps/api/src/shared/result.ts` dla operacji, które mogą się
  nie udać, zamiast rzucać wyjątek. Budują go `success(value)` i `failure(error)`:

  ```ts
  import { failure, type Result, success } from './shared/result.ts';

  function parseAge(input: string): Result<number> {
    const age = Number(input);

    return Number.isSafeInteger(age) && age >= 0 ? success(age) : failure(`Not an age: ${input}`);
  }

  const result = parseAge(text);
  if (result.ok) {
    logger.info({ age: result.value }, 'Parsed the age'); // `value` wolno użyć dopiero po sprawdzeniu
  }
  ```

  Dzięki polu `ok` TypeScript zawęża typ, więc nie da się użyć `value` bez wcześniejszego
  sprawdzenia błędu. Domyślnie błąd to komunikat; dla błędu z określonymi wartościami podaj typ, np.
  `Result<User, 'not-found' | 'inactive'>`.

- Wyjątki łapiemy **tylko na granicach zewnętrznych** (baza danych, sieć, system plików,
  biblioteki zewnętrzne) i tam zamieniamy je w Result.
- Dwa wyjątki od zasady "nie rzucamy": błędna konfiguracja przy starcie kończy proces od razu
  błędem (zobacz `apps/api/src/env.ts` i ADR `ARCH-001`), a skrypty w `dev/` mogą rzucać.
- API odpowiada na każdy błąd w jednym formacie JSON: `{ "error": "Not found" }`. Przy błędnych
  danych wejściowych dodaje listę błędnych pól, ze statusem `400`:

  ```json
  { "error": "Invalid request", "issues": [{ "message": "…", "path": "range.from" }] }
  ```

  Trasa zamienia nieudany Result w jedną z takich odpowiedzi z pasującym statusem. Nieoczekiwany
  błąd dostaje `500` i `{ "error": "Internal server error" }`; szczegóły trafiają tylko do logu.

## Testy

- Domyślnie **TDD**: elastycznie, nie dogmatycznie.
- Testujemy tylko **publiczne API** modułu, nigdy prywatne funkcje.
- Nazwa testu opisuje sprawdzane zachowanie. Gdy liczy się stan początkowy, używamy
  `given <state> when <action> then <expected result>`.
- Pokrywamy zwykły przypadek **i** przypadki brzegowe. Pomagają w tym listy w `docs/edge-cases/`.
- Kod, który rozmawia z bazą danych, dostaje **test integracyjny** w `apps/api/tests/integration/`:
  działa on na prawdziwym PostgreSQL, który Testcontainers uruchamia w Dockerze, z migracjami
  zapisanymi w repozytorium. Testy jednostkowe nie dotykają bazy. Wzorzec:
  `apps/api/tests/integration/db/users.test.ts`.
- Gdy reguła działa dla każdego wejścia danego rodzaju ("każde imię daje powitanie kończące się
  na `!`"), dodajemy **test property-based** z [fast-check](https://fast-check.dev/). Generuje on
  wiele wejść, a gdy któreś nie przejdzie, zmniejsza je do najmniejszego przykładu, który nie
  przechodzi. Testy na przykładach zostają, bo dokumentują konkretne przypadki. Wzorzec:
  `apps/api/tests/unit/greet.test.ts`.

## Zależności i importy

- **Wstrzykiwanie zależności**: moduł dostaje zależności z zewnątrz i nigdy nie tworzy ich sam.

  ```ts
  class OrderService {
    public constructor(private readonly database: Database) {}
  }
  ```

- Kolejność importów: najpierw pakiety zewnętrzne, potem moduły projektu. Sortuje je ESLint
  (`perfectionist`).
- Importy względne z rozszerzeniem `.ts` (`./greet.ts`). Aliasy ścieżek (np. `@src/…`) są
  opcjonalne: włącz je razem, `aliasFlag` w `eslint.config.js` i `paths` w `tsconfig.json`.

## Struktura plików

Kod grupujemy według funkcji: każda funkcja ma własne pliki.

```text
apps/api/src/
  user/
    user.model.ts
    user.service.ts
  order/
    order.model.ts
    order.service.ts
  shared/
    result.ts
```

Wspólne typy i pomocnicze funkcje trafiają do `shared/`.

## Logowanie

- Logujemy przez `logger` z `apps/api/src/logger.ts`, czyli logger [pino](https://getpino.io/) (ADR
  `ARCH-002`). Kontekst przekazujemy jako obiekt, a wiadomość jako krótkie zdanie:

  ```ts
  logger.info({ userID }, 'Signed in');
  ```

- Poziom pochodzi z `LOG_LEVEL` (domyślnie `info`). Produkcja i testy zapisują linie JSON; w
  development pino-pretty pisze czytelne linie.
- Logi idą na stderr. ESLint (`no-console`) odrzuca `console.*` w `apps/api/src/`; do terminala
  piszą tylko skrypty w `dev/`.
- Serwer loguje jedną linię na zapytanie (`Request handled`) z metodą, ścieżką, statusem,
  `durationMs` i `requestID`. W trasie loguj z tym samym `requestID`, żeby wszystkie linie jednego
  zapytania dało się znaleźć razem.
- `apps/api/dev/logger-example.ts` pokazuje wszystkie typowe przypadki (poziomy, kontekst, błędy,
  loggery potomne, czyli `child`, ukrywanie sekretów) i jak zapisać logi do pliku. Uruchom go przez
  `npm run example:logger`.
- Pola z sekretami (`DATABASE_URL`, `password`, `token`, `authorization`, `cookie`) są
  ukrywane. Nowe dopisz do `SECRET_FIELDS` w `apps/api/src/logger.ts` i nigdy nie wkładaj sekretu do
  treści wiadomości.

## Null i undefined

- `null` to zamierzony brak wartości w domenie: użytkownik może nie mieć awatara.

  ```ts
  interface User {
    avatar: null | string;
  }
  ```

- `undefined` to wartość opcjonalna albo jeszcze nieustawiona.

  ```ts
  interface Config {
    timeout?: number;
  }
  ```

- Nie sygnalizujemy błędu przez `null` ani `undefined`: od tego jest Result.
- Bez `any`: gdy typ naprawdę jest nieznany, używamy `unknown`. Pilnuje tego ESLint i `strict` w
  `tsconfig.json`.

## Typy i enumy

- `interface` dla kształtu obiektów, `type` dla unii, aliasów i innych złożonych typów. Sprawdza to
  ESLint (`consistent-type-definitions`).

  ```ts
  interface User {
    name: string;
  }
  type Status = 'active' | 'inactive';
  type AdminUser = User & { role: string };
  ```

- **Bez `enum` i bez `const enum`.** Node uruchamia pliki `.ts` przez usuwanie typów: zamazuje
  adnotacje i uruchamia to, co zostało, bez kroku budowania. `enum` to nie adnotacja, tylko kod,
  który tworzy obiekt, więc usuwanie typów sobie z nim nie radzi i Node kończy się błędem
  `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`. `erasableSyntaxOnly` w `tsconfig.json` zgłasza taką składnię
  już w edytorze. Użyj unii literałów albo obiektu `as const`, gdy wartości są potrzebne w czasie
  działania:

  ```ts
  const DIRECTION = { up: 'up', down: 'down' } as const;
  type Direction = (typeof DIRECTION)[keyof typeof DIRECTION];
  ```

- **Przemyśl to dobrze, zanim zmienisz to w swoim projekcie.** Wybór wpływa na to, jak uruchamia się
  każdy plik, a późniejsza zmiana oznacza przeróbki w całym kodzie:

  | Opcja                                                      | Enumy | Koszt                                                                                                           |
  | ---------------------------------------------------------- | ----- | --------------------------------------------------------------------------------------------------------------- |
  | Usuwanie typów, bez enumów (szablon)                       | nie   | żaden; Node uruchamia `.ts` bezpośrednio, w trybie development, w testach i w scenariuszach                     |
  | `node --experimental-transform-types`                      | tak   | flaga jest eksperymentalna i może się zmienić; potrzebuje jej każda komenda `node` i każde narzędzie            |
  | Zawsze kompilacja (`tsc` albo bundler) przed uruchomieniem | tak   | krok budowania przed każdym uruchomieniem, testem i scenariuszem; znikają `erasableSyntaxOnly` i usuwanie typów |

  `npm run build` już kompiluje przez `tsc` na produkcję, ale development, testy jednostkowe i
  scenariusze uruchamiają pliki `.ts` bezpośrednio, więc enum by je zepsuł. Zobacz
  [Node.js: type stripping](https://nodejs.org/api/typescript.html#type-stripping) i
  [TypeScript 5.8: `--erasableSyntaxOnly`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-8.html#the---erasablesyntaxonly-option).

- Parametry typów generycznych mają opisowe nazwy (`TItem`, `TValue`, `TResult`). Pojedyncza litera
  jest w porządku tylko przy jednym parametrze o oczywistym znaczeniu.

## Formatowanie

Wszystko formatuje Prettier, z ustawieniami z `.prettierrc` (100 znaków w linii, pojedyncze
cudzysłowy, przecinki na końcu). `npm run format` je stosuje, a `npm run format:check` działa w CI.

## Praca z gitem

- **GitHub Flow**: `main` zawsze nadaje się do wydania, a każda zmiana przechodzi przez gałąź i PR.
- Nazwy gałęzi idą za typami commitów: `feat/krótki-opis`, `fix/…`, `docs/…`, `chore/…`.
- Nigdy nie commitujemy bezpośrednio na `main`. GitHub usuwa gałąź po merge; usuń też lokalną
  kopię (zobacz [Ustawienia GitHuba](../getting-started.md#ustawienia-githuba)).

## Commity i pull requesty

- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) po angielsku. `commitlint`
  sprawdza format, a typ decyduje o następnej wersji (zobacz [Wydania](../getting-started.md#wydania)).
- Jedna zmiana: wiadomość w jednej linii. Więcej kontekstu: treść po pustej linii.

  ```text
  feat: add user discount calculation

  Trial users count as premium for the first 30 days.
  ```

- PR wypełnia `.github/PULL_REQUEST_TEMPLATE.md`: What, Why i How to test są wymagane;
  Screenshots, Breaking changes i AI assistance są opcjonalne.
- Komentarze w review piszemy jako [Conventional Comments](../code-review.md).
