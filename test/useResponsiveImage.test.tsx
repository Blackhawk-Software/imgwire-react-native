import type { ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PixelRatio } from "react-native";
import { ImgwireProvider } from "../src/provider/ImgwireProvider.tsx";
import { useResponsiveImage } from "../src/hooks/useResponsiveImage.ts";

const fetchImage = vi.fn();
const buildUrl = vi.fn();

vi.mock("@imgwire/js", () => {
  class ImgwireClient {
    images = {
      fetch: fetchImage,
    };

    constructor(public readonly options: Record<string, unknown>) {}
  }

  class ImageUrlBuilder {
    constructor(private readonly image: { cdn_url: string }) {}

    build(options?: Record<string, unknown>) {
      return buildUrl(this.image.cdn_url, options);
    }
  }

  return {
    ImageUrlBuilder,
    ImgwireClient,
  };
});

describe("useResponsiveImage", () => {
  afterEach(() => {
    fetchImage.mockReset();
    buildUrl.mockReset();
  });

  it("throws when id and url are both missing", () => {
    expect(() =>
      renderHook(() =>
        useResponsiveImage({
          width: 390,
        }),
      ),
    ).toThrow("useResponsiveImage requires either an id or a url.");
  });

  it("builds a url immediately when a base url is provided", () => {
    buildUrl.mockReturnValue("cdn.imgwire.dev/example?w=768&dpr=2");

    const { result } = renderHook(() =>
      useResponsiveImage({
        url: "cdn.imgwire.dev/example",
        width: 390,
        breakpoints: [
          { minWidth: 0, width: 320, dpr: [1, 2] },
          { minWidth: 375, width: 768, dpr: [2, 3] },
        ],
      }),
    );

    expect(result.current).toBe("cdn.imgwire.dev/example?w=768&dpr=2");
    expect(fetchImage).not.toHaveBeenCalled();
  });

  it("returns an empty string while an id-backed image is still resolving", () => {
    fetchImage.mockImplementation(() => new Promise(() => undefined));

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ImgwireProvider config={{ apiKey: "pk_responsive", fetch }}>
        {children}
      </ImgwireProvider>
    );

    const { result } = renderHook(
      () =>
        useResponsiveImage({
          id: "img_123",
          width: 390,
        }),
      { wrapper },
    );

    expect(result.current).toBe("");
  });

  it("resolves an image id and picks the matching breakpoint", async () => {
    const getPixelRatio = PixelRatio.get as unknown as {
      mockReturnValue(value: number): void;
    };
    getPixelRatio.mockReturnValue(2.5);
    fetchImage.mockResolvedValue({
      id: "img_123",
      cdn_url: "cdn.imgwire.dev/example",
      can_upload: true,
      is_directly_deliverable: true,
    });
    buildUrl.mockReturnValue("cdn.imgwire.dev/example?w=1024&dpr=3");

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ImgwireProvider config={{ apiKey: "pk_responsive", fetch }}>
        {children}
      </ImgwireProvider>
    );

    const { result } = renderHook(
      () =>
        useResponsiveImage({
          id: "img_123",
          width: 820,
          breakpoints: [
            { minWidth: 0, width: 320, dpr: [1, 2] },
            { minWidth: 768, width: 1024, dpr: [2, 3] },
          ],
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current).toBe("cdn.imgwire.dev/example?w=1024&dpr=3");
    });
  });

  it("falls back to the smallest breakpoint when width is below the minimum", () => {
    buildUrl.mockReturnValue("cdn.imgwire.dev/example?w=320&dpr=2");

    const { result } = renderHook(() =>
      useResponsiveImage({
        url: "cdn.imgwire.dev/example",
        width: 200,
        breakpoints: [
          { minWidth: 375, width: 768, dpr: [2, 3] },
          { minWidth: 320, width: 320, dpr: [1, 2] },
        ],
      }),
    );

    expect(result.current).toBe("cdn.imgwire.dev/example?w=320&dpr=2");
  });

  it("uses the device DPR when breakpoint candidates are not provided", () => {
    buildUrl.mockReturnValue("cdn.imgwire.dev/example?w=390&dpr=2");

    const { result } = renderHook(() =>
      useResponsiveImage({
        url: "cdn.imgwire.dev/example",
        width: 390,
      }),
    );

    expect(result.current).toBe("cdn.imgwire.dev/example?w=390&dpr=2");
  });

  it("passes merged transform options to the url builder", async () => {
    fetchImage.mockResolvedValue({
      id: "img_123",
      cdn_url: "cdn.imgwire.dev/example",
      can_upload: true,
      is_directly_deliverable: true,
    });
    buildUrl.mockReturnValue("cdn.imgwire.dev/example?w=768&dpr=2");

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ImgwireProvider config={{ apiKey: "pk_responsive", fetch }}>
        {children}
      </ImgwireProvider>
    );

    renderHook(
      () =>
        useResponsiveImage({
          id: "img_123",
          width: 390,
          chroma_subsampling: "4:4:4",
          format: "auto",
          progressive: "auto",
          quality: 70,
          breakpoints: [
            {
              minWidth: 375,
              width: 768,
              height: 400,
              quality: "auto",
              dpr: [1, 2],
            },
          ],
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(buildUrl).toHaveBeenLastCalledWith(
        "cdn.imgwire.dev/example",
        expect.objectContaining({
          dpr: 2,
          chroma_subsampling: "4:4:4",
          format: "auto",
          height: 400,
          progressive: "auto",
          quality: "auto",
          width: 768,
        }),
      );
    });
  });
});
