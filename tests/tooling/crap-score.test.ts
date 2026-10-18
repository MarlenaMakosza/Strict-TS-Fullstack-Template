import { describe, expect, it } from 'vitest';

import { crapScore, type FileCoverage, functionCoverage } from '../../dev/quality/crap-score.ts';

// Function on lines 1–5 with two statements; a nested function on line 3 with one statement.
const file: FileCoverage = {
  fnMap: {
    '0': {
      decl: { end: { column: 20, line: 1 }, start: { column: 16, line: 1 } },
      loc: { end: { column: null, line: 5 }, start: { column: 30, line: 1 } },
    },
    '1': {
      decl: { end: { column: 10, line: 3 }, start: { column: 4, line: 3 } },
      loc: { end: { column: 30, line: 3 }, start: { column: 12, line: 3 } },
    },
  },
  s: { '0': 4, '1': 0, '2': 0 },
  statementMap: {
    '0': { end: { column: null, line: 2 }, start: { column: 2, line: 2 } },
    '1': { end: { column: 28, line: 3 }, start: { column: 14, line: 3 } },
    '2': { end: { column: null, line: 9 }, start: { column: 2, line: 9 } },
  },
};

describe('crapScore', () => {
  it('equals the complexity when fully covered', () => {
    expect.assertions(1);
    expect(crapScore(5, 1)).toBe(5);
  });

  it('grows with the square of complexity when not covered', () => {
    expect.assertions(1);
    expect(crapScore(5, 0)).toBe(30);
  });

  it('weights the uncovered share cubed', () => {
    expect.assertions(1);
    expect(crapScore(4, 0.5)).toBe(6);
  });
});

describe('functionCoverage', () => {
  it('counts statements inside the function, nested ones included', () => {
    expect.assertions(1);
    expect(functionCoverage(file, 1)).toBe(0.5);
  });

  it('measures a nested function on its own', () => {
    expect.assertions(1);
    expect(functionCoverage(file, 3)).toBe(0);
  });

  it('treats a function missing from the map as not covered', () => {
    expect.assertions(1);
    expect(functionCoverage(file, 7)).toBe(0);
  });

  it('treats a function without statements as covered', () => {
    expect.assertions(1);
    expect(functionCoverage({ ...file, statementMap: {} }, 1)).toBe(1);
  });
});
