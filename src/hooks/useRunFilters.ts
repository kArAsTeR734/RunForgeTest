import { useEffect, useState } from 'react';
import type { RunFiltersState, RunSort, RunStatusFilter } from '../entities/run/filterTypes';
import { readRunFilters, writeRunFilters } from '../utils/runFilters';

function readLocation(): RunFiltersState {
  return readRunFilters(new URLSearchParams(window.location.search));
}

export function useRunFilters() {
  const [filters, setFilters] = useState(readLocation);

  useEffect(() => {
    const handlePopState = () => setFilters(readLocation());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  function updateFilters(nextFilters: RunFiltersState, replace = false) {
    const nextUrl = writeRunFilters(new URL(window.location.href), nextFilters);
    if (nextUrl.href !== window.location.href) {
      if (replace) window.history.replaceState(window.history.state, '', nextUrl);
      else window.history.pushState(window.history.state, '', nextUrl);
    }
    setFilters(nextFilters);
  }

  return {
    filters,
    setSearch: (search: string) => updateFilters({ ...filters, search }, true),
    setStatus: (status: RunStatusFilter) => updateFilters({ ...filters, status }),
    setSort: (sort: RunSort) => updateFilters({ ...filters, sort }),
    resetFilters: () => updateFilters({ ...filters, search: '', status: 'all' }),
  };
}
