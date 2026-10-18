import { describe, expect, it } from 'vitest';

import { installedVersions } from '../../dev/quality/installed-versions.ts';

describe('installedVersions', () => {
  it('finds a package at the top and deep in the tree', () => {
    expect.assertions(1);

    const tree = {
      dependencies: {
        react: { version: '19.3.1' },
        vitepress: {
          dependencies: { docsearch: { dependencies: { react: { version: '18.3.1' } } } },
          version: '1.6.4',
        },
      },
    };

    expect(installedVersions(tree, ['react'])).toStrictEqual(
      new Map([['react', ['18.3.1', '19.3.1']]]),
    );
  });

  it('counts a version once when it appears in many places', () => {
    expect.assertions(1);

    const tree = {
      dependencies: {
        react: { version: '19.3.1' },
        'react-dom': { dependencies: { react: { version: '19.3.1' } }, version: '19.3.1' },
      },
    };

    expect(installedVersions(tree, ['react', 'react-dom'])).toStrictEqual(
      new Map([
        ['react', ['19.3.1']],
        ['react-dom', ['19.3.1']],
      ]),
    );
  });

  it('reports a package that is not installed with no versions', () => {
    expect.assertions(1);

    expect(installedVersions({}, ['react'])).toStrictEqual(new Map([['react', []]]));
  });

  it('ignores packages it was not asked about', () => {
    expect.assertions(1);

    const tree = { dependencies: { preact: { version: '10.0.0' } } };

    expect(installedVersions(tree, ['react'])).toStrictEqual(new Map([['react', []]]));
  });
});
