# 10. Quality requirements

The quality goals from [section 1](./01-introduction-goals.md), made measurable as scenarios. The
generic checks are the [quality gates](../quality-gates.md); this page adds what a gate cannot
express, and is the place for the requirements of each project.

## Scenarios for this template

| Goal          | Scenario                                                   | Measure                                                       |
| ------------- | ---------------------------------------------------------- | ------------------------------------------------------------- |
| Correctness   | A change breaks behavior that a Gherkin scenario describes | CI fails before the merge                                     |
| Correctness   | A test passes without checking anything                    | Mutation score drops below 80%, CI fails                      |
| Correctness   | A complex function has no tests                            | CRAP score above 30, `validate` fails                         |
| Fast feedback | A developer runs the fast gates before a commit            | `npm run validate` takes well under a minute                  |
| Fast feedback | A pull request is opened                                   | All CI checks report within a few minutes                     |
| Adaptability  | A project removes the AI setup                             | Every gate still passes (checked when the steps were written) |
| Adaptability  | A project replaces or drops one tool                       | One config file and its scripts change, nothing else          |

## Adding requirements for your project

Write each requirement as a scenario with a measure, so it can be checked:

```text
<quality goal>: when <situation>, then <expected result>, measured by <number or check>.
```

Examples of what projects often add:

- **Performance:** "The graph of 2000 characters renders in under 1 s on a mid-range laptop."
- **Security:** "No dependency with a known high or critical vulnerability is merged"
  (`npm audit` in CI).
- **Accessibility:** "Every page passes an automated accessibility check" (for example axe in the
  Playwright scenarios).
- **Reliability:** "A failed database connection gives a clear error, and the app does not start."

Turn a requirement into a gate where you can: a test, a CI step, an ESLint rule or an Archgate
rule. Keep the rest here, so a reviewer can check it by hand.
