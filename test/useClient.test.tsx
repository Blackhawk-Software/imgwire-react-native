import type { ReactNode } from "react";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ImgwireProvider } from "../src/provider/ImgwireProvider.tsx";
import { useClient } from "../src/hooks/useClient.ts";

const imgwireConstructor = vi.fn();

vi.mock("@imgwire/js", () => {
  class ImgwireClient {
    options: { apiKey: string; fetch?: typeof fetch };

    constructor(options: { apiKey: string; fetch?: typeof fetch }) {
      this.options = options;
      imgwireConstructor(options);
    }
  }

  return {
    ImgwireClient
  };
});

describe("useClient", () => {
  it("returns the shared provider client", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ImgwireProvider config={{ apiKey: "pk_provider", fetch }}>
        {children}
      </ImgwireProvider>
    );

    const { result } = renderHook(() => useClient(), { wrapper });

    expect(result.current.options.apiKey).toBe("pk_provider");
    expect(imgwireConstructor).toHaveBeenCalledTimes(1);
  });

  it("creates an isolated client when config is provided", () => {
    const { result } = renderHook(() =>
      useClient({ apiKey: "pk_isolated", fetch })
    );

    expect(result.current.options.apiKey).toBe("pk_isolated");
  });

  it("reuses the isolated client when the config reference is unchanged", () => {
    const config = { apiKey: "pk_isolated", fetch };
    const { result, rerender } = renderHook(() => useClient(config));
    const firstClient = result.current;

    rerender();

    expect(result.current).toBe(firstClient);
  });

  it("prefers the provider client over a direct config", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ImgwireProvider config={{ apiKey: "pk_provider", fetch }}>
        {children}
      </ImgwireProvider>
    );

    const { result } = renderHook(
      () => useClient({ apiKey: "pk_isolated", fetch }),
      { wrapper }
    );

    expect(result.current.options.apiKey).toBe("pk_provider");
  });

  it("throws without a provider or config", () => {
    expect(() => renderHook(() => useClient())).toThrow(
      "useClient must be used within <ImgwireProvider /> or called with a config object."
    );
  });
});
