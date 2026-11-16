# Behavior and unit tests

The project has two kinds of Vitest tests. For Vitest they are the same: the same `describe`, `it`
and `expect`, the same runner and config. They differ in what a test imports and what it checks.
The folder tells people and agents which kind a test is.

## The difference

|                                  | Behavior test                                                        | Unit test                                                         |
| -------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Imports                          | only the entry point of the app: `createApp` or `<App>`              | one module: `greet`, `fetchGreeting`                              |
| Calls                            | HTTP `app.request('/api/greeting?name=Ada')`, or a click on a button | the function directly: `greet(' Ada ')`                           |
| Checks                           | the status, the JSON, the text on the screen                         | the result of the function, and what it did with its dependencies |
| After a refactor inside the code | still passes                                                         | may need a change                                                 |
| Folder                           | `tests/behavior/`                                                    | `tests/unit/`                                                     |

## Why both

- **Behavior tests** check what the user or the API client gets. They follow the Gherkin
  scenarios, so they prove the specification, and they survive a refactor because they know
  nothing of the code inside. Every change starts with one (outside-in TDD).
- **Unit tests** check the inside of one module: every branch, every edge case, and what it does
  with its dependencies (a fake `fetch`, a fake logger). They reach cases that are hard to set up
  from outside, and they point at the exact module that broke.

Both count for the 90% coverage and for mutation testing. A Gherkin scenario counts for neither,
so it never replaces them.

## The same rule from both sides

The greeting trims the spaces around the name:

```ts
// tests/behavior/server/app.test.ts: from outside, through HTTP
const response = await appWithLogger().app.request('/api/greeting?name=%20Ada%20');
await expect(response.json()).resolves.toStrictEqual({ message: 'Hello, Ada!' });

// tests/unit/greet.test.ts: from inside, one function
expect(greet('  Ada ')).toBe('Hello, Ada!');
```

## Examples in the code

- Behavior: `apps/api/tests/behavior/server/app.test.ts`, `apps/web/tests/behavior/App.test.tsx`.
- Unit: `apps/api/tests/unit/greet.test.ts`, `apps/web/tests/unit/api/greeting.test.ts`.
- Property-based (a kind of unit test): "for any name" in `apps/api/tests/unit/greet.test.ts`.

The rules for agents are in the "Test levels" section of `AGENTS.md`.
