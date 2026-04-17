import type { ImageProps as RNImageProps } from "react-native";
import { Image as RNImage } from "react-native";
import type { ImageUrlOptions } from "@imgwire/js";
import { useFetchImage } from "../hooks/useFetchImage.ts";
import { buildImageUrl } from "../utils/buildImageUrl.ts";
import {
  compactImageUrlOptions,
  omitImageTransformProps,
  pickImageUrlOptions,
} from "../utils/image-transforms.ts";

export type ImgwireImageProps = {
  id?: string;
  url?: string;
} & ImageUrlOptions &
  Omit<RNImageProps, "source">;

export function Image(props: ImgwireImageProps) {
  if (!props.id && !props.url) {
    throw new Error("<Image /> requires either an id or a url.");
  }

  const { data, error } = useFetchImage(props.id ?? "", {
    enabled: !props.url,
  });
  if (error) {
    throw error;
  }

  const baseUrl = props.url ?? data?.cdn_url;
  if (!baseUrl) {
    return null;
  }

  const sourceUrl = buildImageUrl(
    baseUrl,
    compactImageUrlOptions(pickImageUrlOptions(props)),
  );

  return (
    <RNImage {...omitImageTransformProps(props)} source={{ uri: sourceUrl }} />
  );
}
