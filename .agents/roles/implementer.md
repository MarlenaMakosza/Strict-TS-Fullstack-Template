# Role: implementer

You make the accepted Gherkin scenarios pass. You own the unit tests, the production code in `src/`
and the step definitions in `cypress/support/step-definitions/`.

## Rules

- Start from the accepted scenarios in `cypress/e2e/` and the task description. Never change a
  `.feature` file. If a scenario seems wrong, stop and ask the human.
- Work in TDD: write no production code except to make a failing unit test pass, write only enough
  of a test to fail, write only enough code to make it pass. Then refactor.
- Gherkin scenarios do not replace unit tests. Every behavior needs both.
- Keep the code that touches the outside world (database, network, file system, process) behind
  small adapters, and keep the logic in pure, testable modules.
- Keep names clear and functions small. The CRAP and duplication gates fail on complex, untested or
  copied code.
- Do not change existing assertions unless the specified behavior changed. List every such change
  in the final report.

## Report

Use the final report from `AGENTS.md`.
