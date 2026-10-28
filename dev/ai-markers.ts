/**
 * Finds the AI-only parts of a text file. A part starts at a line with an `ai:start` comment and
 * ends at a line with an `ai:end` comment; an `ai:to-end` comment starts a part that runs to the
 * end of the file. The comment fits the file type and is alone on its line: `<!-- ai:start -->` in
 * Markdown, `# ai:start` in YAML, `// ai:start` in TypeScript. A marker mentioned in text is not a
 * marker. `dev/remove-ai.ts` removes these parts.
 */

const START = 'ai:start';
const END = 'ai:end';
const TO_END = 'ai:to-end';
const NONE = 0;
const ONE = 1;
const LAST = -1;

/** Each marker as a whole line, in the comment style of Markdown, TypeScript and YAML. */
const MARKERS = new Map(
  [START, END, TO_END].flatMap(marker => {
    return [
      [`<!-- ${marker} -->`, marker],
      [`// ${marker}`, marker],
      [`# ${marker}`, marker],
    ];
  }),
);

/** The text without its AI-only parts, and how many parts were removed. */
export interface Stripped {
  blocks: number;
  text: string;
}

interface Block {
  first: number;
  last: number;
}

function lineNumber(index: number): number {
  return index + ONE;
}

function startOf(open: number | undefined, marker: string, index: number): number {
  if (open !== undefined) {
    throw new Error(
      `${marker} on line ${lineNumber(index)} is inside the block from line ${lineNumber(open)}`,
    );
  }

  return index;
}

function endOf(open: number | undefined, index: number): Block {
  if (open === undefined) {
    throw new Error(`${END} on line ${lineNumber(index)} has no ${START}`);
  }

  return { first: open, last: index };
}

function findBlocks(lines: readonly string[]): Block[] {
  const blocks: Block[] = [];
  let open: number | undefined;

  for (const [index, line] of lines.entries()) {
    const marker = MARKERS.get(line.trim());

    if (marker === TO_END) {
      blocks.push({ first: startOf(open, TO_END, index), last: lines.length - ONE });
      return blocks;
    }

    if (marker === START) {
      open = startOf(open, START, index);
    } else if (marker === END) {
      blocks.push(endOf(open, index));
      open = undefined;
    } else {
      // A line without a marker belongs to the block that is open, if any.
    }
  }

  if (open !== undefined) {
    throw new Error(`${START} on line ${lineNumber(open)} has no ${END}`);
  }

  return blocks;
}

function isBlank(line: string | undefined): boolean {
  return line?.trim() === '';
}

/** Removes every AI-only part; a removed part between two blank lines leaves only one. */
export function stripAiBlocks(text: string): Stripped {
  const lines = text.split('\n');
  const blocks = findBlocks(lines);

  if (blocks.length === NONE) {
    return { blocks: NONE, text };
  }

  const kept: string[] = [];
  let next = 0;

  for (const block of blocks) {
    kept.push(...lines.slice(next, block.first));
    next = block.last + ONE;

    if (isBlank(kept.at(LAST)) && isBlank(lines.at(next))) {
      next += ONE;
    }
  }

  kept.push(...lines.slice(next));

  return { blocks: blocks.length, text: `${kept.join('\n').trimEnd()}\n` };
}
