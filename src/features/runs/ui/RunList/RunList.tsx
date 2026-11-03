import { StatusBadge } from '../../../../components/StatusBadge/StatusBadge';
import type { Run } from '../../../../entities/run/module/types';
import { formatDate, formatDuration } from '../../../../utils/format';
import styles from './RunList.module.css';

type RunListProps = { runs: Run[]; onSelect: (run: Run) => void };

export function RunList({ runs, onSelect }: RunListProps) {
  return (
    <ul className={styles.list} aria-label="Запуски">
      {runs.map((run) => (
        <li className={styles.item} key={run.id}>
          <button
            type="button"
            className={styles.row}
            onClick={() => onSelect(run)}
            aria-label={`Открыть запуск ${run.name}`}
          >
            <span className={styles.identity}>
              <strong>{run.name}</strong>
              <span>
                {run.repository} <span aria-hidden="true">/</span> {run.branch}
              </span>
            </span>
            <StatusBadge status={run.status} />
            <span className={styles.metadata}>
              <time dateTime={run.createdAt}>{formatDate(run.createdAt)}</time>
              <span>Длительность: {formatDuration(run.durationSeconds)}</span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
