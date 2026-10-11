#!/usr/bin/env bash
# Claude Code Stop hook: Claude cannot finish while the quality gates fail.
# Exit 2 sends stderr back to Claude, so it keeps working on the failure.
set -uo pipefail

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

input=$(cat)
session=$(jq -r '.session_id // "default"' <<<"$input")
state_dir="${TMPDIR:-/tmp}/claude-gates-$(pwd | cksum | cut -d' ' -f1)"
mkdir -p "$state_dir"
green="$state_dir/green"
blocks="$state_dir/blocks-$session"
max_blocks=3

# Skip when no file changed since the last green run (for example, Claude only answered a question).
if [[ -f $green ]]; then
  changed=$(find . \( -path ./node_modules -o -path ./.git -o -path ./coverage -o -path ./reports \
    -o -path ./dist -o -path ./.stryker-tmp -o -path ./.vitepress/cache -o -path ./test-results \
    -o -path ./playwright-report -o -path ./.features-gen \) -prune \
    -o -type f -newer "$green" -print -quit)
  [[ -z $changed ]] && exit 0
fi

if output=$( (npm run --silent validate && npm run --silent format:check) 2>&1); then
  touch "$green"
  rm -f "$blocks"
  exit 0
fi

count=$(($(cat "$blocks" 2>/dev/null || echo 0) + 1))
echo "$count" >"$blocks"

# Do not loop forever: after max_blocks attempts, let Claude stop and report the failure.
if ((count > max_blocks)); then
  rm -f "$blocks"
  echo "Quality gates still fail after $max_blocks attempts. Report this to the user." >&2
  exit 0
fi

{
  echo "Quality gates failed (attempt $count of $max_blocks). The task is not done."
  echo "Fix the cause. Do not weaken tests, configs or thresholds (see AGENTS.md)."
  echo "Last lines of 'npm run validate && npm run format:check':"
  echo
  tail -n 60 <<<"$output"
} >&2
exit 2
