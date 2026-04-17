import type { ReactNode } from "react";
import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ImgwireProvider } from "../src/provider/ImgwireProvider.tsx";
import { Image } from "../src/components/Image.tsx";

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

describe("Image", () => {
  afterEach(() => {
    cleanup();
    fetchImage.mockReset();
    buildUrl.mockReset();
  });

  it("throws when id and url are both missing", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ImgwireProvider config={{ apiKey: "pk_image", fetch }}>
        {children}
      </ImgwireProvider>
    );

    expect(() =>
      render(<Image style={{ width: 100, height: 100 }} />, { wrapper }),
    ).toThrow("<Image /> requires either an id or a url.");
  });

  it("renders synchronously when a url is provided", () => {
    buildUrl.mockReturnValue("https://cdn.imgwire.dev/example.jpg?width=320");

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ImgwireProvider config={{ apiKey: "pk_image", fetch }}>
        {children}
      </ImgwireProvider>
    );

    const { getByTestId } = render(
      <Image
        url="https://cdn.imgwire.dev/example.jpg"
        width={320}
        style={{ width: 160, height: 100 }}
      />,
      { wrapper },
    );

    expect(getByTestId("rn-image").getAttribute("data-source-uri")).toBe(
      "https://cdn.imgwire.dev/example.jpg?width=320",
    );
    expect(fetchImage).not.toHaveBeenCalled();
  });

  it("prefers a direct url over an id-backed fetch", () => {
    buildUrl.mockReturnValue("https://cdn.imgwire.dev/direct.jpg?width=320");

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ImgwireProvider config={{ apiKey: "pk_image", fetch }}>
        {children}
      </ImgwireProvider>
    );

    const { container } = render(
      <Image
        id="img_123"
        url="https://cdn.imgwire.dev/direct.jpg"
        width={320}
        style={{ width: 160, height: 100 }}
      />,
      { wrapper },
    );

    expect(
      container
        .querySelector('[data-testid="rn-image"]')
        ?.getAttribute("data-source-uri"),
    ).toBe("https://cdn.imgwire.dev/direct.jpg?width=320");
    expect(fetchImage).not.toHaveBeenCalled();
  });

  it("fetches by id before rendering when only an image id is provided", async () => {
    fetchImage.mockResolvedValue({
      id: "img_123",
      cdn_url: "https://cdn.imgwire.dev/example.jpg",
    });
    buildUrl.mockReturnValue("https://cdn.imgwire.dev/example.jpg?width=640");

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ImgwireProvider config={{ apiKey: "pk_image", fetch }}>
        {children}
      </ImgwireProvider>
    );

    const { container } = render(
      <Image id="img_123" width={640} style={{ width: 320, height: 200 }} />,
      { wrapper },
    );

    await waitFor(() => {
      expect(
        container
          .querySelector('[data-testid="rn-image"]')
          ?.getAttribute("data-source-uri"),
      ).toBe("https://cdn.imgwire.dev/example.jpg?width=640");
    });
  });

  it("does not pass transform props through to the underlying RN image", () => {
    buildUrl.mockReturnValue("https://cdn.imgwire.dev/example.jpg?width=320");

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ImgwireProvider config={{ apiKey: "pk_image", fetch }}>
        {children}
      </ImgwireProvider>
    );

    const { container } = render(
      <Image
        url="https://cdn.imgwire.dev/example.jpg"
        width={320}
        resizeMode="cover"
        style={{ width: 160, height: 100 }}
      />,
      { wrapper },
    );

    const image = container.querySelector('[data-testid="rn-image"]');
    expect(image?.getAttribute("resizemode")).toBe("cover");
    expect(image?.getAttribute("width")).toBeNull();
  });

  it("renders nothing while an id-backed image is still resolving", () => {
    fetchImage.mockImplementation(() => new Promise(() => undefined));

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ImgwireProvider config={{ apiKey: "pk_image", fetch }}>
        {children}
      </ImgwireProvider>
    );

    const { container } = render(<Image id="img_123" />, { wrapper });

    expect(container.querySelector('[data-testid="rn-image"]')).toBeNull();
  });
});
