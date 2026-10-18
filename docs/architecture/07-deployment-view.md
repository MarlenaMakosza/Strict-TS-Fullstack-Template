# 7. Deployment view

The template itself is not deployed as a service. This page lists where it runs, so a project
created from it knows what to replace with its own deployment.

| Environment   | Where                           | What runs there                                                                                                  |
| ------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Local         | the developer's machine         | Node.js 24, the server on `PORT` (default 3000), PostgreSQL in Docker (`apps/api/docker-compose.yml`), the gates |
| CI            | GitHub Actions, `ubuntu-latest` | `npm ci` and the gates, without a database                                                                       |
| Documentation | GitHub Pages                    | the VitePress site, built by the Docs workflow                                                                   |
| Releases      | GitHub Releases                 | a tag and the source ZIP for each version                                                                        |

Configuration comes from environment variables, validated at startup (ADR `ARCH-001`).
`apps/api/.env.example` lists them; the real `.env` is never committed.

When the project gets a real deployment, describe it here: the target (server, container,
serverless), how a release reaches it, and how its configuration and secrets are provided.
