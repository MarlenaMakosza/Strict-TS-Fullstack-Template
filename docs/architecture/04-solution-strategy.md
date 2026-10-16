# 4. Solution strategy

| Goal          | Approach                                                                                                                          |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Correctness   | Layered gates: lint and types, tests with a coverage threshold, mutation testing, CRAP, duplication, ADR rules, Gherkin scenarios |
| Fast feedback | Three levels: git hooks on every commit, `validate` before finishing, `validate:full` and CI before the merge                     |
| Specification | Behavior is described as Gherkin scenarios first; unit tests and code follow with TDD                                             |
| Architecture  | Decisions are ADRs, and Archgate rules check them in code                                                                         |
| Adaptability  | Each tool has its own config file and can be removed alone; the AI setup lives in a few files                                     |
