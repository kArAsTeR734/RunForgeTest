import { useId } from 'react';
import type { RunSort, RunStatusFilter } from '../../../../entities/run/module/filterTypes';
import { RunSortControl } from '../RunSortControl/RunSortControl';
import styles from './RunFilters.module.css';

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
  sort: RunSort;
  resultCount: number | null;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: RunStatusFilter) => void;
  onSortChange: (value: RunSort) => void;
};

export function RunFilters({
  search,
  status,
  sort,
  resultCount,
  onSearchChange,
  onStatusChange,
  onSortChange,
}: RunFiltersProps) {
  const searchId = useId();
  const statusId = useId();

  return (
    <div className={styles.filters}>
      <div className={styles.toolbar}>
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
        <RunSortControl value={sort} onChange={onSortChange} />
      </div>
      <fieldset className={styles.statuses}>
        <legend>Статус</legend>
        <div className={styles.options}>
          {statusOptions.map((option) => (
            <label className={styles.option} key={option.value}>
              <input
                type="radio"
                name={statusId}
                value={option.value}
                checked={status === option.value}
                onChange={() => onStatusChange(option.value)}
              />
              <span>{option.label}</span>
            </label>
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
