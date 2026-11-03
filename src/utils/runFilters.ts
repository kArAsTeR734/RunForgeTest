import type { RunFiltersState, RunSort, RunStatusFilter } from '../entities/run/module/filterTypes';
import type { Run } from '../entities/run/module/types';

function parseStatus(value: string | null): RunStatusFilter {
  return value === 'queued' || value === 'running' || value === 'succeeded' || value === 'failed'
    ? value
    : 'all';
}

function parseSort(value: string | null): RunSort {
  return value === 'date-asc' || value === 'duration-asc' || value === 'duration-desc'
    ? value
    : 'date-desc';
}

export function readRunFilters(searchParams: URLSearchParams): RunFiltersState {
  return {
    search: searchParams.get('q') ?? '',
    status: parseStatus(searchParams.get('status')),
    sort: parseSort(searchParams.get('sort')),
  };
}

export function writeRunFilters(url: URL, filters: RunFiltersState): URL {
  const next = new URL(url);
  for (const [key, value] of [
    ['q', filters.search],
    ['status', filters.status === 'all' ? '' : filters.status],
    ['sort', filters.sort === 'date-desc' ? '' : filters.sort],
  ]) {
    if (value) next.searchParams.set(key, value);
    else next.searchParams.delete(key);
  }
  return next;
}

function compareOptionalNumbers(
  first: number | undefined,
  second: number | undefined,
  direction: number,
) {
  if (first === undefined) return second === undefined ? 0 : 1;
  if (second === undefined) return -1;
  return (first - second) * direction;
}

export function selectRuns(runs: readonly Run[], filters: RunFiltersState): Run[] {
  const query = filters.search.trim().toLowerCase();
  const isDuration = filters.sort.startsWith('duration-');
  const direction = filters.sort.endsWith('-asc') ? 1 : -1;

  return runs
    .filter(
      (run) =>
        (filters.status === 'all' || run.status === filters.status) &&
        (run.name.toLowerCase().includes(query) || run.repository.toLowerCase().includes(query)),
    )
    .sort((first, second) => {
      const firstValue = isDuration ? first.durationSeconds : Date.parse(first.createdAt);
      const secondValue = isDuration ? second.durationSeconds : Date.parse(second.createdAt);
      return compareOptionalNumbers(
        firstValue !== undefined && Number.isFinite(firstValue) ? firstValue : undefined,
        secondValue !== undefined && Number.isFinite(secondValue) ? secondValue : undefined,
        direction,
      );
    });
}
