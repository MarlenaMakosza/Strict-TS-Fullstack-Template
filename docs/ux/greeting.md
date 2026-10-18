# UX: Greeting page

The example page of the template. Scenarios: `tests/e2e/features/greeting-page.feature`. Code:
`apps/web/src/App.tsx`.

## The user and the goal

A visitor who opens the app for the first time. They want to see that the app works: they type
their name and get a greeting from the server.

## The flow

1. The page shows the heading "Greeting", a field labeled "Your name" and a "Greet" button.
2. The user types a name, or leaves the field empty.
3. The user presses "Greet", or Enter in the field.
4. The app asks the server and shows the greeting below the form.

## States

| State                            | What the user sees                                                            |
| -------------------------------- | ----------------------------------------------------------------------------- |
| Empty, before the first greeting | The form, nothing below it                                                    |
| Waiting for the server           | The button says "Greeting…" and cannot be pressed again                       |
| Success                          | The greeting, for example "Hello, Ada!", or "Hello!" for an empty name        |
| The server cannot be reached     | "The server cannot be reached. Try again in a moment." The button works again |
| The server answers with an error | "Something went wrong on the server. Try again later." The button works again |

## Texts

| Place       | Text                            |
| ----------- | ------------------------------- |
| Heading     | Greeting                        |
| Field label | Your name                       |
| Button      | Greet; while waiting: Greeting… |
| Errors      | See the states above            |

## Accessibility

- Everything works with the keyboard: Tab to the field, type, Tab to the button, Enter.
- The field has a visible label, connected to it.
- The greeting is announced (`role="status"`), errors too (`role="alert"`).
- The page passes WCAG 2.1 AA (the axe scenario checks it).

## Narrow screens

The form stays one column wide; the field and the button share one row and the field shrinks.
