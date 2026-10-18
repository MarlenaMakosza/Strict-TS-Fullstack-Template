/** One node of the tree that `npm ls --all --json` prints. */
export interface DependencyNode {
  dependencies?: Record<string, DependencyNode> | undefined;
  version?: string | undefined;
}

function byVersion(left: string, right: string): number {
  return left.localeCompare(right);
}

function sortedEntry([name, versions]: [string, Set<string>]): [string, string[]] {
  return [name, [...versions].toSorted(byVersion)];
}

/**
 * Collects every installed version of the given packages, anywhere in the dependency tree.
 *
 * @param tree - The output of `npm ls <names> --all --json`.
 * @param names - The packages to look for.
 * @returns For each package, the versions found, sorted.
 */
export function installedVersions(
  tree: DependencyNode,
  names: readonly string[],
): Map<string, string[]> {
  const found = new Map(names.map(name => [name, new Set<string>()]));

  function visit(node: DependencyNode): void {
    const children = node.dependencies;

    if (children === undefined) {
      return;
    }

    for (const [name, child] of Object.entries(children)) {
      if (child.version !== undefined) {
        found.get(name)?.add(child.version);
      }

      visit(child);
    }
  }

  visit(tree);

  return new Map([...found].map(sortedEntry));
}
