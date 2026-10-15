# Code review

Review comments follow [Conventional Comments](https://conventionalcomments.org/). A label at the
start of each comment says what kind of comment it is and whether it blocks the merge, so nobody
has to guess the tone or the priority.

## Format

```text
<label> (<decorations>): <subject>

<discussion>
```

- **label**: the kind of comment, from the table below.
- **decorations** (optional): `blocking` (must be resolved before the merge), `non-blocking` (fine
  to merge without it) or `if-minor` (resolve it only if the change is small).
- **subject**: the point of the comment, in one sentence.
- **discussion** (optional): the reasoning, an example, or a link.

## Labels

| Label        | Use it for                                                              |
| ------------ | ----------------------------------------------------------------------- |
| `praise`     | something that is done well and worth keeping                           |
| `nitpick`    | a small, personal-preference point; always non-blocking                 |
| `quibble`    | the same as a nitpick, with a friendlier name                           |
| `suggestion` | a concrete improvement; say whether it is blocking                      |
| `polish`     | nothing is wrong, but the content could be better right away            |
| `issue`      | a problem that needs a fix; pair it with a suggestion when you have one |
| `todo`       | a small, necessary change, such as a missing test                       |
| `typo`       | like a todo, when the problem is a misspelling                          |
| `question`   | something you do not understand or want to confirm                      |
| `thought`    | an idea for later, not a request for this pull request                  |
| `chore`      | a step that must happen before the merge, such as updating docs         |
| `note`       | information for the reader, with nothing to do                          |

The list is a starting point: use another label when none of these fits.

## Examples

```text
issue (blocking): tests/unit/greet.test.ts:12 asserts the old greeting

The scenario in tests/e2e/features/greeting.feature now expects "Hello, Ada!".
```

```text
suggestion (non-blocking): extract the trimming into its own function

It would make the empty-name case easier to test on its own.
```

```text
praise: the edge case list covers every boundary of the input
```

## Who uses it

- People reviewing a pull request.
- The `reviewer` agent, in its final report.
- The optional AI review in CI (see [AI workflow](./ai-workflow.md)), in its comment on the pull
  request.

## Faster on GitHub: saved replies

Save each label you use often as a saved reply: GitHub → your avatar → **Settings → Saved
replies**, for example a reply named `issue-blocking` with the text `issue (blocking): `. In any
comment box, press `Ctrl` + `.` (`Cmd` + `.` on macOS) and pick the reply.
