import { describe, expect, it, vi } from 'vitest';

import { fetchGreeting } from '../../../src/api/greeting.ts';

// The messages are what the user reads, so the tests spell them out.
const UNEXPECTED = 'Something went wrong on the server. Try again later.';
const UNREACHABLE = 'The server cannot be reached. Try again in a moment.';

function answering(response: Response): ReturnType<typeof vi.fn<typeof fetch>> {
  return vi.fn<typeof fetch>().mockResolvedValue(response);
}

describe('fetchGreeting', () => {
  it('asks the backend with the name in the query string', async () => {
    expect.assertions(1);

    const fetchFunction = answering(Response.json({ message: 'Hello, Ada Lovelace!' }));

    await fetchGreeting('Ada Lovelace', fetchFunction);

    expect(fetchFunction).toHaveBeenCalledWith('/api/greeting?name=Ada+Lovelace');
  });

  it('returns the greeting from the answer', async () => {
    expect.assertions(1);

    const result = await fetchGreeting('Ada', answering(Response.json({ message: 'Hello, Ada!' })));

    expect(result).toStrictEqual({ ok: true, value: 'Hello, Ada!' });
  });

  it('fails when the server answers with an error status', async () => {
    expect.assertions(1);

    const fetchFunction = answering(
      Response.json({ error: 'Internal server error' }, { status: 500 }),
    );

    await expect(fetchGreeting('Ada', fetchFunction)).resolves.toStrictEqual({
      error: UNEXPECTED,
      ok: false,
    });
  });

  it('fails on an error status even when the body looks like a greeting', async () => {
    expect.assertions(1);

    const fetchFunction = answering(
      Response.json({ message: 'Down for maintenance' }, { status: 503 }),
    );

    await expect(fetchGreeting('Ada', fetchFunction)).resolves.toStrictEqual({
      error: UNEXPECTED,
      ok: false,
    });
  });

  it('fails when the answer has an unexpected shape', async () => {
    expect.assertions(1);

    const fetchFunction = answering(Response.json({ greeting: 'Hello' }));

    await expect(fetchGreeting('Ada', fetchFunction)).resolves.toStrictEqual({
      error: UNEXPECTED,
      ok: false,
    });
  });

  it('fails when the server cannot be reached', async () => {
    expect.assertions(1);

    const fetchFunction = vi.fn<typeof fetch>().mockRejectedValue(new TypeError('fetch failed'));

    await expect(fetchGreeting('Ada', fetchFunction)).resolves.toStrictEqual({
      error: UNREACHABLE,
      ok: false,
    });
  });
});
