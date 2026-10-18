import { failure, type Result, success } from '@app/shared/result';
import { z } from 'zod';

// The answer of GET /api/greeting, as described in the API's /api/openapi.json.
const GreetingSchema = z.object({ message: z.string() });

/** What the user sees when the server cannot answer; they can only try again. */
const UNREACHABLE = 'The server cannot be reached. Try again in a moment.';

/** What the user sees when the server answers with something the app does not understand. */
const UNEXPECTED = 'Something went wrong on the server. Try again later.';

// The only place that throws is the network call itself: no answer at all.
async function send(url: string, fetchFunction: typeof fetch): Promise<Result<Response>> {
  try {
    return success(await fetchFunction(url));
  } catch {
    return failure(UNREACHABLE);
  }
}

/**
 * Asks the backend for a greeting.
 *
 * @param name - Who to greet; may be empty.
 * @param fetchFunction - The fetch to use; tests pass a fake.
 * @returns The greeting, or a message for the user when it failed.
 */
export async function fetchGreeting(
  name: string,
  fetchFunction: typeof fetch = fetch,
): Promise<Result<string>> {
  const query = new URLSearchParams({ name });
  const sent = await send(`/api/greeting?${query.toString()}`, fetchFunction);

  if (!sent.ok) {
    return sent;
  }

  if (!sent.value.ok) {
    return failure(UNEXPECTED);
  }

  const parsed = GreetingSchema.safeParse(await sent.value.json());

  return parsed.success ? success(parsed.data.message) : failure(UNEXPECTED);
}
