import { describe, expect, it } from 'vitest';
import { migrateExpeditionLogV11ToV14 } from '@/lib/models/expedition';

describe('migrateExpeditionLogV11ToV14', () => {
  it('renames sessionId to sessionLogId', () => {
    const out = migrateExpeditionLogV11ToV14({ id: '1', sessionId: 'abc', createdAt: 't' });
    expect(out.sessionLogId).toBe('abc');
  });

  it('maps legacy moods to the v1.4 enum', () => {
    expect(migrateExpeditionLogV11ToV14({ mood: 'great' }).mood).toBe('strong');
    expect(migrateExpeditionLogV11ToV14({ mood: 'good' }).mood).toBe('normal');
    expect(migrateExpeditionLogV11ToV14({ mood: 'rough' }).mood).toBe('tired');
  });

  it('maps rough to sore when a pain note is tagged', () => {
    const out = migrateExpeditionLogV11ToV14({ mood: 'rough', tags: ['pain-note'] });
    expect(out.mood).toBe('sore');
  });

  it('caps free text at 500 characters and defaults tags to []', () => {
    const out = migrateExpeditionLogV11ToV14({ text: 'x'.repeat(600) });
    expect(out.freeText.length).toBe(500);
    expect(out.tags).toEqual([]);
    expect(out.maxLength).toBe(500);
  });
});
