# Edge cases: Greeting

Scenarios: `tests/e2e/features/http-api.feature`. Code: `src/env.ts`, `src/greet.ts`, `src/index.ts`.

| #   | Likelihood | Case                                                              | Expected behavior                             | Test level                      |
| --- | ---------- | ----------------------------------------------------------------- | --------------------------------------------- | ------------------------------- |
| 1   | common     | `NODE_ENV` is not set                                             | Defaults to `development`                     | unit                            |
| 2   | common     | `DATABASE_URL` is not set                                         | Start fails and names `DATABASE_URL`          | unit                            |
| 3   | uncommon   | `NODE_ENV` is an unknown value, for example `staging`             | Start fails and names `NODE_ENV`              | gherkin                         |
| 4   | uncommon   | `NODE_ENV` and `DATABASE_URL` are both invalid                    | Start fails and names both keys               | unit                            |
| 5   | uncommon   | `NODE_ENV` in another letter case, for example `Production`       | Question 1                                    | unit                            |
| 6   | rare       | `NODE_ENV` with spaces around it, for example `" test "`          | Question 1                                    | unit                            |
| 7   | rare       | `NODE_ENV` is an empty string                                     | Question 2                                    | unit                            |
| 8   | rare       | `DATABASE_URL` is a valid URL with a scheme other than `postgres` | Question 3                                    | unit                            |
| 9   | extreme    | `.env` and the process environment set different values           | The process environment wins (dotenv default) | none: dotenv behavior, not ours |

## Questions for the human

1. Should `NODE_ENV` accept other letter cases or surrounding spaces, or fail as it does now?
2. Should an empty `NODE_ENV` fall back to `development`, like a missing one, or fail as it does
   now?
3. Should `DATABASE_URL` accept only `postgres://` and `postgresql://` URLs?
