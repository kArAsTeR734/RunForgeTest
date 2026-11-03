import { afterEach, describe, expect, it, vi } from 'vitest';
import { getRuns } from './runService';

afterEach(() => vi.useRealTimers());

describe('getRuns', () => {
  it('resolves after the delay with all four statuses and independent data', async () => {
    vi.useFakeTimers();
    const request = getRuns();
    const resolved = vi.fn();
    void request.then(resolved);
    await vi.advanceTimersByTimeAsync(849);
    expect(resolved).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    const runs = await request;
    expect(runs.length).toBeGreaterThanOrEqual(6);
    expect(new Set(runs.map((run) => run.status))).toEqual(
      new Set(['queued', 'running', 'succeeded', 'failed']),
    );
    runs[0].logs.push('Caller mutation');
    const secondRequest = getRuns();
    await vi.runAllTimersAsync();
    expect((await secondRequest)[0].logs).not.toContain('Caller mutation');
  });

  it('rejects a simulated failure and allows a successful retry', async () => {
    vi.useFakeTimers();
    const failure = expect(getRuns({ simulateError: true })).rejects.toThrow(
      'Не удалось загрузить',
    );
    await vi.runAllTimersAsync();
    await failure;
    const retry = getRuns();
    await vi.runAllTimersAsync();
    expect((await retry).length).toBeGreaterThanOrEqual(6);
  });

  it('cancels an active request', async () => {
    vi.useFakeTimers();
    const controller = new AbortController();
    const failure = expect(getRuns({ signal: controller.signal })).rejects.toMatchObject({
      name: 'AbortError',
    });
    controller.abort();
    await failure;
    expect(vi.getTimerCount()).toBe(0);
  });

  it('rejects an already cancelled request without scheduling work', async () => {
    vi.useFakeTimers();
    const controller = new AbortController();
    controller.abort();
    await expect(getRuns({ signal: controller.signal })).rejects.toMatchObject({
      name: 'AbortError',
    });
    expect(vi.getTimerCount()).toBe(0);
  });
});
