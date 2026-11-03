import { useEffect, useId, useRef } from 'react';
import { StatusBadge } from '../../../../components/StatusBadge/StatusBadge';
import type { Run } from '../../../../entities/run/module/types';
import { formatDate, formatDuration } from '../../../../utils/format';
import styles from './RunDetailsModal.module.css';

type RunDetailsModalProps = { run: Run; onClose: () => void };

export function RunDetailsModal({ run, onClose }: RunDetailsModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;

        // Backdrop clicks target the dialog too; its padding remains inside.
        const bounds = event.currentTarget.getBoundingClientRect();
        const isOutside =
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom;

        if (isOutside) onClose();
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>ПОДРОБНОСТИ ЗАПУСКА</p>
          <h2 id={titleId}>{run.name}</h2>
        </div>
        <button type="button" onClick={onClose} aria-label="Закрыть подробности">
          Закрыть
        </button>
      </header>
      <StatusBadge status={run.status} />
      <dl className={styles.metadata}>
        <div>
          <dt>ID</dt>
          <dd>{run.id}</dd>
        </div>
        <div>
          <dt>Репозиторий</dt>
          <dd>{run.repository}</dd>
        </div>
        <div>
          <dt>Ветка</dt>
          <dd>{run.branch}</dd>
        </div>
        <div>
          <dt>Создан</dt>
          <dd>
            <time dateTime={run.createdAt}>{formatDate(run.createdAt)}</time>
          </dd>
        </div>
        <div>
          <dt>Длительность</dt>
          <dd>{formatDuration(run.durationSeconds)}</dd>
        </div>
      </dl>
      <section className={styles.section} aria-label="Логи">
        <h3>Логи</h3>
        {run.logs.length > 0 ? (
          <pre className={styles.logs}>{run.logs.join('\n')}</pre>
        ) : (
          <p>Логов пока нет.</p>
        )}
      </section>
      {run.result && (
        <section className={styles.section} aria-label="Результат">
          <h3>Результат</h3>
          <p className={styles.result}>{run.result}</p>
        </section>
      )}
    </dialog>
  );
}
