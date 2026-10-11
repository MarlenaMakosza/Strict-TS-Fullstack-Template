/// <reference path="../rules.d.ts" />

const ENVIRONMENT_MODULE = 'src/env.ts';
const TEST_FILE = /\.(?:test|spec)\.ts$/u;

export default {
  rules: {
    'no-process-env-outside-env-module': {
      description: 'Only src/env.ts reads process.env; other modules import env from it',
      async check(context) {
        const files = context.scopedFiles.filter(
          file => !file.endsWith(ENVIRONMENT_MODULE) && !TEST_FILE.test(file),
        );
        const matches = await Promise.all(
          files.map(file => context.grep(file, /\bprocess\.env\b/u)),
        );

        for (const match of matches.flat()) {
          context.report.violation({
            file: match.file,
            fix: `Add the variable to EnvironmentSchema in ${ENVIRONMENT_MODULE} and import env from it`,
            line: match.line,
            message: 'process.env is read outside src/env.ts',
          });
        }
      },
    },
  },
} satisfies RuleSet;
