import type { ImagesUploadOptions, ImgwireImage } from "@imgwire/js";
import { useState } from "react";
import { useClient } from "./useClient.ts";

export type UploadableFile = {
  uri: string;
  name?: string;
  type?: string;
};

export type UploadProgress = {
  loaded: number;
  total: number | null;
  percent: number | null;
  lengthComputable: boolean;
};

const INITIAL_PROGRESS: UploadProgress = {
  loaded: 0,
  total: null,
  percent: null,
  lengthComputable: false
};

export function useUpload(): [
  (file: UploadableFile, options?: ImagesUploadOptions) => Promise<ImgwireImage>,
  UploadProgress
] {
  const client = useClient();
  const [progress, setProgress] = useState<UploadProgress>(INITIAL_PROGRESS);

  async function upload(
    file: UploadableFile,
    options?: ImagesUploadOptions
  ): Promise<ImgwireImage> {
    setProgress(INITIAL_PROGRESS);

    const resolved = await readUploadableFile(file);

    return client.images.uploadRawWithProgress({
      contentLength: resolved.contentLength,
      customMetadata: options?.customMetadata,
      data: resolved.data,
      fileName: options?.fileName ?? resolved.fileName,
      getUploadToken: options?.getUploadToken,
      hashSha256: options?.hashSha256,
      idempotencyKey: options?.idempotencyKey,
      mimeType: options?.mimeType ?? resolved.mimeType,
      onProgress(nextProgress) {
        setProgress({
          loaded: nextProgress.loaded,
          total: nextProgress.total,
          percent: nextProgress.percent,
          lengthComputable: nextProgress.lengthComputable
        });
        options?.onProgress?.(nextProgress);
      },
      purpose: options?.purpose,
      requestInit: options?.requestInit,
      signal: options?.signal,
      uploadToken: options?.uploadToken
    });
  }

  return [upload, progress];
}

async function readUploadableFile(file: UploadableFile): Promise<{
  data: ArrayBuffer;
  contentLength: number;
  fileName: string;
  mimeType?: ImagesUploadOptions["mimeType"];
}> {
  const fetchApi = globalThis.fetch;
  if (!fetchApi) {
    throw new Error(
      "Imgwire React Native uploads require a fetch implementation to read file URIs."
    );
  }

  const response = await fetchApi(file.uri);
  if (!response.ok) {
    throw new Error(`Failed to read upload file: ${response.status}`);
  }

  const data = await response.arrayBuffer();
  const fileName = file.name ?? inferFileName(file.uri);
  const mimeType = (file.type ??
    response.headers.get("content-type") ??
    undefined) as ImagesUploadOptions["mimeType"];

  return {
    data,
    contentLength: data.byteLength,
    fileName,
    mimeType
  };
}

function inferFileName(uri: string): string {
  const normalized = uri.split("?")[0] ?? uri;
  const lastSegment = normalized.split("/").filter(Boolean).pop();
  return lastSegment ? decodeURIComponent(lastSegment) : "upload";
}
