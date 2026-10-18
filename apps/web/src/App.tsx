import type { Result } from '@app/shared/result';

import { type SubmitEvent, useState } from 'react';

/** What the app needs from outside; tests pass their own. */
interface AppProperties {
  getGreeting(name: string): Promise<Result<string>>;
}

type Status =
  | { readonly error: string; readonly kind: 'failed' }
  | { readonly kind: 'greeted'; readonly message: string }
  | { readonly kind: 'waiting' };

/**
 * The example page: the user types a name and the backend greets them.
 *
 * @param props - Where the greeting comes from.
 * @returns The page.
 */
export function App(properties: Readonly<AppProperties>): React.JSX.Element {
  const [name, setName] = useState('');
  // null until the user asks for the first greeting.
  const [status, setStatus] = useState<null | Status>(null);
  const isWaiting = status?.kind === 'waiting';

  async function greet(event: SubmitEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setStatus({ kind: 'waiting' });

    const result = await properties.getGreeting(name);

    setStatus(
      result.ok
        ? { kind: 'greeted', message: result.value }
        : { error: result.error, kind: 'failed' },
    );
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-8 font-sans">
      <h1 className="text-2xl font-semibold text-brand-900">Greeting</h1>
      <form
        className="flex flex-col gap-2"
        onSubmit={event => {
          void greet(event);
        }}>
        <label className="font-medium" htmlFor="name">
          Your name
        </label>
        <div className="flex gap-2">
          <input
            autoComplete="given-name"
            className="flex-1 rounded-sm border border-brand-900 px-3 py-2"
            id="name"
            onChange={event => {
              setName(event.target.value);
            }}
            value={name}
          />
          <button
            className="
              rounded-sm bg-brand-500 px-4 py-2 text-white
              disabled:opacity-60
            "
            disabled={isWaiting}
            type="submit">
            {isWaiting ? 'Greeting…' : 'Greet'}
          </button>
        </div>
      </form>
      <p aria-live="polite" className="text-lg" role="status">
        {status?.kind === 'greeted' ? status.message : ''}
      </p>
      {status?.kind === 'failed' ? (
        <p className="text-red-700" role="alert">
          {status.error}
        </p>
      ) : null}
    </main>
  );
}
