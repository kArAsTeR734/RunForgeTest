import { AppHeader } from '../components/AppHeader/AppHeader';
import { RunsPage } from '../features/runs/RunsPage';
import styles from './App.module.css';

export function App() {
  return (
    <div className={styles.shell}>
      <AppHeader />
      <RunsPage />
    </div>
  );
}
