import { describe, expect, it } from 'vitest';

import { greet } from '../../src/greet.ts';

describe('greet', () => {
  it('greets by name', () => {
    expect.assertions(1);
    expect(greet('Ada')).toBe('Hello, Ada!');
  });

  it('trims the name', () => {
    expect.assertions(1);
    expect(greet('  Ada  ')).toBe('Hello, Ada!');
  });

  it('falls back when the name is empty', () => {
    expect.assertions(1);
    expect(greet(' '.repeat(3))).toBe('Hello!');
  });
});
