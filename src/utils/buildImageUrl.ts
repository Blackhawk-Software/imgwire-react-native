import {
  ImageUrlBuilder,
  type ImageSchema,
  type ImageUrlOptions
} from "@imgwire/js";

const PLACEHOLDER_IMAGE: Omit<ImageSchema, "cdn_url"> = {
  created_at: "",
  custom_metadata: {},
  deleted_at: null,
  environment_id: null,
  exif_data: {},
  extension: "jpg",
  hash_sha256: null,
  height: 0,
  id: "",
  idempotency_key: null,
  mime_type: "image/jpeg",
  original_filename: "",
  processed_metadata_at: null,
  purpose: null,
  size_bytes: 0,
  status: "READY",
  updated_at: "",
  upload_token_id: null,
  width: 0
};

export function buildImageUrl(baseUrl: string, options?: ImageUrlOptions) {
  const builder = new ImageUrlBuilder({
    ...PLACEHOLDER_IMAGE,
    cdn_url: baseUrl
  });

  return builder.build(options);
}
