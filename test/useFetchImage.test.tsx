import type { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ImgwireProvider } from "../src/provider/ImgwireProvider.tsx";
import { useFetchImage } from "../src/hooks/useFetchImage.ts";

const fetchImage = vi.fn();

vi.mock("@imgwire/js", () => {
  class ImgwireClient {
    options: Record<string, unknown>;
    images = {
      fetch: fetchImage,
    };

    constructor(options: Record<string, unknown>) {
      this.options = options;
    }
  }

  return {
    ImgwireClient,
  };
});

describe("useFetchImage", () => {
  afterEach(() => {
    fetchImage.mockReset();
  });

  it("returns fetched image data", async () => {
    fetchImage.mockResolvedValue({
      id: "img_123",
      cdn_url: "https://cdn.imgwire.dev/example.jpg",
    });

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ImgwireProvider config={{ apiKey: "pk_fetch", fetch }}>
        {children}
      </ImgwireProvider>
    );

    const { result } = renderHook(() => useFetchImage("img_123"), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual({
      id: "img_123",
      cdn_url: "https://cdn.imgwire.dev/example.jpg",
    });
    expect(result.current.error).toBeNull();
  });

  it("returns an error when the fetch fails", async () => {
    fetchImage.mockRejectedValue(new Error("boom"));

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ImgwireProvider config={{ apiKey: "pk_fetch", fetch }}>
        {children}
      </ImgwireProvider>
    );

    const { result } = renderHook(() => useFetchImage("img_123"), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error?.message).toBe("boom");
  });

  it("stays idle when no image id is provided", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ImgwireProvider config={{ apiKey: "pk_fetch", fetch }}>
        {children}
      </ImgwireProvider>
    );

    const { result } = renderHook(() => useFetchImage(""), { wrapper });

    expect(result.current).toEqual({
      data: null,
      error: null,
      isLoading: false,
    });
    expect(fetchImage).not.toHaveBeenCalled();
  });

  it("returns an explicit error when no provider is available", () => {
    const { result } = renderHook(() => useFetchImage("img_123"));

    return waitFor(() => {
      expect(result.current.data).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error?.message).toBe(
        "useFetchImage must be used within <ImgwireProvider />.",
      );
    });
  });

  it("refetches when the image id changes", async () => {
    fetchImage
      .mockResolvedValueOnce({
        id: "img_1",
        cdn_url: "https://cdn.imgwire.dev/1.jpg",
      })
      .mockResolvedValueOnce({
        id: "img_2",
        cdn_url: "https://cdn.imgwire.dev/2.jpg",
      });

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ImgwireProvider config={{ apiKey: "pk_fetch", fetch }}>
        {children}
      </ImgwireProvider>
    );

    const { result, rerender } = renderHook(({ id }) => useFetchImage(id), {
      initialProps: { id: "img_1" },
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.data?.id).toBe("img_1");
    });

    await act(async () => {
      rerender({ id: "img_2" });
    });

    await waitFor(() => {
      expect(result.current.data?.id).toBe("img_2");
    });

    expect(fetchImage).toHaveBeenCalledTimes(2);
  });
});
