import type {
  ImageSchema,
  ImagesCreateOptions,
  ImageUrlOptions,
  ImageUrlPreset,
  ImgwireClient,
  ImgwireClientOptions,
  ImgwireImage,
  ImagesUploadOptions,
  BooleanLike,
  CropValue,
  ExtendValue,
  FlipValue,
  GravityValue,
  OutputFormat,
  PaddingValue,
  ResizingType,
  RotateAngle
} from "@imgwire/js";
import type {
  UploadableFile,
  UploadProgress
} from "./hooks/useUpload.ts";

export type ClientOptions = ImgwireClientOptions;
export type ImgwireImageData = ImgwireImage;
export type ImageMetadata = ImageSchema;
export type ImageTransforms = ImageUrlOptions;
export type CreateImageOptions = ImagesCreateOptions;
export type UploadOptions = ImagesUploadOptions;
export type ImgwireReactNativeClient = ImgwireClient;
export type { UploadableFile, UploadProgress };
export type {
  BooleanLike,
  CropValue,
  ExtendValue,
  FlipValue,
  GravityValue,
  ImageUrlPreset,
  OutputFormat,
  PaddingValue,
  ResizingType,
  RotateAngle
};
