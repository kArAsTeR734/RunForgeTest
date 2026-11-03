import { useState } from 'react';
import type { Run } from '../../entities/run/types';
import { useRuns } from '../../hooks/useRuns';
import { RunDetailsModal } from './RunDetailsModal';
import { RunFilters } from './RunFilters';
import type { RunStatusFilter } from './RunFilters';
import { RunsContent } from './RunsContent';
import { RunsHeader } from './RunsHeader';
import styles from './RunsPage.module.css';

export function RunsPage() {
  const { data: runs, error, status, isLoading, isSuccess, reload } = useRuns();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<RunStatusFilter>('all');
  const [selectedRun, setSelectedRun] = useState<Run | null>(null);
  const query = search.trim().toLowerCase();
  const filteredRuns = runs.filter(
    (run) =>
      (statusFilter === 'all' || run.status === statusFilter) &&
      (run.name.toLowerCase().includes(query) || run.repository.toLowerCase().includes(query)),
  );

  function resetFilters() {
    setSearch('');
    setStatusFilter('all');
  }

  return (
    <main className={styles.main}>
      <RunsHeader isLoading={isLoading} onRefresh={() => void reload()} />
      <RunFilters
        search={search}
        status={statusFilter}
        resultCount={isSuccess ? filteredRuns.length : null}
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
      />
      <RunsContent
        status={status}
        error={error}
        runs={filteredRuns}
        hasFilters={query !== '' || statusFilter !== 'all'}
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
