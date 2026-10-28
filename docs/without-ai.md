# Use without AI

Remove the whole AI setup with one command:

```sh
node dev/remove-ai.ts --dry-run   # list what it would remove, change nothing
node dev/remove-ai.ts             # remove it
npm run autofix
npm run validate:full
```

Commit your work first. Then `git diff` shows every change the script made, and `git checkout .`
undoes them all. CI runs the script on every pull request and checks that the gates still pass
afterwards, so it stays up to date.

## What the script removes

**Files and folders:**

- `AGENTS.md`, `CLAUDE.md`, `.agents/` and `.claude/`: the rules, the roles and the Claude Code
  adapter.
- `.github/workflows/ai-review.yml`: the optional AI review of pull requests.
- `docs/ai-workflow.md`, `docs/pl/ai-workflow.md`, this page and its Polish version.
- `docs/edge-cases/`: the edge case lists that the edge-case hunter role writes.
- `dev/remove-ai.ts`, `dev/ai-markers.ts` and their test: the script itself.

**Parts of other files**, marked in them with `ai:start` and `ai:end` comments:

- `README.md`, `docs/index.md` and `docs/pl/index.md`: the "AI is optional" note, the paragraph
  about AI agents, the AI line in "What you get", the "Working with AI agents" section and the AI
  links in "Documentation".
- `.vitepress/config.ts`: the "AI agents" group and this page in both sidebars.
- `docs/getting-started.md`, `docs/quality-gates.md`, `docs/code-review.md` and `docs/tools.md`,
  in English and Polish: the sections, lines and notes about agents, the Claude Code Stop hook,
  the AI review and the `Assisted-by` lines.
- `.github/workflows/ci.yml`: the job that checks this script.
- `.github/PULL_REQUEST_TEMPLATE.md`: the "AI assistance" section.
- `.github/CODEOWNERS`: the lines for the AI files.
- `.gitignore`: the line for the personal Claude Code settings.

**What stays:** every quality gate, the git hooks, CI, the Gherkin scenarios, the ADRs and the
arc42 pages. The arc42 pages and the ADRs still mention AI agents in a few places. They describe
this template, so rewrite them for your own project anyway.

## Or keep the files and ignore them

The AI files do nothing on their own:

- `AGENTS.md`, `CLAUDE.md`, `.agents/` and `.claude/` are read only by an AI coding tool.
- The AI review workflow runs only on a pull request with the `ai-review` label, and it needs an
  `OPENROUTER_API_KEY` secret.

## Adding AI-only content

When you add something that only matters with the AI setup, wrap it in markers, so that the script
removes it too. Use the comment style of the file:

```md
<!-- ai:start -->

Text about AI agents.

<!-- ai:end -->
```

In TypeScript, write `// ai:start` and `// ai:end`; in YAML, `.gitignore` and `CODEOWNERS`,
`# ai:start` and `# ai:end`. A line with `ai:to-end` removes everything from that line to the end
of the file. A whole AI-only file goes into `AI_PATHS` in `dev/remove-ai.ts` instead.
