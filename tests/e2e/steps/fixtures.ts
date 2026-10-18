import { type ChildProcess, spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import { setTimeout as sleep } from 'node:timers/promises';
import { test as base, createBdd } from 'playwright-bdd';

// The app validates DATABASE_URL on start. Scenarios must not depend on a local .env file.
const DATABASE_URL = 'postgres://user:password@localhost:5432/e2e';
const START_TIMEOUT_MS = 10_000;
const POLL_INTERVAL_MS = 100;

/** The last HTTP response, kept so that later steps can check it. */
interface Answer {
  body: string;
  status: number;
}

/** Asks the operating system for a port that no other process uses. */
async function freePort(): Promise<number> {
  const probe = createServer();

  probe.listen(0);
  await once(probe, 'listening');

  const address = probe.address();

  probe.close();

  if (address === null || typeof address === 'string') {
    throw new Error('Could not get a free port');
  }

  return address.port;
}

/** Starts `src/index.ts` as a real server on a free port, sends requests to it, and stops it. */
class Server {
  private lastAnswer: Answer | undefined;
  private port = 0;
  private process: ChildProcess | undefined;
  private stderrText = '';

  private async isUp(): Promise<boolean> {
    try {
      const response = await fetch(`http://127.0.0.1:${String(this.port)}/api/health`);

      return response.ok;
    } catch {
      return false;
    }
  }

  // Polls one request at a time: each check waits for the previous one on purpose.
  private async waitUntilUp(child: ChildProcess, deadline: number): Promise<void> {
    if (child.exitCode !== null || (await this.isUp())) {
      return;
    }

    if (Date.now() > deadline) {
      throw new Error(`The server did not start in time:\n${this.stderrText}`);
    }

    await sleep(POLL_INTERVAL_MS);
    await this.waitUntilUp(child, deadline);
  }

  /** The last response. Fails when no step has sent a request yet. */
  public get answer(): Answer {
    if (this.lastAnswer === undefined) {
      throw new Error('No step has sent a request yet');
    }

    return this.lastAnswer;
  }

  /** The exit code, or `null` while the server runs. */
  public get exitCode(): null | number {
    return this.process?.exitCode ?? null;
  }

  /** What the server wrote to stderr: its logs and its errors. */
  public get stderr(): string {
    return this.stderrText;
  }

  /**
   * Sends a GET request to the server.
   *
   * @param path - The path, with the query string.
   */
  public async request(path: string): Promise<void> {
    const response = await fetch(`http://127.0.0.1:${String(this.port)}${path}`);

    this.lastAnswer = { body: await response.text(), status: response.status };
  }

  /**
   * Starts the server and waits until it answers, or until it exits.
   *
   * @param environment - Variables added to the environment of the process.
   */
  public async start(environment: Record<string, string>): Promise<void> {
    this.port = await freePort();

    const child = spawn(process.execPath, ['src/index.ts'], {
      env: { ...process.env, DATABASE_URL, PORT: String(this.port), ...environment },
    });

    this.process = child;
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (chunk: string) => {
      this.stderrText += chunk;
    });

    await this.waitUntilUp(child, Date.now() + START_TIMEOUT_MS);
  }

  /** Stops the server, if it still runs. */
  public async stop(): Promise<void> {
    const child = this.process;

    if (child?.exitCode !== null) {
      return;
    }

    child.kill('SIGTERM');
    await once(child, 'exit');
  }
}

/** Playwright test with a `server` fixture: a fresh server for every scenario, stopped after it. */
export const test = base.extend<{ server: Server }>({
  server: async ({}, use) => {
    const server = new Server();

    await use(server);
    await server.stop();
  },
});

export const { Given, Then, When } = createBdd(test);
