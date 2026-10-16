# 11. Risks and technical debt

| Risk                                                       | Effect                                                  | What to do                                                    |
| ---------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------- |
| `@stryker-mutator/vitest-runner` does not support Vitest 5 | Stryker uses the slower command runner                  | Switch back once stryker-js #6210 is fixed                    |
| Free AI models on OpenRouter come and go                   | The optional AI review fails until the model is changed | Change `AI_REVIEW_MODEL`                                      |
| No CI on the release pull request                          | Required checks would block its merge                   | Bypass in the ruleset, or a personal token for release-please |
| `BREAKING CHANGE:` in a pull request description           | The squash merge bumps the major version                | Write it only for real breaking changes                       |
| Agents work from the maintainer's account                  | "Require review from Code Owners" cannot work           | Give agents their own account if reviews are required         |
