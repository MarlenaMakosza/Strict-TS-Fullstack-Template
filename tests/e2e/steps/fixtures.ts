import { spawnSync } from 'node:child_process';
import { test as base, createBdd } from 'playwright-bdd';

/** Result of one run of the app. */
interface AppRun {
  exitCode: null | number;
  stderr: string;
  stdout: string;
}

/** Starts the app as a process and keeps the last run, so later steps can check it. */
class App {
  private lastRun: AppRun | undefined;

  /** The last run. Fails when no step has started the app yet. */
  public get result(): AppRun {
    if (this.lastRun === undefined) {
      throw new Error('No step has started the app yet');
    }

    return this.lastRun;
  }

  /**
   * Runs `src/index.ts` with extra environment variables.
   *
   * @param environment - Variables added to the environment of the process.
   */
  public run(environment: Record<string, string>): void {
    const result = spawnSync(process.execPath, ['src/index.ts'], {
      encoding: 'utf8',
      env: { ...process.env, ...environment },
    });

    this.lastRun = { exitCode: result.status, stderr: result.stderr, stdout: result.stdout };
  }
}

/** Playwright test with an `app` fixture: a fresh App for every scenario. */
export const test = base.extend<{ app: App }>({
  app: async ({}, use) => {
    await use(new App());
  },
});

export const { Given, Then, When } = createBdd(test);
