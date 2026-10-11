/** A position in a source file, as stored in Istanbul coverage maps. Column `null` means end of line. */
export interface Position {
  column: null | number;
  line: number;
}

/** A source range, as stored in Istanbul coverage maps. */
export interface Range {
  end: Position;
  start: Position;
}

/** One function entry of an Istanbul coverage map. */
export interface FunctionEntry {
  decl: Range;
  loc: Range;
}

/** Coverage of one file, in the Istanbul `coverage-final.json` format. */
export interface FileCoverage {
  fnMap: Record<string, FunctionEntry>;
  s: Record<string, number>;
  statementMap: Record<string, Range>;
}

const NONE = 0;
const NO_COVERAGE = 0;
const FULL_COVERAGE = 1;
// Exponents of the CRAP formula: complexity is squared, the uncovered share is cubed.
const COMPLEXITY_EXPONENT = 2;
const UNCOVERED_EXPONENT = 3;

/**
 * Computes the CRAP (Change Risk Anti-Patterns) score of one function.
 *
 * @param complexity - Cyclomatic complexity of the function.
 * @param coverage - Share of covered statements, from 0 to 1.
 * @returns complexity² × (1 − coverage)³ + complexity.
 */
export function crapScore(complexity: number, coverage: number): number {
  return (
    complexity ** COMPLEXITY_EXPONENT * (FULL_COVERAGE - coverage) ** UNCOVERED_EXPONENT +
    complexity
  );
}

function columnOf(position: Position): number {
  return position.column ?? Infinity;
}

function isAtOrBefore(first: Position, second: Position): boolean {
  return (
    first.line < second.line || (first.line === second.line && columnOf(first) <= columnOf(second))
  );
}

function isInside(range: Range, position: Position): boolean {
  return isAtOrBefore(range.start, position) && isAtOrBefore(position, range.end);
}

function lineSpan(entry: FunctionEntry): number {
  return entry.loc.end.line - entry.loc.start.line;
}

/**
 * Finds the share of covered statements in a function.
 *
 * @param file - Coverage of the file that holds the function.
 * @param line - Line where the function is declared.
 * @returns Coverage from 0 to 1. A function without statements counts as covered. A function
 *   missing from the coverage map counts as not covered.
 */
export function functionCoverage(file: FileCoverage, line: number): number {
  const [entry] = Object.values(file.fnMap)
    .filter(candidate => candidate.decl.start.line === line)
    .toSorted((first, second) => lineSpan(first) - lineSpan(second));

  if (entry === undefined) {
    return NO_COVERAGE;
  }

  const statementIds = Object.entries(file.statementMap)
    .filter(([, range]) => isInside(entry.loc, range.start))
    .map(([id]) => id);

  if (statementIds.length === NONE) {
    return FULL_COVERAGE;
  }

  const hits = new Map(Object.entries(file.s));
  const covered = statementIds.filter(id => (hits.get(id) ?? NONE) > NONE);

  return covered.length / statementIds.length;
}
