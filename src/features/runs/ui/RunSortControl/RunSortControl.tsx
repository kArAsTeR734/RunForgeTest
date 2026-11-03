import { useId } from 'react';
import type { RunSort } from '../../../../entities/run/filterTypes';
import styles from './RunSortControl.module.css';

const sortOptions: { value: RunSort; label: string }[] = [
  { value: 'date-desc', label: 'Сначала новые' },
  { value: 'date-asc', label: 'Сначала старые' },
  { value: 'duration-asc', label: 'Сначала короткие' },
  { value: 'duration-desc', label: 'Сначала длинные' },
];

type RunSortControlProps = { value: RunSort; onChange: (value: RunSort) => void };

export function RunSortControl({ value, onChange }: RunSortControlProps) {
  const id = useId();
  return (
    <div className={styles.control}>
      <label htmlFor={id}>Сортировка</label>
      <select
        id={id}
        value={value}
        onChange={(event) => {
          const option = sortOptions.find((option) => option.value === event.target.value);
          if (option) onChange(option.value);
        }}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
