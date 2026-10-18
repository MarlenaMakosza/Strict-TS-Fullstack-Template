import { defineConfig } from 'vitest/config';

// Tests of the shared tooling in dev/ (the CRAP gate). Each app in apps/ has its own Vitest config,
// coverage threshold and mutation testing; `npm test` at the root runs them all.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/tooling/**/*.{test,spec}.ts'],
    clearMocks: true,
  },
});
