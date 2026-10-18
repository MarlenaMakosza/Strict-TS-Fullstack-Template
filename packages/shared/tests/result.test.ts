import { describe, expect, it } from 'vitest';

import { failure, type Result, success } from '../src/result.ts';

// An example of an operation that may fail, written the way the conventions ask.
function parseAge(input: string): Result<number> {
  const age = Number(input);

  return Number.isSafeInteger(age) && age >= 0 ? success(age) : failure(`Not an age: ${input}`);
}

describe('result', () => {
  it('success wraps the value', () => {
    expect.assertions(1);
    expect(success(42)).toStrictEqual({ ok: true, value: 42 });
  });

  it('failure wraps the error', () => {
    expect.assertions(1);
    expect(failure('Not found')).toStrictEqual({ error: 'Not found', ok: false });
  });

  it('failure keeps a structured error', () => {
    expect.assertions(1);
    expect(failure({ code: 404 })).toStrictEqual({ error: { code: 404 }, ok: false });
  });

  it('given a valid input when parsed then the caller gets the value', () => {
    expect.assertions(1);

    const result = parseAge('42');

    expect(result.ok ? result.value : undefined).toBe(42);
  });

  it('given an invalid input when parsed then the caller gets the error', () => {
    expect.assertions(1);

    const result = parseAge('abc');

    expect(result.ok ? undefined : result.error).toBe('Not an age: abc');
  });
});
