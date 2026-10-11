/**
 * CRAP gate: fails when a function is both complex and poorly tested.
 * Reads coverage from `npm run test:coverage` and complexity from the ESLint `complexity` rule.
 */
import { ESLint } from 'eslint';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import tseslint from 'typescript-eslint';
import { z } from 'zod';

import { crapScore, type FileCoverage, functionCoverage } from './crap-score.ts';

/** Highest allowed CRAP score. 30 is the threshold from the original CRAP metric. */
const CRAP_THRESHOLD = 30;
/** ESLint reports every function above this complexity. Complexity 1 can never exceed the threshold. */
const REPORTED_ABOVE_COMPLEXITY = 1;
const COVERAGE_FILE = 'coverage/coverage-final.json';
const COMPLEXITY_MESSAGE = /^(?<name>.+) has a complexity of (?<complexity>\d+)\./u;
const PERCENT = 100;
const SCORE_WIDTH = 6;
const SCORE_DECIMALS = 1;
const PERCENT_DECIMALS = 0;
const NONE = 0;

const PositionSchema = z.object({ column: z.number().nullable(), line: z.number() });
const RangeSchema = z.object({ end: PositionSchema, start: PositionSchema });
const FunctionSchema = z.object({ decl: RangeSchema, loc: RangeSchema });
const FileSchema = z.object({
  fnMap: z.record(z.string(), FunctionSchema),
  s: z.record(z.string(), z.number()),
  statementMap: z.record(z.string(), RangeSchema),
});
const CoverageSchema = z.record(z.string(), FileSchema);

interface FunctionReport {
  complexity: number;
  coverage: number;
  crap: number;
  location: string;
  name: string;
}

function readCoverage(): Record<string, FileCoverage> {
  try {
    return CoverageSchema.parse(JSON.parse(readFileSync(COVERAGE_FILE, 'utf8')));
  } catch {
    throw new Error(`Cannot read ${COVERAGE_FILE}. Run \`npm run test:coverage\` first.`);
  }
}

function toReport(
  filePath: string,
  file: FileCoverage,
  message: ESLint.LintResult['messages'][number],
): FunctionReport[] {
  const groups = COMPLEXITY_MESSAGE.exec(message.message)?.groups;

  if (groups === undefined || message.ruleId !== 'complexity') {
    return [];
  }

  const complexity = Number(groups.complexity);
  const coverage = functionCoverage(file, message.line);

  return [
    {
      complexity,
      coverage,
      crap: crapScore(complexity, coverage),
      location: `${path.relative(process.cwd(), filePath)}:${String(message.line)}`,
      name: groups.name ?? 'Function',
    },
  ];
}

function formatReport(report: FunctionReport): string {
  const score = report.crap.toFixed(SCORE_DECIMALS).padStart(SCORE_WIDTH);
  const coverage = `${(report.coverage * PERCENT).toFixed(PERCENT_DECIMALS)}%`;

  return `${score}  ${report.location}  ${report.name} (complexity ${String(report.complexity)}, coverage ${coverage})`;
}

const coverage = readCoverage();
const coverageByFile = new Map(Object.entries(coverage));

const eslint = new ESLint({
  overrideConfig: [
    {
      files: ['**/*.ts'],
      languageOptions: { parser: tseslint.parser },
      rules: { complexity: ['error', REPORTED_ABOVE_COMPLEXITY] },
    },
  ],
  overrideConfigFile: true,
});

const results = await eslint.lintFiles(Object.keys(coverage));

const reports = results.flatMap(result => {
  const file = coverageByFile.get(result.filePath);

  return file === undefined
    ? []
    : result.messages.flatMap(message => toReport(result.filePath, file, message));
});

const sortedReports = reports.toSorted((first, second) => second.crap - first.crap);

for (const report of sortedReports) {
  console.log(formatReport(report));
}

const offenders = reports.filter(report => report.crap > CRAP_THRESHOLD);

if (offenders.length > NONE) {
  console.error(
    `\nCRAP: ${String(offenders.length)} function(s) above ${String(CRAP_THRESHOLD)}. Add tests or split the function.`,
  );
  process.exitCode = 1;
} else {
  console.log(
    `CRAP: ${String(reports.length)} function(s) checked, all at or below ${String(CRAP_THRESHOLD)}.`,
  );
}
