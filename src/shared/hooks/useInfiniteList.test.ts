import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { Paginated } from "@/shared/api/pagination";
import { useInfiniteList, type FetchPage } from "./useInfiniteList";

type Item = { id: string };

/** Page `page` of `total` items, `size` per page. */
const pageOf = (page: number, size = 2, total = 5): Paginated<Item> => ({
  items: Array.from(
    { length: Math.max(0, Math.min(size, total - (page - 1) * size)) },
    (_, i) => ({ id: String((page - 1) * size + i + 1) }),
  ),
  pagination: {
    page,
    pageSize: size,
    totalItems: total,
    totalPages: Math.ceil(total / size),
  },
});

const ids = (items: Item[]) => items.map((item) => item.id);

describe("useInfiniteList", () => {
  it("starts with the first page and appends the next ones", async () => {
    const fetchPage = vi.fn<FetchPage<Item>>(async (page) => pageOf(page));
    const first = pageOf(1);
    const { result } = renderHook(() => useInfiniteList(first, fetchPage));

    expect(ids(result.current.items)).toEqual(["1", "2"]);
    expect(result.current.hasMore).toBe(true);

    act(() => result.current.loadMore());
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(ids(result.current.items)).toEqual(["1", "2", "3", "4"]);

    act(() => result.current.loadMore());
    await waitFor(() => expect(result.current.hasMore).toBe(false));
    expect(ids(result.current.items)).toEqual(["1", "2", "3", "4", "5"]);
    expect(fetchPage.mock.calls.map(([page]) => page)).toEqual([2, 3]);

    // Nothing left: no more requests.
    act(() => result.current.loadMore());
    expect(fetchPage).toHaveBeenCalledTimes(2);
  });

  it("runs one request at a time", async () => {
    const fetchPage = vi.fn<FetchPage<Item>>(async (page) => pageOf(page));
    const first = pageOf(1);
    const { result } = renderHook(() => useInfiniteList(first, fetchPage));

    act(() => {
      result.current.loadMore();
      result.current.loadMore();
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(fetchPage).toHaveBeenCalledTimes(1);
  });

  it("skips items it already has (the pages shifted on the server)", async () => {
    // A note was added on the server: page 2 now starts with item 2 again.
    const fetchPage = vi.fn<FetchPage<Item>>(async () => ({
      ...pageOf(2),
      items: [{ id: "2" }, { id: "3" }],
    }));
    const first = pageOf(1);
    const { result } = renderHook(() => useInfiniteList(first, fetchPage));

    act(() => result.current.loadMore());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(ids(result.current.items)).toEqual(["1", "2", "3"]);
  });

  it("keeps what it has on an error, and retries", async () => {
    const fetchPage = vi
      .fn<FetchPage<Item>>()
      .mockRejectedValueOnce(new Error("offline"))
      .mockImplementation(async (page) => pageOf(page));
    const first = pageOf(1);
    const { result } = renderHook(() => useInfiniteList(first, fetchPage));

    act(() => result.current.loadMore());
    await waitFor(() => expect(result.current.error).toBeDefined());
    expect(ids(result.current.items)).toEqual(["1", "2"]);

    act(() => result.current.loadMore());
    await waitFor(() => expect(result.current.items).toHaveLength(4));
    expect(result.current.error).toBeUndefined();
  });

  it("starts over, cancelling the old request, when the first page changes", async () => {
    let signal: AbortSignal | undefined;
    const fetchPage = vi.fn<FetchPage<Item>>((_page, s) => {
      signal = s;
      return new Promise(() => {}); // never answers
    });
    const { result, rerender } = renderHook(
      ({ first }) => useInfiniteList(first, fetchPage),
      { initialProps: { first: pageOf(1) } },
    );
    act(() => result.current.loadMore());

    rerender({ first: pageOf(1, 2, 3) });

    expect(signal?.aborted).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(ids(result.current.items)).toEqual(["1", "2"]);
    expect(result.current.hasMore).toBe(true);
  });

  it("cancels a running request on unmount", () => {
    let signal: AbortSignal | undefined;
    const first = pageOf(1);
    const { result, unmount } = renderHook(() =>
      useInfiniteList(first, (_page, s) => {
        signal = s;
        return new Promise(() => {});
      }),
    );
    act(() => result.current.loadMore());

    unmount();

    expect(signal?.aborted).toBe(true);
  });
});
