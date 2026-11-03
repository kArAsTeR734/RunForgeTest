// @vitest-environment jsdom
import { StrictMode } from 'react';
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useRuns } from './useRuns';

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

async function finishRequests() {
  await act(async () => {
    await vi.runAllTimersAsync();
  });
}

describe('useRuns', () => {
  it('exposes loading, data and success without refetching on rerender', async () => {
    const { result, rerender } = renderHook(() => useRuns());
    expect(result.current).toMatchObject({
      status: 'loading',
      isLoading: true,
      isSuccess: false,
      isError: false,
      data: [],
      error: null,
    });
    await finishRequests();
    expect(result.current.status).toBe('success');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data.length).toBeGreaterThanOrEqual(6);

    const reload = result.current.reload;
    rerender();
    expect(result.current.reload).toBe(reload);
    expect(result.current.isSuccess).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('exposes an Error and recovers after retry', async () => {
    const { result } = renderHook(() => useRuns());
    await finishRequests();
    act(() => {
      void result.current.reload(true);
    });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
    await finishRequests();
    expect(result.current.status).toBe('error');
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBeInstanceOf(Error);

    act(() => {
      void result.current.reload();
    });
    await finishRequests();
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('cancels a previous failing request when a new request starts', async () => {
    const { result } = renderHook(() => useRuns());
    act(() => {
      void result.current.reload(true);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(400);
    });
    act(() => {
      void result.current.reload();
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(450);
    });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
    await finishRequests();
    expect(result.current.isSuccess).toBe(true);
  });

  it('cancels work on unmount and survives StrictMode effect cleanup', async () => {
    const { result, unmount } = renderHook(() => useRuns(), { wrapper: StrictMode });
    expect(vi.getTimerCount()).toBe(1);
    await finishRequests();
    expect(result.current.isSuccess).toBe(true);
    act(() => {
      void result.current.reload();
    });
    unmount();
    expect(vi.getTimerCount()).toBe(0);
    await finishRequests();
  });
});
