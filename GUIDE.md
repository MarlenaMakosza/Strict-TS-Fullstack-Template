# Guide: working with AI agents

English | [Polski](GUIDE-pl.md)

How to add a feature to the project when AI agents write the code and you own the specification.
The detailed rules for the agents are in [`AGENTS.md`](AGENTS.md), and the project description is
in [`README.md`](README.md).

## Cheat sheet: the agents in order

| #   | Agent              | What it does                                | What you check                                    |
| --- | ------------------ | ------------------------------------------- | ------------------------------------------------- |
| 1   | `specifier`        | Requirement → Gherkin scenario (`.feature`) | Answer its questions, approve the `.feature` file |
| 2   | `edge-case-hunter` | List of edge cases                          | Answer the "Questions for the human"              |
| 3   | `architect`        | ADR and Archgate rule (only when needed)    | Accept or reject the ADR                          |
| 4   | `implementer`      | Tests and code, until the gates pass        | Report: changed assertions, edge cases            |
| 5   | `reviewer`         | Compares the tests with the scenario        | List of mismatches                                |
| 6   | `documenter`       | Documentation, README, TSDoc                | Changed pages in `docs/` and the README           |

Example prompts for Claude Code:

```text
1. Use the specifier agent. Requirement: <what the app should do>.
2. Use the edge-case-hunter agent for cypress/e2e/<name>.feature.
3. Use the architect agent. Does <change> need an architecture decision? If it does, propose an ADR with a rule.
4. Use the implementer agent for cypress/e2e/<name>.feature and docs/edge-cases/<name>.md.
5. Use the reviewer agent for the changes from <name>.
6. Use the documenter agent for the changes from <name>.
```

In other tools (Codex, Cursor, Copilot…), instead of "Use the X agent", write: "Read `AGENTS.md`
and `.agents/roles/X.md`, then…".

At the end:

```sh
npm run validate:full
```

## The idea in one sentence

**You say what the program must do. An agent writes the code. Automation checks that the code is
good.**

You do not need to read the agent's code. A set of automated tests and metrics, the gates, checks
it for you. Code that does not pass every gate does not get into the project.

## Who does what

| Who        | What they do                                   | Where                                      |
| ---------- | ---------------------------------------------- | ------------------------------------------ |
| You        | Describe the behavior and answer questions     | `cypress/e2e/*.feature`, agent reports     |
| Agents     | Write scenarios, tests, code and documentation | `cypress/`, `tests/unit/`, `src/`, `docs/` |
| Automation | Checks everything with the gates               | `npm run validate:full`, CI                |

You read only:

- the `.feature` scenarios,
- the questions from the edge-case hunter,
- the implementer's report, especially the changed assertions in existing tests,
- the reviewer's report.

You do not read the code in `src/` or the tests. The gates and the reviewer do that for you. At the
start, you can still look at the diff until you trust the gates.

## The whole flow, step by step

Example: the app should greet a user by a name given as an argument.

### Step 0: prepare

```sh
cd <project directory>
nvm use
git switch main && git pull
git switch -c feat/<name>
```

A separate branch makes it easy to throw everything away if the experiment fails.

### Step 1: specifier, the scenario

```text
Use the specifier agent. Requirement: when I start the app with a name as an argument
(node src/index.ts Ada), it greets by name: "Hello, Ada!". Without an argument it works as before.
```

- Answer the agent's questions, for example whether to show the environment with a name, or what
  to do with several arguments.
- Claude asks for approval before it writes the `.feature` file. Read the scenario and approve it.
- You can also write the `.feature` file yourself. It must start with a `Feature:` line, for
  example:

```gherkin
Feature: Greeting by name

  Scenario: Greet by name
    When I start the app with name "Ada"
    Then the app prints "Hello, Ada!"
```

Use `cypress/e2e/greeting.feature` as the style reference.

### Step 2: edge-case hunter, the edge cases

```text
Use the edge-case-hunter agent for cypress/e2e/<name>.feature.
```

The agent writes the list to `docs/edge-cases/<name>.md`, from common to extreme cases: empty text,
whitespace only, emoji, a very long name… See `docs/edge-cases/greeting.md` for an example.

- **Answer the "Questions for the human" section.** This is the most important part. Each answer
  fills a gap in the specification.
- For cases that the user can see, you can ask the specifier to add them to the `.feature` file.
- Claude asks for approval before each change in `docs/edge-cases/`.

### Step 3: architect (only when needed)

You need it when the task requires a decision that is hard to reverse: a new dependency, a new
layer, a way to store data, a convention for errors or for an API. A command-line argument is not
such a decision, but you can check that the agent agrees:

```text
Use the architect agent. Does this change need an ADR? Only assess it.
```

