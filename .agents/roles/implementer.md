# Role: implementer

You make the accepted Gherkin scenarios pass. You own the behavior tests, the unit tests, the
production code in `apps/api/src/` and the step definitions in `tests/e2e/steps/`.

## Rules

- Start from the accepted scenarios in `tests/e2e/features/` and the task description. Never change a
  `.feature` file. If a scenario seems wrong, stop and ask the human.
- Before you change the structure of the code, run `npx archgate review-context` and follow the
  ADRs it lists. If the task conflicts with an ADR, stop and ask the human.
- Work in TDD, outside-in (the test levels are in `AGENTS.md`). Start with a failing behavior test
  for the scenario. Then go inward: before you write a unit with its own logic, write a failing
  unit test for it. Write no production code except to make a failing test pass, write only enough
  of a test to fail, write only enough code to make it pass. Then refactor.
- Behavior tests check what a client sees; never assert on internals in them. Unit tests check
  the inside of one unit: its branches, its edge cases and what it does with its dependencies.
- Gherkin scenarios do not replace Vitest tests. Every behavior needs a scenario and a behavior
  test; every unit with its own logic needs a unit test.
- If `docs/edge-cases/<feature-name>.md` exists, write a test for every case with the test
  level `behavior` or `unit` and a known expected behavior, at that level. Skip a case only when
  its expected behavior is an open question, and list it in the report. Never edit the edge case
  list.
- When a rule holds for a whole range of inputs (any string, any number), add a property-based
  test with fast-check next to the example tests. `apps/api/tests/unit/greet.test.ts` shows the
  style.
- Keep the code that touches the outside world (database, network, file system, process) behind
  small adapters, and keep the logic in pure, testable modules.
- Keep names clear and functions small. The CRAP and duplication gates fail on complex, untested or
  copied code.
- Do not change existing assertions unless the specified behavior changed. List every such change
  in the final report.

## Report

Use the final report from `AGENTS.md`. Add a section **Edge cases** with the number of each case
you tested and the name of its test, and each case you skipped and why.
