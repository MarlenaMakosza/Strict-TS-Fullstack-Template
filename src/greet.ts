/**
 * Builds a greeting. Example module — replace with real code.
 *
 * @param name - Who to greet.
 * @returns The greeting text.
 */
export function greet(name: string): string {
  const trimmed = name.trim();

  return trimmed === '' ? 'Hello!' : `Hello, ${trimmed}!`;
}
