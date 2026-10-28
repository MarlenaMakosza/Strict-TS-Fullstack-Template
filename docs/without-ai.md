# Use without AI

The AI agent setup is optional. The quality gates, git hooks and CI work the same when people
write the code, and none of them calls an AI model.

## Keep the files and ignore them

The AI files do nothing on their own:

- `AGENTS.md`, `CLAUDE.md`, `.agents/` and `.claude/` are read only by an AI coding tool.
- The AI review workflow (`.github/workflows/ai-review.yml`) runs only on a pull request with the
  `ai-review` label, and it needs an `OPENROUTER_API_KEY` secret.

So you can keep them and never use them.

## Remove the AI setup

Delete these files and folders. Every gate still passes without them:

```sh
rm -rf AGENTS.md CLAUDE.md .agents .claude docs/ai-workflow.md docs/pl/ai-workflow.md \
  docs/without-ai.md docs/pl/without-ai.md docs/edge-cases .github/workflows/ai-review.yml
```

Then remove the references that are left:

- `README.md`, `docs/index.md` and `docs/pl/index.md`: the "AI is optional" note at the top, the
  "Working with AI agents" section, the AI agent line in "What you get", and the "AI workflow" and
  "Use without AI" links in "Documentation".
- `.vitepress/config.ts`: the "AI agents" group and the "Use without AI" entry in both sidebars.
- `docs/getting-started.md` and `docs/pl/getting-started.md`: the "Optional: codebase-memory-mcp
  for AI agents" section, the "No AI agents" line, the link to the AI statistics, the
  `.agents/` and `.claude/` lines in the project structure, and the mentions of `AGENTS.md` and
  the roles in "Starting your own project".
- `docs/quality-gates.md` and `docs/pl/quality-gates.md`: the last paragraph, about the Claude
  Code Stop hook.
- `docs/code-review.md` and `docs/pl/code-review.md`: the lines about the `reviewer` agent and the
  optional AI review.
- `docs/tools.md` and `docs/pl/tools.md`: the AI review part of the GitHub Actions row.
- `.github/CODEOWNERS`: the lines for `AGENTS.md`, `CLAUDE.md`, `.claude/` and `.agents/`.
- `.github/PULL_REQUEST_TEMPLATE.md`: the "AI assistance" section.
- `.github/ISSUE_TEMPLATE/feature.yml` and `task.yml`: the mentions of the specifier agent and the
  agent roles.
- `.gitignore`: the `.claude/settings.local.json` line.

The arc42 pages in `docs/architecture/` and the ADRs still mention AI agents. They describe this
template, so rewrite them for your own project anyway.

Finally, run `npm run autofix` to fix the formatting, then `npm run validate:full` to check that
every gate still passes.
