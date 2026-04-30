import type { ImageUrlOptions } from "@imgwire/js";
import { PixelRatio } from "react-native";
import type {
  CropValue,
  GravityValue,
  OutputFormat,
  QualityValue,
} from "../types.ts";
import { useFetchImage } from "./useFetchImage.ts";
import { buildImageUrl } from "../utils/buildImageUrl.ts";
import { compactImageUrlOptions } from "../utils/image-transforms.ts";

export type ResponsiveBreakpoint = {
  minWidth: number;
  width: number;
  height?: number;
  dpr?: number[];
  crop?: CropValue;
  gravity?: GravityValue;
  quality?: QualityValue;
  format?: OutputFormat;
};

export function useResponsiveImage(
  options: {
    id?: string;
    url?: string;
    width: number;
    breakpoints?: ResponsiveBreakpoint[];
  } & ImageUrlOptions,
): string {
  const { id, url, width, breakpoints, ...restTransforms } = options;
  const baseTransforms = restTransforms as ImageUrlOptions;

  if (!id && !url) {
    throw new Error("useResponsiveImage requires either an id or a url.");
  }

  const image = useFetchImage(id ?? "", {
    enabled: !url,
  });
  if (image.error) {
    throw image.error;
  }

  const baseUrl = url ?? image.data?.cdn_url;
  if (!baseUrl) {
    return "";
  }

  const breakpoint = selectBreakpoint(width, breakpoints);
  const dpr = selectDpr(PixelRatio.get(), breakpoint?.dpr);

  return buildImageUrl(
    baseUrl,
    compactImageUrlOptions({
      ...baseTransforms,
      crop: breakpoint?.crop ?? baseTransforms.crop,
      dpr,
      format: breakpoint?.format ?? baseTransforms.format,
      gravity: breakpoint?.gravity ?? baseTransforms.gravity,
      height: breakpoint?.height ?? baseTransforms.height,
      quality: breakpoint?.quality ?? baseTransforms.quality,
      width: breakpoint?.width ?? baseTransforms.width ?? Math.ceil(width),
    }),
  );
}

function selectBreakpoint(
  width: number,
  breakpoints?: ResponsiveBreakpoint[],
): ResponsiveBreakpoint | undefined {
  if (!breakpoints || breakpoints.length === 0) {
    return undefined;
  }

  const sorted = breakpoints
    .slice()
    .sort((left, right) => left.minWidth - right.minWidth);

  return (
    sorted.filter((breakpoint) => width >= breakpoint.minWidth).pop() ??
    sorted[0]
  );
}

function selectDpr(deviceDpr: number, candidates?: number[]): number {
  if (!candidates || candidates.length === 0) {
    return deviceDpr;
  }

  const sorted = candidates.slice().sort((left, right) => left - right);
  return (
    sorted.find((candidate) => candidate >= deviceDpr) ?? sorted.at(-1) ?? 1
  );
}
