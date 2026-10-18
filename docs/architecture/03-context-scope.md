# 3. Context and scope

```text
                 ┌────────────────────────────┐
 user      ────▶ │  web app ──▶ API (/api/)   │
 developer ────▶ │                            │ ──▶ PostgreSQL (Docker, local)
 AI agent  ────▶ │  project from the template │
                 │                            │ ──▶ GitHub Actions: CI, releases, docs
                 └────────────────────────────┘ ──▶ OpenRouter (optional AI review)
```

| Partner        | What it does                                                           |
| -------------- | ---------------------------------------------------------------------- |
| User           | Uses the web app in a browser; the web app calls the API under `/api/` |
| Developer      | Writes the specification (Gherkin scenarios), reviews, merges          |
| AI agent       | Writes code and tests within the rules of `AGENTS.md`                  |
| PostgreSQL     | Database, started with Docker Compose                                  |
| GitHub Actions | Runs the gates, opens release pull requests, publishes these docs      |
| OpenRouter     | Optional second model for AI review of pull requests                   |
