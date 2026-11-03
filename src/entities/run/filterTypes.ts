import type { RunStatus } from './types';

export type RunStatusFilter = RunStatus | 'all';
export type RunSort = 'date-desc' | 'date-asc' | 'duration-asc' | 'duration-desc';

export type RunFiltersState = {
  search: string;
  status: RunStatusFilter;
  sort: RunSort;
};
