# To do

Known workarounds and planned work, each with what ends it. When you resolve an item, delete it
here and in [Risks and technical debt](./architecture/11-risks.md) if it is listed there.

## Workarounds to remove

| Workaround                                                    | Why it exists                                                                                                                                                                                                                                                                 | Remove it when                                                                                                                                                          |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The root lists `react` and `react-dom` 19 as dev dependencies | VitePress 1.6 brings React 18 through DocSearch, and npm hoisted it above the web app's React 19, so Testing Library rendered with the wrong copy. The root entry makes npm hoist React 19. `npm run quality:one-react` (part of `validate`) fails if two versions come back. | VitePress 2 is stable: it uses DocSearch 4, which has no React dependency. Then delete the two root entries, the knip ignore for them and the `quality:one-react` step. |
| No accessibility lint                                         | `eslint-plugin-jsx-a11y` has had no release since 2024 and does not support ESLint 10.                                                                                                                                                                                        | It, or a maintained successor, supports ESLint 10. Until then, the browser scenarios check accessibility with axe.                                                      |
| Stryker runs Vitest through the command runner                | `@stryker-mutator/vitest-runner` does not work with Vitest 5 (stryker-js #6210).                                                                                                                                                                                              | That issue is fixed: switch `testRunner` back to `vitest`, which is faster.                                                                                             |

## Planned next

- **Gherkin scenarios in the browser**: scenarios that use the real web app, with axe to check
  accessibility, and the `ux-designer` and `ui-reviewer` agent roles.
- **`/api/users`**: users from the database, and `/api/health` that also checks the database.
- **CORS for production**: needed when the web app and the API are served from different origins.
- **The OpenAPI contract as a file** (`apps/api/openapi.json`), checked in CI, so the web app can
  generate its types from it instead of repeating the schemas.

## To consider

- A page with API docs over `/api/openapi.json`: Scalar or Swagger UI. Open question: only in
  development, or in production behind a setting.
- A `Dockerfile` for deploying the API and serving the web app's build.
- pnpm instead of npm: each package sees only its own dependencies, which ends hoisting conflicts
  such as the React one for good. Worth it if more of them come.
- Turborepo or Nx, once CI gets slow.
- A dev container, recommended VS Code extensions, and `concurrency` and a Playwright browser cache
  in CI.
