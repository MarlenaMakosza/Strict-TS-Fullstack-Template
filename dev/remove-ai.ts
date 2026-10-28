/**
 * Removes the AI setup from the project: deletes the AI-only files and folders, and cuts the
 * AI-only parts marked with `ai:start` and `ai:end` (or `ai:to-end`) out of every other file. Then
 * the project has no AI rules, roles, adapters, review workflow or docs about them.
 *
 * Usage: node dev/remove-ai.ts [--dry-run]
 *
 * Commit your changes first: then `git diff` shows every change, and `git checkout .` undoes it.
 * `--dry-run` lists the changes without making them.
 */
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { stripAiBlocks } from './ai-markers.ts';

/** AI-only files and folders. The files that explain or contain the markers must be here too. */
const AI_PATHS = [
  'AGENTS.md',
  'CLAUDE.md',
  '.agents',
  '.claude',
  '.github/workflows/ai-review.yml',
  'docs/ai-workflow.md',
  'docs/pl/ai-workflow.md',
  'docs/without-ai.md',
  'docs/pl/without-ai.md',
  'docs/edge-cases',
  'dev/ai-markers.ts',
  'dev/remove-ai.ts',
  'tests/tooling/ai-markers.test.ts',
];

/** Folders that are not source: dependencies, Git, and the generated output in .gitignore. */
const SKIPPED_FOLDERS = new Set([
  '.features-gen',
  '.git',
  '.history',
  '.idea',
  '.stryker-tmp',
  '.vitepress/cache',
  '.vitepress/dist',
  '.vscode',
  'coverage',
  'dist',
  'docs/api',
  'node_modules',
  'playwright-report',
  'reports',
  'test-results',
]);

const FIRST_ARGUMENT = 2;
const NONE = 0;
const ONE = 1;
const isDryRun = process.argv.slice(FIRST_ARGUMENT).includes('--dry-run');

function isAiPath(file: string): boolean {
  return AI_PATHS.some(aiPath => file === aiPath || file.startsWith(`${aiPath}/`));
}

function isSkipped(file: string): boolean {
  return SKIPPED_FOLDERS.has(file) || SKIPPED_FOLDERS.has(path.basename(file));
}

function sourceFiles(folder: string): string[] {
  const files: string[] = [];
  const entries = readdirSync(folder || '.', { withFileTypes: true });

  for (const entry of entries) {
    const file = folder === '' ? entry.name : `${folder}/${entry.name}`;

    if (isSkipped(file) || isAiPath(file)) {
      continue;
    }

    if (entry.isDirectory()) {
      files.push(...sourceFiles(file));
    } else {
      files.push(file);
    }
  }

  return files;
}

function strip(file: string): { blocks: number; file: string; text: string } {
  try {
    return { file, ...stripAiBlocks(readFileSync(file, 'utf8')) };
  } catch (error) {
    throw new Error(`${file} has broken AI markers`, { cause: error });
  }
}

// Check every file before changing any: a broken marker stops the run with nothing changed.
const edits = sourceFiles('')
  .map(file => strip(file))
  .filter(edit => edit.blocks > NONE);

for (const aiPath of AI_PATHS) {
  if (!existsSync(aiPath)) {
    continue;
  }

  console.log(`delete ${aiPath}`);

  if (!isDryRun) {
    rmSync(aiPath, { force: true, recursive: true });
  }
}

for (const edit of edits) {
  console.log(`edit   ${edit.file} (${edit.blocks} AI part${edit.blocks === ONE ? '' : 's'})`);

  if (!isDryRun) {
    writeFileSync(edit.file, edit.text);
  }
}

console.log(
  isDryRun
    ? 'Dry run: nothing changed.'
    : 'Done. Next: npm run autofix, then npm run validate:full, then review git diff.',
);
