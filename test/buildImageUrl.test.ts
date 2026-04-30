import { describe, expect, it } from "vitest";
import { buildImageUrl } from "../src/utils/buildImageUrl.ts";

describe("buildImageUrl", () => {
  it("builds URLs with new @imgwire/js 0.3.1 transform values", () => {
    const url = new URL(
      buildImageUrl("https://cdn.imgwire.dev/example", {
        chroma_subsampling: "4:2:2",
        progressive: "auto",
        quality: "auto",
      }),
    );

    expect(Object.fromEntries(url.searchParams)).toEqual({
      chroma_subsampling: "4:2:2",
      progressive: "auto",
      quality: "auto",
    });
  });

  it.each([
    [true, "true"],
    [false, "false"],
  ] as const)("builds URLs with progressive=%s", (progressive, expected) => {
    const url = new URL(
      buildImageUrl("https://cdn.imgwire.dev/example", {
        progressive,
      }),
    );

    expect(url.searchParams.get("progressive")).toBe(expected);
  });

  it("canonicalizes q=auto to quality=auto", () => {
    const url = new URL(
      buildImageUrl("https://cdn.imgwire.dev/example", {
        q: "auto",
      }),
    );

    expect(url.searchParams.get("quality")).toBe("auto");
    expect(url.searchParams.has("q")).toBe(false);
  });
});
