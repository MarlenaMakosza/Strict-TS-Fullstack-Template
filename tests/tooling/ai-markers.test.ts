import { describe, expect, it } from 'vitest';

import { stripAiBlocks } from '../../dev/ai-markers.ts';

describe('stripAiBlocks', () => {
  it.each([
    {
      blocks: 0,
      expected: 'one\ntwo\n',
      name: 'leaves text without markers unchanged',
      text: 'one\ntwo\n',
    },
    {
      blocks: 1,
      expected: 'keep\nkeep too\n',
      name: 'removes a block with both marker lines',
      text: 'keep\n<!-- ai:start -->\nAI only\n<!-- ai:end -->\nkeep too\n',
    },
    {
      blocks: 2,
      expected: 'a\nd\n',
      name: 'understands the comment style of any file type',
      text: 'a\n  # ai:start\n  b\n  # ai:end\n// ai:start\nc\n// ai:end\nd\n',
    },
    {
      blocks: 1,
      expected: 'before\n\nafter\n',
      name: 'keeps one blank line where a removed block stood between two',
      text: 'before\n\n<!-- ai:start -->\nAI only\n<!-- ai:end -->\n\nafter\n',
    },
    {
      blocks: 1,
      expected: 'Leave the `ai:start` and `ai:end` comments.\nkeep\n',
      name: 'ignores a marker mentioned in text',
      text: 'Leave the `ai:start` and `ai:end` comments.\n# ai:start\n- `ai:to-end` too\n# ai:end\nkeep\n',
    },
    {
      blocks: 1,
      expected: 'keep\n',
      name: 'removes everything from a to-end marker on',
      text: 'keep\n\n<!-- ai:to-end -->\n## AI assistance\n\nAssisted-by:\n',
    },
  ])('$name', ({ blocks, expected, text }) => {
    expect.assertions(1);
    expect(stripAiBlocks(text)).toStrictEqual({ blocks, text: expected });
  });

  it.each([
    {
      error: 'ai:start on line 1 has no ai:end',
      name: 'a block that never ends',
      text: '<!-- ai:start -->\nAI only\n',
    },
    {
      error: 'ai:end on line 2 has no ai:start',
      name: 'an end without a start',
      text: 'a\n<!-- ai:end -->\n',
    },
    {
      error: 'ai:start on line 2 is inside the block from line 1',
      name: 'a block inside a block',
      text: '# ai:start\n# ai:start\n# ai:end\n# ai:end\n',
    },
    {
      error: 'ai:to-end on line 2 is inside the block from line 1',
      name: 'a to-end marker inside a block',
      text: '# ai:start\n# ai:to-end\n',
    },
  ])('refuses $name', ({ error, text }) => {
    expect.assertions(1);
    expect(() => stripAiBlocks(text)).toThrow(error);
  });
});
