import { useId } from 'react';
import type { RunStatus } from '../../entities/run/types';
import styles from './RunFilters.module.css';

export type RunStatusFilter = RunStatus | 'all';

const statusOptions: { value: RunStatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'queued', label: 'Queued' },
  { value: 'running', label: 'Running' },
  { value: 'succeeded', label: 'Succeeded' },
  { value: 'failed', label: 'Failed' },
];

type RunFiltersProps = {
  search: string;
  status: RunStatusFilter;
  resultCount: number | null;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: RunStatusFilter) => void;
};

export function RunFilters({
  search,
  status,
  resultCount,
  onSearchChange,
  onStatusChange,
}: RunFiltersProps) {
  const searchId = useId();

  return (
    <div className={styles.filters}>
      <div className={styles.search}>
        <label htmlFor={searchId}>Поиск запусков</label>
        <input
          id={searchId}
          type="search"
          placeholder="Название запуска или репозиторий"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
      <fieldset className={styles.statuses}>
        <legend>Статус</legend>
        <div className={styles.options}>
          {statusOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={status === option.value}
              onClick={() => onStatusChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>
      {resultCount !== null && (
        <p className={styles.count} role="status">
          Найдено запусков: {resultCount}
        </p>
      )}
    </div>
  );
}
