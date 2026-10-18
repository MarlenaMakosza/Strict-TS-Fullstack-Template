# 3. Context and scope

```text
                 ┌────────────────────────────┐
 frontend  ────▶ │  HTTP API under /api/      │
 developer ────▶ │                            │ ──▶ PostgreSQL (Docker, local)
 AI agent  ────▶ │  project from the template │
                 │                            │ ──▶ GitHub Actions: CI, releases, docs
                 └────────────────────────────┘ ──▶ OpenRouter (optional AI review)
```

| Partner        | What it does                                                          |
| -------------- | --------------------------------------------------------------------- |
| Frontend       | Calls the API over HTTP; generates its types from `/api/openapi.json` |
| Developer      | Writes the specification (Gherkin scenarios), reviews, merges         |
| AI agent       | Writes code and tests within the rules of `AGENTS.md`                 |
| PostgreSQL     | Database, started with Docker Compose                                 |
| GitHub Actions | Runs the gates, opens release pull requests, publishes these docs     |
| OpenRouter     | Optional second model for AI review of pull requests                  |
