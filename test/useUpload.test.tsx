import type { ReactNode } from "react";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ImgwireProvider } from "../src/provider/ImgwireProvider.tsx";
import { useUpload } from "../src/hooks/useUpload.ts";

const uploadRawWithProgress = vi.fn();
const fetchFile = vi.fn();

vi.mock("@imgwire/js", () => {
  class ImgwireClient {
    options: Record<string, unknown>;
    images = {
      uploadRawWithProgress
    };

    constructor(options: Record<string, unknown>) {
      this.options = options;
    }
  }

  return {
    ImgwireClient
  };
});

describe("useUpload", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", fetchFile);
  });

  afterEach(() => {
    uploadRawWithProgress.mockReset();
    fetchFile.mockReset();
    vi.unstubAllGlobals();
  });

  it("uploads through the client and updates progress state", async () => {
    const onProgress = vi.fn();
    fetchFile.mockResolvedValue({
      ok: true,
      headers: { get: () => "image/jpeg" },
      arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer
    });
    uploadRawWithProgress.mockImplementation(
      async (input: { onProgress?: (progress: any) => void }) => {
        input.onProgress?.({
          loaded: 50,
          total: 100,
          percent: 50,
          lengthComputable: true
        });

        return { id: "img_uploaded" };
      }
    );

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ImgwireProvider config={{ apiKey: "pk_upload", fetch }}>
        {children}
      </ImgwireProvider>
    );

    const { result } = renderHook(() => useUpload(), { wrapper });

    await act(async () => {
      const image = await result.current[0](
        {
          uri: "file:///tmp/example.jpg"
        },
        { onProgress }
      );
      expect(image).toEqual({ id: "img_uploaded" });
    });

    expect(fetchFile).toHaveBeenCalledWith("file:///tmp/example.jpg");
    expect(uploadRawWithProgress).toHaveBeenCalledTimes(1);
    expect(uploadRawWithProgress).toHaveBeenCalledWith(
      expect.objectContaining({
        contentLength: 3,
        fileName: "example.jpg",
        mimeType: "image/jpeg"
      })
    );
    expect(onProgress).toHaveBeenCalledWith({
      loaded: 50,
      total: 100,
      percent: 50,
      lengthComputable: true
    });
    expect(result.current[1]).toEqual({
      loaded: 50,
      total: 100,
      percent: 50,
      lengthComputable: true
    });
  });

  it("resets progress before each upload attempt", async () => {
    fetchFile.mockResolvedValue({
      ok: true,
      headers: { get: () => "image/jpeg" },
      arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer
    });

    let callCount = 0;
    let resolveSecondUpload:
      | ((value: { id: string }) => void)
      | undefined;

    uploadRawWithProgress.mockImplementation(
      async (input: { onProgress?: (progress: any) => void }) => {
        callCount += 1;

        if (callCount === 1) {
          input.onProgress?.({
            loaded: 100,
            total: 100,
            percent: 100,
            lengthComputable: true
          });

          return { id: "img_1" };
        }

        return new Promise<{ id: string }>((resolve) => {
          resolveSecondUpload = resolve;
        });
      }
    );

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ImgwireProvider config={{ apiKey: "pk_upload", fetch }}>
        {children}
      </ImgwireProvider>
    );

    const { result } = renderHook(() => useUpload(), { wrapper });

    await act(async () => {
      await result.current[0]({
        uri: "file:///tmp/example.jpg"
      });
    });

    expect(result.current[1].percent).toBe(100);

    await act(async () => {
      void result.current[0]({
        uri: "file:///tmp/example.jpg"
      });
      await Promise.resolve();
    });

    expect(result.current[1]).toEqual({
      loaded: 0,
      total: null,
      percent: null,
      lengthComputable: false
    });

    await act(async () => {
      resolveSecondUpload?.({ id: "img_2" });
    });
  });
});
