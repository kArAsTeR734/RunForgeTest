import { describe, expect, it } from 'vitest';
import type { RunFiltersState, RunSort } from '../entities/run/module/filterTypes';
import type { Run } from '../entities/run/module/types';
import { readRunFilters, selectRuns, writeRunFilters } from './runFilters';

const defaults: RunFiltersState = { search: '', status: 'all', sort: 'date-desc' };
const runs: Run[] = [
  {
    id: 'new',
    name: 'Auth refactor',
    repository: 'web',
    branch: 'main',
    status: 'running',
    createdAt: '2026-11-03T12:00:00Z',
    durationSeconds: 120,
    logs: [],
  },
  {
    id: 'old',
    name: 'Fix tests',
    repository: 'payments',
    branch: 'main',
    status: 'succeeded',
    createdAt: '2026-11-01T12:00:00Z',
    durationSeconds: 30,
    logs: [],
  },
  {
    id: 'zero',
    name: 'Restore cache',
    repository: 'web',
    branch: 'main',
    status: 'succeeded',
    createdAt: '2026-11-02T12:00:00Z',
    durationSeconds: 0,
    logs: [],
  },
  {
    id: 'unknown',
    name: 'Review API',
    repository: 'api-service',
    branch: 'main',
    status: 'running',
    createdAt: '2026-11-04T12:00:00Z',
    logs: [],
  },
  {
    id: 'equal',
    name: 'Prepare API',
    repository: 'api-service',
    branch: 'main',
    status: 'queued',
    createdAt: '2026-11-02T12:00:00Z',
    durationSeconds: 30,
    logs: [],
  },
  {
    id: 'invalid-date',
    name: 'Legacy run',
    repository: 'legacy',
    branch: 'main',
    status: 'failed',
    createdAt: 'invalid',
    logs: [],
  },
];

describe('selectRuns', () => {
  it.each<[RunSort, string[]]>([
    ['date-desc', ['unknown', 'new', 'zero', 'equal', 'old', 'invalid-date']],
    ['date-asc', ['old', 'zero', 'equal', 'new', 'unknown', 'invalid-date']],
    ['duration-asc', ['zero', 'old', 'equal', 'new', 'unknown', 'invalid-date']],
    ['duration-desc', ['new', 'old', 'equal', 'zero', 'unknown', 'invalid-date']],
  ])('sorts by %s, keeps ties stable and unknown values last', (sort, expected) => {
    const originalIds = runs.map((run) => run.id);
    expect(selectRuns(runs, { ...defaults, sort }).map((run) => run.id)).toEqual(expected);
    expect(runs.map((run) => run.id)).toEqual(originalIds);
  });

  it('combines search and status before sorting', () => {
    expect(
      selectRuns(runs, { search: '  API-SERVICE  ', status: 'running', sort: 'duration-desc' }).map(
        (run) => run.id,
      ),
    ).toEqual(['unknown']);
    expect(selectRuns(runs, { ...defaults, search: 'AUTH' }).map((run) => run.id)).toEqual(['new']);
  });

  it('returns an empty array when no run matches', () => {
    expect(selectRuns(runs, { ...defaults, search: 'missing' })).toEqual([]);
  });
});

describe('URL filters', () => {
  it('restores filters and defaults invalid values', () => {
    expect(
      readRunFilters(new URLSearchParams('status=failed&q=Fix+tests&sort=duration-asc')),
    ).toEqual({ search: 'Fix tests', status: 'failed', sort: 'duration-asc' });
    expect(readRunFilters(new URLSearchParams('status=other&sort=invalid'))).toEqual(defaults);
  });

  it('round-trips special characters and preserves unrelated parameters and hash', () => {
    const filters: RunFiltersState = {
      search: 'задача & API/#',
      status: 'queued',
      sort: 'duration-desc',
    };
    const original = new URL('https://example.com/runs?workspace=demo#recent');
    const next = writeRunFilters(original, filters);
    expect(readRunFilters(next.searchParams)).toEqual(filters);
    expect(next.searchParams.get('workspace')).toBe('demo');
    expect(next.hash).toBe('#recent');
    expect(original.search).toBe('?workspace=demo');
  });

  it('removes default values from the URL', () => {
    const next = writeRunFilters(
      new URL('https://example.com/?status=failed&q=test&sort=date-asc'),
      defaults,
    );
    expect(next.search).toBe('');
  });
});
