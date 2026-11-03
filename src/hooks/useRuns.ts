import { useCallback, useEffect, useRef, useState } from 'react';
import { getRuns } from '../entities/run/runService';
import type { Run } from '../entities/run/types';

type RunsQueryState =
  | { status: 'loading'; data: Run[]; error: null }
  | { status: 'success'; data: Run[]; error: null }
  | { status: 'error'; data: Run[]; error: Error };

export function useRuns() {
  const [runsQueryState, setRunsQueryState] = useState<RunsQueryState>({
    status: 'loading',
    data: [],
    error: null,
  });
  const activeRequest = useRef<AbortController | null>(null);

  const fetchRuns = useCallback(async (simulateError = false) => {
    // Cancel the previous request before starting a new one.
    activeRequest.current?.abort();

    const controller = new AbortController();
    activeRequest.current = controller;
    try {
      const data = await getRuns({ signal: controller.signal, simulateError });
      if (!controller.signal.aborted) {
        setRunsQueryState({ status: 'success', data, error: null });
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        setRunsQueryState({
          status: 'error',
          data: [],
          error: error instanceof Error ? error : new Error('Не удалось загрузить запуски.'),
        });
      }
    }
  }, []);

  const reload = useCallback(
    (simulateError = false) => {
      setRunsQueryState({ status: 'loading', data: [], error: null });
      return fetchRuns(simulateError);
    },
    [fetchRuns],
  );

  useEffect(() => {
    // Initial state is already loading; only the asynchronous result updates it.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetchRuns updates state only after await, not synchronously.
    void fetchRuns();
    return () => activeRequest.current?.abort();
  }, [fetchRuns]);

  return {
    ...runsQueryState,
    isLoading: runsQueryState.status === 'loading',
    isSuccess: runsQueryState.status === 'success',
    isError: runsQueryState.status === 'error',
    reload,
  };
}
