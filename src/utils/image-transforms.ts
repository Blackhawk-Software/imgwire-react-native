import type { ImageUrlOptions } from "@imgwire/js";

const IMAGE_TRANSFORM_KEYS = [
  "preset",
  "background",
  "bg",
  "blur",
  "bl",
  "crop",
  "c",
  "dpr",
  "enlarge",
  "el",
  "extend",
  "ex",
  "extend_aspect_ratio",
  "extend_ar",
  "exar",
  "flip",
  "fl",
  "format",
  "f",
  "extension",
  "ext",
  "gravity",
  "g",
  "height",
  "h",
  "keep_copyright",
  "kcr",
  "min-height",
  "mh",
  "min-width",
  "mw",
  "padding",
  "pd",
  "pixelate",
  "pix",
  "quality",
  "q",
  "resizing_type",
  "rotate",
  "rot",
  "sharpen",
  "sh",
  "strip_color_profile",
  "scp",
  "strip_metadata",
  "sm",
  "width",
  "w",
  "zoom",
  "z"
] as const satisfies readonly (keyof ImageUrlOptions)[];

const RESERVED_KEYS = new Set<string>(["id", "url", ...IMAGE_TRANSFORM_KEYS]);

export function pickImageUrlOptions(input: Record<string, unknown>): ImageUrlOptions {
  const options = Object.fromEntries(
    IMAGE_TRANSFORM_KEYS.flatMap((key) =>
      key in input ? [[key, input[key]]] : []
    )
  );

  return options as ImageUrlOptions;
}

export function compactImageUrlOptions(options: ImageUrlOptions): ImageUrlOptions {
  return Object.fromEntries(
    Object.entries(options).filter(([, value]) => value !== undefined)
  ) as ImageUrlOptions;
}

export function omitImageTransformProps<T extends Record<string, unknown>>(input: T) {
  return Object.fromEntries(
    Object.entries(input).filter(([key]) => !RESERVED_KEYS.has(key))
  ) as Omit<T, keyof ImageUrlOptions | "id" | "url">;
}
