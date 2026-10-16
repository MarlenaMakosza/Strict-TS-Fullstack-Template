# Architecture

The architecture of this template, described with [arc42](https://arc42.org/). arc42 has twelve
sections; a project writes only the ones it needs. A project created from the template replaces
these pages with its own.

## All arc42 sections

| #   | Section                  | What it answers                                                  | In this template                                                                       |
| --- | ------------------------ | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 1   | Introduction and goals   | What is it for, who uses it, which qualities matter most         | [Introduction and goals](./01-introduction-goals.md)                                   |
| 2   | Constraints              | What is fixed in advance: technology, rules, organization        | [Constraints](./02-constraints.md)                                                     |
| 3   | Context and scope        | Where the system ends, and which people and systems it talks to  | [Context and scope](./03-context-scope.md)                                             |
| 4   | Solution strategy        | The few key choices that shape everything else                   | [Solution strategy](./04-solution-strategy.md)                                         |
| 5   | Building block view      | The parts of the system and what each one is responsible for     | [Building blocks](./05-building-blocks.md)                                             |
| 6   | Runtime view             | How the parts work together in the important scenarios           | [Runtime view](./06-runtime-view.md)                                                   |
| 7   | Deployment view          | Where and how the system runs: servers, containers, environments | [Deployment view](./07-deployment-view.md)                                             |
| 8   | Crosscutting concepts    | Rules that apply everywhere: errors, logging, naming, security   | [Crosscutting concepts and conventions](./08-crosscutting-concepts-and-conventions.md) |
| 9   | Architecture decisions   | Which important decisions were made, and why                     | [Decisions](./decisions.md) (ADRs in `.archgate/adrs/`)                                |
| 10  | Quality requirements     | How the quality goals are measured                               | [Quality requirements](./10-quality-requirements.md)                                   |
| 11  | Risks and technical debt | What can go wrong, and which shortcuts were taken                | [Risks and technical debt](./11-risks.md)                                              |
| 12  | Glossary                 | The terms of the domain, with one meaning each                   | [Glossary](./12-glossary.md)                                                           |

## Which sections pay off in a personal project

For a project you build alone, or with AI agents, most of arc42 is optional. These are worth it:

- **1. Introduction and goals:** a few lines on what the project is for and what matters most.
  It keeps the scope in check, and it tells an agent what to optimize for.
- **9. Architecture decisions:** future you forgets why something is the way it is. One ADR per
  important decision is cheap, and Archgate turns it into a check.
- **11. Risks and technical debt:** the list of shortcuts you took on purpose, so they do not get
  lost.
- **12. Glossary:** one meaning per term. With AI agents it matters even more: the scenarios, the
  code and the agents then use the same words.

Add the others when they start to pay off:

- **2. Constraints** and **4. Solution strategy:** a short table each, once the stack is settled.
- **5. Building block view:** once the code has more than a handful of modules.
- **8. Crosscutting concepts:** your coding conventions; the template already has them.
- **10. Quality requirements:** once the project has a requirement that the generic gates do not
  cover, such as a performance budget.
- **3. Context and scope:** once the project talks to external systems.
- **6. Runtime view** and **7. Deployment view:** only for complex flows between parts, or a real
  deployment to servers.
