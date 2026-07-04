import { describe, expect, it } from 'vitest';
import { moveItem } from '@/lib/engine';

describe('moveItem', () => {
  it('moves an item down', () => {
    expect(moveItem(['a', 'b', 'c'], 0, 1)).toEqual(['b', 'a', 'c']);
  });

  it('moves an item up', () => {
    expect(moveItem(['a', 'b', 'c'], 2, -1)).toEqual(['a', 'c', 'b']);
  });

  it('returns the same reference for out-of-range moves (no-op)', () => {
    const list = ['a', 'b', 'c'];
    expect(moveItem(list, 0, -1)).toBe(list); // can't move first up
    expect(moveItem(list, 2, 1)).toBe(list); // can't move last down
    expect(moveItem(list, 5, 1)).toBe(list); // bad index
  });

  it('does not mutate the input array', () => {
    const list = ['a', 'b', 'c'];
    const out = moveItem(list, 1, 1);
    expect(list).toEqual(['a', 'b', 'c']);
    expect(out).toEqual(['a', 'c', 'b']);
  });
});
