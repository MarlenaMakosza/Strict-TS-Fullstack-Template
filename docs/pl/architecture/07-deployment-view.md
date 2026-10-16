# 7. Widok wdrożenia

Sam szablon nie jest wdrażany jako usługa. Ta strona mówi, gdzie działa, żeby projekt utworzony z
szablonu wiedział, co zastąpić własnym wdrożeniem.

| Środowisko   | Gdzie                           | Co tam działa                                                    |
| ------------ | ------------------------------- | ---------------------------------------------------------------- |
| Lokalnie     | komputer programisty            | Node.js 24, PostgreSQL w Dockerze (`docker-compose.yml`), bramki |
| CI           | GitHub Actions, `ubuntu-latest` | `npm ci` i bramki, bez bazy danych                               |
| Dokumentacja | GitHub Pages                    | strona VitePress budowana przez workflow Docs                    |
| Wydania      | GitHub Releases                 | tag i ZIP źródeł dla każdej wersji                               |

Konfiguracja pochodzi ze zmiennych środowiskowych, sprawdzanych przy starcie (ADR `ARCH-001`).
`.env.example` je wymienia; prawdziwego `.env` nigdy nie commitujemy.

Gdy projekt dostanie prawdziwe wdrożenie, opisz je tutaj: cel (serwer, kontener, serverless), jak
wydanie tam trafia i skąd biorą się jego konfiguracja i sekrety.
