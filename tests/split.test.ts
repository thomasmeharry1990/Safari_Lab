import { describe, expect, it } from 'vitest';
import { chooseSplit } from '@/lib/engine';

describe('chooseSplit', () => {
  it('auto picks full body for 2-3 days', () => {
    expect(chooseSplit(2, 'auto').sessions.map((s) => s.key)).toEqual(['full_a', 'full_b']);
    expect(chooseSplit(3, 'auto').label).toBe('Full Body');
  });

  it('auto picks upper/lower for 4 days', () => {
    expect(chooseSplit(4, 'auto').sessions.map((s) => s.key)).toEqual([
      'upper', 'lower', 'upper', 'lower',
    ]);
  });

  it('honours a PPL preference for 6 days', () => {
    const s = chooseSplit(6, 'ppl');
    expect(s.sessions.map((x) => x.key)).toEqual(['push', 'pull', 'legs', 'push', 'pull', 'legs']);
  });

  it('falls back to auto when a preference does not fit the day count', () => {
    // upper/lower needs an even count; 3 days falls back
    expect(chooseSplit(3, 'upper_lower').label).toBe('Full Body');
  });
});
