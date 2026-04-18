import { describe, expect, it, vi } from "vitest";
import { createImage } from "../src/createImage.ts";

const createImageRequest = vi.fn();

vi.mock("@imgwire/js", () => {
  class ImgwireClient {
    images = {
      create: createImageRequest,
    };

    constructor(public readonly options: Record<string, unknown>) {}
  }

  return {
    ImgwireClient,
  };
});

describe("createImage", () => {
  it("uses an existing client instance when provided", async () => {
    createImageRequest.mockResolvedValue({
      image: {
        id: "img_123",
        can_upload: true,
        is_directly_deliverable: true,
      },
      upload_url: "https://upload.imgwire.dev/presigned",
    });

    const client = {
      images: {
        create: createImageRequest,
      },
    } as any;

    await expect(
      createImage({
        body: {
          content_length: 10,
          file_name: "example.jpg",
        },
        client,
      }),
    ).resolves.toEqual({
      image: {
        id: "img_123",
        can_upload: true,
        is_directly_deliverable: true,
      },
      uploadUrl: "https://upload.imgwire.dev/presigned",
    });
  });

  it("creates a client from config when needed", async () => {
    createImageRequest.mockResolvedValue({
      image: {
        id: "img_456",
        can_upload: true,
        is_directly_deliverable: true,
      },
      upload_url: "https://upload.imgwire.dev/another",
    });

    await expect(
      createImage({
        body: {
          content_length: 10,
          file_name: "example.jpg",
        },
        config: { apiKey: "pk_123", fetch },
      }),
    ).resolves.toEqual({
      image: {
        id: "img_456",
        can_upload: true,
        is_directly_deliverable: true,
      },
      uploadUrl: "https://upload.imgwire.dev/another",
    });
  });

  it("throws when neither a client nor config is provided", async () => {
    await expect(
      createImage({
        body: {
          content_length: 10,
          file_name: "example.jpg",
        },
      }),
    ).rejects.toThrow(
      "createImage requires either a client instance or a config object.",
    );
  });
});
