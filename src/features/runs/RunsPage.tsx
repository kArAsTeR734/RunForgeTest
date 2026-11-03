import { useState } from 'react';
import type { Run } from '../../entities/run/module/types';
import { useRuns } from '../../hooks/useRuns';
import { useRunFilters } from '../../hooks/useRunFilters';
import { selectRuns } from '../../utils/runFilters';
import { RunDetailsModal } from './ui/RunDetailsModal/RunDetailsModal';
import { RunFilters } from './ui/RunFilters/RunFilters';
import { RunsContent } from './ui/RunsContent/RunsContent';
import { RunsHeader } from './ui/RunsHeader/RunsHeader';
import styles from './RunsPage.module.css';

export function RunsPage() {
  const { data: runs, error, status, isLoading, isSuccess, reload } = useRuns();
  const { filters, setSearch, setStatus, setSort, resetFilters } = useRunFilters();
  const [selectedRun, setSelectedRun] = useState<Run | null>(null);
  const filteredRuns = selectRuns(runs, filters);

  return (
    <main className={styles.main}>
      <RunsHeader isLoading={isLoading} onRefresh={() => void reload()} />
      <RunFilters
        search={filters.search}
        status={filters.status}
        sort={filters.sort}
        resultCount={isSuccess ? filteredRuns.length : null}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onSortChange={setSort}
      />
      <RunsContent
        status={status}
        error={error}
        runs={filteredRuns}
        hasFilters={filters.search.trim() !== '' || filters.status !== 'all'}
        onRetry={() => void reload()}
        onReset={resetFilters}
        onSelect={setSelectedRun}
      />
      {import.meta.env.DEV && (
        <button
          className={styles.debug}
          type="button"
          disabled={isLoading}
          onClick={() => void reload(true)}
        >
          Проверить ошибку mock-запроса
        </button>
      )}
      {selectedRun && <RunDetailsModal run={selectedRun} onClose={() => setSelectedRun(null)} />}
    </main>
  );
}