When an ADR is needed, the architect creates it with Archgate in `.archgate/adrs/` and, when
possible, adds a rule that checks the decision automatically. See `ARCH-001` for an example. You
approve every change to the ADRs.

### Step 4: implementer, the code

```text
Use the implementer agent for cypress/e2e/<name>.feature and docs/edge-cases/<name>.md.
```

You do nothing now. The agent:

1. checks the ADRs for the files it changes (`npx archgate review-context`),
2. writes a unit test that fails,
3. writes code until the test passes, then cleans it up,
4. writes tests for the edge cases from the list,
5. writes the step definitions, which connect the `.feature` sentences to the code.

The Stop hook does not let Claude finish until `npm run validate` passes.

When it finishes, read its report:

- **Commands**: which gates it ran, and their results.
- **Changed existing tests**: whether it changed old assertions, and why. An agent could "fix" a
  test to match its own wrong code, so it must report every such change. For the greeting by name,
  expect changes where `src/index.ts` builds the message.
- **Edge cases**: what it tested, what it skipped, and why.
- **Open questions**: what was unclear in the specification.

### Step 5: reviewer, the check

```text
Use the reviewer agent for the changes from <name>.
```

It checks that the tests really test what the scenario says, not only what the code happens to
do. It also checks that every edge case has a test. Read its list of mismatches.

### Step 6: documenter

```text
Use the documenter agent for the changes from <name>.
```

It updates the README, the pages in `docs/`, the ADR index and the TSDoc comments. It makes sure the
VitePress site builds without dead links.

### Step 7: check and merge

```sh
npm run validate:full
git log main..
git push -u origin feat/<name>
```

Open a pull request on GitHub and wait for green CI. You do the merge.

## What the gates check

`npm run validate:full` checks, in order:

- that the code is well written: lint, types, spelling,
- that there is no unused code (knip),
- that the tests pass and cover at least 90% of the code,
- that no function is both complex and poorly tested (CRAP, limit 30),
- that there is no copied code (jscpd),
- that the code follows the ADRs (Archgate),
- that the tests really catch bugs: mutation testing breaks the code on purpose, and the tests must
  notice (limit 80%),
- that the Gherkin scenarios pass,
- that the documentation builds.

Also:

- on commit, a git hook checks the formatting and the message format (Conventional Commits),
- on GitHub, CI runs the gates again,
- a pull request with the `ai-review` label gets a comment from a different AI model (needs setup,
  see below).

## Files: what each one is for

**Rules for the agents** (work with any tool):

- `AGENTS.md`: the main rules, the definition of done, the report format, the protected files.
- `CLAUDE.md`: only points to `AGENTS.md`.
- `.agents/roles/`: the six roles from this guide.

**Gates:**

- `vitest.config.ts`: the 90% coverage threshold.
- `stryker.config.json`: the 80% mutation testing threshold.
- `dev/quality/crap.ts`: computes CRAP.
- `.jscpd.json`: copied code detection.
- `.archgate/adrs/`: architecture decisions and their rules.

**Examples to follow:**

- `cypress/e2e/greeting.feature`: a Gherkin scenario.
- `cypress/support/step-definitions/app.steps.ts`: step definitions.
- `docs/edge-cases/greeting.md`: an edge case list.
- `.archgate/adrs/ARCH-001-*.md` and `.rules.ts`: an ADR with a rule.

**Claude Code only** (optional, everything else works without it):

- `.claude/settings.json`: what Claude may do without asking, what it must ask about (changes to
  `.feature` files, edge cases and ADRs), and what it may not do at all (gate configuration).
- `.claude/hooks/stop-validate.sh`: does not let Claude finish with red gates.
- `.claude/agents/`: the roles as Claude Code agents.

**GitHub:**

- `.github/workflows/ci.yml`: the gates on every push and pull request.
- `.github/workflows/ai-review.yml`: an optional review by a different model.
- `.github/CODEOWNERS`: changes to important files need approval from a code owner.

## One-time setup

1. Node 24: run `nvm use` in the project directory. With an older Node, `npm install` refuses to
   install.
2. GitHub, Settings → Branches → `main`:
   - require CI to pass,
   - "Require review from Code Owners" makes sense only when agents push from a different account
     than yours.
3. AI review (optional): add the `OPENROUTER_API_KEY` secret and the `AI_REVIEW_MODEL` variable.
   Without them the workflow does not run and costs nothing.
4. GitLab: the repository is mirrored there, but CI does not run on GitLab, because GitLab does not
   read `.github/workflows/`. Push to it separately: `git push gitlab main`.

## How to start

The simplest start: one small feature, a scenario in a `.feature` file, and a prompt for the
implementer. Then read its report. Add the other roles once this basic cycle feels natural.
