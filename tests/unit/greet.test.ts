import fc from 'fast-check';
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

  // Property-based tests: fast-check generates many names and shrinks a failing one to the
  // smallest example. They check rules that hold for every name, not one example each.
  describe('for any name', () => {
    it('starts with "Hello" and ends with "!"', () => {
      expect.hasAssertions();
      fc.assert(
        fc.property(fc.string(), name => {
          const greeting = greet(name);

          expect(greeting.startsWith('Hello')).toBe(true);
          expect(greeting.endsWith('!')).toBe(true);
        }),
      );
    });

    it('ignores the spaces around the name', () => {
      expect.hasAssertions();
      fc.assert(
        fc.property(fc.string(), fc.nat(5), fc.nat(5), (name, before, after) => {
          expect(greet(`${' '.repeat(before)}${name}${' '.repeat(after)}`)).toBe(greet(name));
        }),
      );
    });

    it('contains the trimmed name when the name is not blank', () => {
      expect.hasAssertions();
      fc.assert(
        fc.property(
          fc.string().filter(name => name.trim() !== ''),
          name => {
            expect(greet(name)).toBe(`Hello, ${name.trim()}!`);
          },
        ),
      );
    });
  });
});
