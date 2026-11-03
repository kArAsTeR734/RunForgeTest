import type { Run } from '../../../../entities/run/types';
import { RunList } from '../RunList/RunList';
import styles from './RunsContent.module.css';

type RunsContentProps = {
  status: 'loading' | 'success' | 'error';
  error: Error | null;
  runs: Run[];
  hasFilters: boolean;
  onRetry: () => void;
  onReset: () => void;
  onSelect: (run: Run) => void;
};

export function RunsContent({
  status,
  error,
  runs,
  hasFilters,
  onRetry,
  onReset,
  onSelect,
}: RunsContentProps) {
  return (
    <section className={styles.panel} aria-label="Список запусков" aria-busy={status === 'loading'}>
      {status === 'loading' && (
        <p className={styles.message} role="status">
          Загружаем запуски…
        </p>
      )}
      {status === 'error' && (
        <div className={styles.message} role="alert">
          <p>{error?.message}</p>
          <button type="button" onClick={onRetry}>
            Повторить
          </button>
        </div>
      )}
      {status === 'success' &&
        (runs.length > 0 ? (
          <RunList runs={runs} onSelect={onSelect} />
        ) : (
          <div className={styles.message}>
            <h2>{hasFilters ? 'Ничего не найдено' : 'Запусков пока нет'}</h2>
            <p>
              {hasFilters
                ? 'Измените запрос или сбросьте поиск и фильтр статуса.'
                : 'Обновите список, чтобы проверить новые запуски.'}
            </p>
            {hasFilters && (
              <button type="button" onClick={onReset}>
                Сбросить поиск и фильтры
              </button>
            )}
          </div>
        ))}
    </section>
  );
}
