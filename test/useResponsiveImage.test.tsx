import type { ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
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
  it("builds a url immediately when a base url is provided", () => {
    buildUrl.mockReturnValue("https://cdn.imgwire.dev/example.jpg?w=768&dpr=2");

    const { result } = renderHook(() =>
      useResponsiveImage({
        url: "https://cdn.imgwire.dev/example.jpg",
        width: 390,
        breakpoints: [
          { minWidth: 0, width: 320, dpr: [1, 2] },
          { minWidth: 375, width: 768, dpr: [2, 3] },
        ],
      }),
    );

    expect(result.current).toBe(
      "https://cdn.imgwire.dev/example.jpg?w=768&dpr=2",
    );
    expect(fetchImage).not.toHaveBeenCalled();
  });

  it("resolves an image id and picks the matching breakpoint", async () => {
    const getPixelRatio = PixelRatio.get as unknown as {
      mockReturnValue(value: number): void;
    };
    getPixelRatio.mockReturnValue(2.5);
    fetchImage.mockResolvedValue({
      id: "img_123",
      cdn_url: "https://cdn.imgwire.dev/example.jpg",
    });
    buildUrl.mockReturnValue(
      "https://cdn.imgwire.dev/example.jpg?w=1024&dpr=3",
    );

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
      expect(result.current).toBe(
        "https://cdn.imgwire.dev/example.jpg?w=1024&dpr=3",
      );
    });
  });
});
