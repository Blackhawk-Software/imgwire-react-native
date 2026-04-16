import {
  ImgwireClient,
  type ImagesCreateOptions,
  type StandardUploadCreateSchema
} from "@imgwire/js";
import type { ClientOptions } from "./types.ts";

export type CreateImageArgs = {
  body: StandardUploadCreateSchema;
  client?: ImgwireClient;
  config?: ClientOptions;
  options?: ImagesCreateOptions;
};

export async function createImage({
  body,
  client,
  config,
  options
}: CreateImageArgs): Promise<{
  uploadUrl: string;
  image: Awaited<ReturnType<ImgwireClient["images"]["create"]>>["image"];
}> {
  const resolvedClient =
    client ?? (config ? new ImgwireClient(config) : undefined);

  if (!resolvedClient) {
    throw new Error(
      "createImage requires either a client instance or a config object."
    );
  }

  const response = await resolvedClient.images.create(body, options);

  return {
    uploadUrl: response.upload_url,
    image: response.image
  };
}
