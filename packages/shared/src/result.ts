/**
 * The outcome of an operation that may fail: either a value or an error. Return it instead of
 * throwing, so the caller has to check `ok` before it can use `value`.
 *
 * @typeParam TValue - The value on success.
 * @typeParam TError - The error on failure; a message by default.
 */
export type Result<TValue, TError = string> =
  { readonly error: TError; readonly ok: false } | { readonly ok: true; readonly value: TValue };

/**
 * Builds a successful Result.
 *
 * @param value - The value of the operation.
 * @returns A Result with `ok: true`.
 */
export function success<TValue>(value: TValue): Result<TValue, never> {
  return { ok: true, value };
}

/**
 * Builds a failed Result.
 *
 * @param error - What went wrong.
 * @returns A Result with `ok: false`.
 */
export function failure<TError>(error: TError): Result<never, TError> {
  return { error, ok: false };
}
