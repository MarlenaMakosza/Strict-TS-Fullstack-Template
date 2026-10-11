import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts', 'tests/**/*.{test,spec}.ts'],
    clearMocks: true,
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
