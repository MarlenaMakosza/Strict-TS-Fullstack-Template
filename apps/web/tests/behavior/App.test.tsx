import type { Result } from '@app/shared/result';

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { App } from '../../src/App.tsx';

type GetGreeting = (name: string) => Promise<Result<string>>;

const GREET_BUTTON = { name: 'Greet' };
const ADA_GREETING = 'Hello, Ada!';

function renderApp(getGreeting: GetGreeting): ReturnType<typeof userEvent.setup> {
  render(<App getGreeting={getGreeting} />);

  return userEvent.setup();
}

describe('App', () => {
  it('greets the user by the name they typed', async () => {
    expect.assertions(2);

    const getGreeting = vi.fn<GetGreeting>().mockResolvedValue({ ok: true, value: ADA_GREETING });
    const user = renderApp(getGreeting);

    await user.type(screen.getByLabelText('Your name'), 'Ada');
    await user.click(screen.getByRole('button', GREET_BUTTON));

    await screen.findByText(ADA_GREETING);

    expect(screen.getByRole('status')).toHaveTextContent(ADA_GREETING);
    expect(getGreeting).toHaveBeenCalledWith('Ada');
  });

  it('greets with the Enter key too', async () => {
    expect.assertions(1);

    const user = renderApp(vi.fn<GetGreeting>().mockResolvedValue({ ok: true, value: 'Hello!' }));

    await user.type(screen.getByLabelText('Your name'), '{Enter}');

    await screen.findByText('Hello!');

    expect(screen.getByRole('status')).toHaveTextContent('Hello!');
  });

  it('disables the button and says so while it waits for the server', async () => {
    expect.assertions(2);

    // The server never answers in this test.
    const pending = Promise.withResolvers<Result<string>>();
    const user = renderApp(async () => pending.promise);

    await user.click(screen.getByRole('button', GREET_BUTTON));

    const button = screen.getByRole('button', { name: 'Greeting…' });

    expect(button).toBeDisabled();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows what went wrong when the greeting fails', async () => {
    expect.assertions(2);

    const user = renderApp(
      vi.fn<GetGreeting>().mockResolvedValue({ error: 'The server cannot be reached.', ok: false }),
    );

    await user.click(screen.getByRole('button', GREET_BUTTON));

    await screen.findByRole('alert');

    expect(screen.getByRole('alert')).toHaveTextContent('The server cannot be reached.');
    expect(screen.getByRole('button', GREET_BUTTON)).toBeEnabled();
  });

  it('starts with an empty status and no error', () => {
    expect.assertions(2);

    renderApp(vi.fn<GetGreeting>());

    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('keeps the browser from reloading the page when the form is sent', () => {
    expect.assertions(1);

    renderApp(vi.fn<GetGreeting>().mockResolvedValue({ ok: true, value: ADA_GREETING }));

    const form = screen.getByRole('button', GREET_BUTTON).closest('form');

    // dispatchEvent answers false when the app called preventDefault().
    expect(form !== null && fireEvent.submit(form)).toBe(false);
  });
});
