/**
 * Fails when one of the given packages is installed in more than one version. Two copies of React
 * break rendering and hooks in a way that is hard to trace, so `validate` checks it (see
 * docs/todo.md for why the root pins React).
 *
 * Usage: npm run quality:one-react (node dev/quality/one-version.ts react react-dom)
 */
import { execFileSync } from 'node:child_process';
import { z } from 'zod';

import { type DependencyNode, installedVersions } from './installed-versions.ts';

const NodeSchema: z.ZodType<DependencyNode> = z.lazy(() => {
  return z.object({
    dependencies: z.record(z.string(), NodeSchema).optional(),
    version: z.string().optional(),
  });
});

// npm sets npm_execpath for its scripts; calling it through node avoids a lookup in PATH.
const npmCli = process.env.npm_execpath;

if (npmCli === undefined) {
  throw new Error('Run this through npm: npm run quality:one-react');
}

const FIRST_ARGUMENT = 2;
const ONE = 1;
const names = process.argv.slice(FIRST_ARGUMENT);

// npm ls exits with an error when a peer range is not met, but still prints the whole tree.
function listTree(cli: string): string {
  try {
    return execFileSync(process.execPath, [cli, 'ls', ...names, '--all', '--json'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch (error) {
    const output = z.object({ stdout: z.string() }).safeParse(error);

    if (!output.success) {
      throw error;
    }

    return output.data.stdout;
  }
}

const tree = NodeSchema.parse(JSON.parse(listTree(npmCli)));
const versions = installedVersions(tree, names);
const duplicated = [...versions].filter(([, found]) => found.length > ONE);
const duplicatedNames = duplicated.map(([name]) => name).join(', ');

for (const [name, found] of versions) {
  console.log(`${name}: ${found.join(', ') || 'not installed'}`);
}

if (duplicatedNames !== '') {
  console.error(
    `More than one version of ${duplicatedNames} is installed. Pin one version at the root (see docs/todo.md).`,
  );
  process.exitCode = ONE;
}
