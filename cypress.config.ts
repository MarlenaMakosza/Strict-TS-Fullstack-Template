import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import { defineConfig } from 'cypress';
import { spawnSync } from 'node:child_process';

/** Result of one app run, passed from the Node side to the step definitions. */
export interface AppRun {
  exitCode: number | null;
  stderr: string;
  stdout: string;
}

export default defineConfig({
  e2e: {
    // The app is a CLI for now. Set E2E_BASE_URL when it gets an HTTP server.
    baseUrl: process.env['E2E_BASE_URL'] ?? null,
    specPattern: 'cypress/e2e/**/*.feature',
    supportFile: 'cypress/support/e2e.ts',
    // A CLI has no page to capture. Enable when the app gets a UI.
    screenshotOnRunFailure: false,
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on('file:preprocessor', createBundler({ plugins: [createEsbuildPlugin(config)] }));
      on('task', {
        runApp(environment: Record<string, string>): AppRun {
          const result = spawnSync(process.execPath, ['src/index.ts'], {
            encoding: 'utf8',
            env: { ...process.env, ...environment },
          });

          return { exitCode: result.status, stderr: result.stderr, stdout: result.stdout };
        },
      });

      return config;
    },
  },
});
