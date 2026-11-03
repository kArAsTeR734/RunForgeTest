import { mockRuns } from './module/mockData';
import type { Run } from './module/types';

export type RunRequestOptions = {
  signal?: AbortSignal;
  simulateError?: boolean;
  delayMs?: number;
};

export function getRuns({
  signal,
  simulateError = false,
  delayMs = 850,
}: RunRequestOptions = {}): Promise<Run[]> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Request aborted', 'AbortError'));
      return;
    }

    const abort = () => {
      clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
      reject(new DOMException('Request aborted', 'AbortError'));
    };

    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', abort);
      if (simulateError) {
        reject(new Error('Не удалось загрузить запуски. Попробуйте ещё раз.'));
        return;
      }
      resolve(structuredClone([...mockRuns]));
    }, delayMs);

    signal?.addEventListener('abort', abort, { once: true });
  });
}
