import type { RunStatus } from '../../entities/run/types';
import styles from './StatusBadge.module.css';

const labels: Record<RunStatus, string> = {
  queued: 'Queued',
  running: 'Running',
  succeeded: 'Succeeded',
  failed: 'Failed',
};

export function StatusBadge({ status }: { status: RunStatus }) {
  return <span className={`${styles.badge} ${styles[status]}`}>{labels[status]}</span>;
}
