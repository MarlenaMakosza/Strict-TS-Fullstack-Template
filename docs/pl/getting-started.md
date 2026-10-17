# Pierwsze kroki

## Wymagania

- Node.js 24 (wersja jest w `.nvmrc`; ze starszą `npm install` odmówi instalacji) z wersją npm
  z pola `packageManager` w `package.json` (Renovate ją aktualizuje)
- Docker, dla PostgreSQL
- git

## Instalacja

```sh
git clone https://github.com/MarlenaMakosza/Ultimate-TS-AI-project.git
cd Ultimate-TS-AI-project
nvm use
cp .env.example .env
npm run firstrun:dev
```

`firstrun:dev` instaluje zależności i sprawdza typy. Potem uruchamia PostgreSQL, wykonuje migracje
i wypełnia bazę danymi.

## Własny projekt na bazie szablonu

`CHANGELOG.md` i wersja w `package.json` opisują wydania tego szablonu. W projekcie utworzonym z
szablonu usuń `CHANGELOG.md`, ustaw `version` w `package.json` i w `.release-please-manifest.json`
na `0.0.0` i zmień `name` w `package.json`.

## Na co dzień

```sh
npm run dev             # uruchamia src/index.ts i restartuje go po każdej zmianie
npm run validate        # szybkie bramki jakości
npm run validate:full   # wszystkie bramki: odpal przed uznaniem zadania za skończone
```

Pozostałe komendy są w [Skryptach](./scripts.md), a to, co sprawdza każda bramka, w
[Bramkach jakości](./quality-gates.md).

## Wydania

Wersje są zgodne z [SemVer](https://semver.org/) i wynikają z wiadomości w historii gita, które
`commitlint` już pilnuje w formacie Conventional Commits: `fix:` podbija wersję patch, `feat:`
wersję minor, a zmiana łamiąca (`feat!:` albo `BREAKING CHANGE:`) wersję major. Przed 1.0.0 zmiana
łamiąca podbija wersję minor.

Po każdym merge'u na `main` release-please aktualizuje otwarty release PR z następną wersją i
nowymi wpisami w `CHANGELOG.md`. Merge tego PR taguje wersję i tworzy GitHub Release. Nigdy nie
edytuj `CHANGELOG.md` ani wersji ręcznie.

release-please potrzebuje kilku ustawień repo: zobacz [Ustawienia GitHuba](#ustawienia-githuba).

## Ustawienia GitHuba

Jeśli projekt jest na GitHubie, ustaw to raz w ustawieniach repo.

**Settings → General → Pull Requests**

- Wyłącz **Allow merge commits** i **Allow rebase merging**, zostaw **Allow squash merging**.
- Przy squash merging ustaw **Default commit message** na **Pull request title and description**.
- Włącz **Automatically delete head branches**.

Dzięki temu każdy PR trafia na `main` jako jeden commit: tytuł PR to jego pierwsza linia, a opis to
jego treść. Dostaje jeden wpis w `CHANGELOG.md`. Dlatego:

- **Tytuł PR musi być w formacie Conventional Commits** (`feat: …`, `fix: …`, `docs: …`): to on
  decyduje o następnej wersji.
- Wiersze `Assisted-by` na końcu opisu stają się trailerami tej
  zmiany, więc
  [statystyki AI](./ai-workflow.md#podpisy-ai-i-statystyki) mogą je policzyć.
- Pisz `BREAKING CHANGE:` w opisie tylko przy prawdziwej zmianie łamiącej: podbija wersję major. Merge commit dodałby każdą
  zmianę do CHANGELOG dwa razy: raz za commit i raz za merge commit, który powtarza tytuł PR.

**Settings → Pages → Build and deployment**

- Ustaw **Source** na **GitHub Actions**. Workflow Docs (`.github/workflows/pages.yml`)
  publikuje wtedy tę dokumentację przy każdym wypchnięciu na `main`.

**Settings → Actions → General → Workflow permissions**

- Włącz **Allow GitHub Actions to create and approve pull requests**. Bez tego release-please nie
  otworzy release PR.

**Settings → Advanced Security**

`npm run security:audit` i `eslint-plugin-security` nie wymagają żadnego ustawienia. `SECURITY.md`
wymaga jednego:

- Włącz **Private vulnerability reporting**. `SECURITY.md` prosi, żeby lukę zgłaszać prywatnie,
  przez **Security → Report a vulnerability**. Bez tego ustawienia tego przycisku nie ma.
- Opcjonalnie: **Dependabot alerts**. GitHub pokazuje wtedy znane luki we wszystkich
  zależnościach, także w narzędziach deweloperskich; `npm run security:audit` sprawdza tylko
  zależności runtime (zobacz [Bramki jakości](./quality-gates.md)). Na start spodziewaj się kilku
  tuzinów alertów, prawie wszystkich w narzędziach, które nigdy nie działają na produkcji, i
  domyślnie e-maila o każdym. E-maile wyłączysz w swoich osobistych **Settings → Notifications →
  Dependabot alerts**. Zostaw wyłączone **Dependabot security updates**: otwiera PR dla każdej
  poprawki, a zależności i tak aktualizuje Renovate.

**Settings → Rules → Rulesets** (albo **Settings → Branches**), dla `main`

- Wymagaj PR przed merge i przechodzących sprawdzeń CI: `validate`, `mutation` i `e2e`.
  `validate` zawiera `npm run security:audit`.
- Na release PR nie uruchamia się CI, bo GitHub nie startuje workflow dla zmian zrobionych
  domyślnym `GITHUB_TOKEN`. Przy wymaganych sprawdzeniach dodaj siebie do listy obejść (bypass) albo daj
  release-please osobisty token (pole `token` w akcji).

Po merge GitHub usuwa gałąź zdalną, ale twoja lokalna kopia zostaje. Usuń ją też, bo inaczej
następny `git push --all` ją przywróci:

```sh
git switch main && git pull
git fetch --prune
git branch -D <gałąź>   # -D: po squash merge git nie uznaje gałęzi za scaloną
```

## Struktura projektu

```text
src/                  kod aplikacji
  db/                 schemat i klient Drizzle
tests/unit/           testy jednostkowe Vitest
tests/e2e/features/   scenariusze Gherkin (specyfikacja)
tests/e2e/steps/      step definitions i fixtures
dev/db/               skrypty migracji i danych testowych
dev/quality/          bramka CRAP
docs/                 ta dokumentacja (VitePress); polska wersja w docs/pl/
.archgate/adrs/       decyzje architektoniczne (ADR)
.agents/roles/        instrukcje ról dla agentów AI
.claude/              adapter dla Claude Code (hooki, uprawnienia, agenci)
.github/              workflow CI, właściciele kodu, szablon opisu PR
```
