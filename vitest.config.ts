import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts', 'tests/**/*.{test,spec}.ts'],
    clearMocks: true,
    // Modules that import src/env.ts validate the environment on import (ADR ARCH-001). Tests must
    // not depend on a local .env, so they get a test database URL; tests can still stub it.
    env: { DATABASE_URL: 'postgres://test:test@localhost:5432/test' },
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      // src/db needs a real database: cover it with integration tests (Testcontainers), not unit tests.
      exclude: ['src/**/*.{test,spec}.ts', 'src/index.ts', 'src/db/**'],
      reporter: ['text', 'html', 'lcov', 'json'],
      thresholds: {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90,
      },
    },
  },
});
