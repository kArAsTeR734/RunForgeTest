import styles from './AppHeader.module.css';

export function AppHeader() {
  return (
    <header className={styles.header}>
      <a className={styles.brand} href="/">
        Runforge<span aria-hidden="true">.</span>
      </a>
      <span className={styles.workspace}>WORKSPACE / RUNS</span>
    </header>
  );
}
