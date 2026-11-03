import styles from './RunsHeader.module.css';

type RunsHeaderProps = { isLoading: boolean; onRefresh: () => void };

export function RunsHeader({ isLoading, onRefresh }: RunsHeaderProps) {
  return (
    <header>
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>AI AGENTS</p>
          <h1>Runs</h1>
        </div>
        <button type="button" disabled={isLoading} onClick={onRefresh}>
          Обновить
        </button>
      </div>
      <p className={styles.description}>Запуски AI-агентов в ваших репозиториях.</p>
    </header>
  );
}
