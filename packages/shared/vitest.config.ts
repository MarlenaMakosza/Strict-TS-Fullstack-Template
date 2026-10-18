import { defineConfig } from 'vitest/config';

// Code shared by the apps. It gets the same gates as an app: coverage and mutation testing.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.{test,spec}.ts'],
    clearMocks: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      reporter: ['text', 'html', 'lcov', 'json'],
      thresholds: { branches: 90, functions: 90, lines: 90, statements: 90 },
    },
  },
});
