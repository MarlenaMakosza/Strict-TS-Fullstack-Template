# 3. Kontekst i zakres

```text
                 ┌────────────────────────────┐
 programista ──▶ │                            │ ──▶ PostgreSQL (Docker, lokalnie)
 agent AI    ──▶ │  projekt z szablonu        │
                 │                            │ ──▶ GitHub Actions: CI, wydania, dokumentacja
                 └────────────────────────────┘ ──▶ OpenRouter (opcjonalne review przez AI)
```

| Partner        | Co robi                                                         |
| -------------- | --------------------------------------------------------------- |
| Programista    | Pisze specyfikację (scenariusze Gherkin), robi review, merguje  |
| Agent AI       | Pisze kod i testy zgodnie z regułami `AGENTS.md`                |
| PostgreSQL     | Baza danych, uruchamiana przez Docker Compose                   |
| GitHub Actions | Uruchamia bramki, otwiera release PR, publikuje tę dokumentację |
| OpenRouter     | Opcjonalny drugi model do review PR przez AI                    |
