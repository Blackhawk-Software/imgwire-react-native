import type { ImageUrlOptions } from "@imgwire/js";

const IMAGE_TRANSFORM_KEYS = [
  "preset",
  "adjust",
  "a",
  "background",
  "bg",
  "background_alpha",
  "bga",
  "blur",
  "bl",
  "brightness",
  "br",
  "chroma_subsampling",
  "color_profile",
  "cp",
  "icc",
  "colorize",
  "col",
  "contrast",
  "co",
  "crop",
  "c",
  "dpi",
  "dpr",
  "duotone",
  "dt",
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
  "gradient",
  "gr",
  "gravity",
  "g",
  "height",
  "h",
  "hue",
  "hu",
  "keep_copyright",
  "kcr",
  "lightness",
  "l",
  "min-height",
  "min_height",
  "mh",
  "min-width",
  "min_width",
  "mw",
  "monochrome",
  "mc",
  "negate",
  "neg",
  "normalize",
  "normalise",
  "norm",
  "padding",
  "pd",
  "pixelate",
  "pix",
  "progressive",
  "quality",
  "q",
  "resizing_algorithm",
  "ra",
  "resizing_type",
  "rotate",
  "rot",
  "saturation",
  "sa",
  "sharpen",
  "sh",
  "strip_color_profile",
  "scp",
  "strip_metadata",
  "sm",
  "watermark",
  "wm",
  "watermark_position",
  "watermark_offset",
  "wmp",
  "watermark_rotate",
  "wm_rot",
  "wmr",
  "watermark_shadow",
  "wmsh",
  "watermark_size",
  "wms",
  "watermark_text",
  "wmt",
  "watermark_url",
  "wmu",
  "width",
  "w",
  "zoom",
  "z",
] as const satisfies readonly (keyof ImageUrlOptions)[];

const RESERVED_KEYS = new Set<string>(["id", "url", ...IMAGE_TRANSFORM_KEYS]);

export function pickImageUrlOptions(
  input: Record<string, unknown>,
): ImageUrlOptions {
  const options = Object.fromEntries(
    IMAGE_TRANSFORM_KEYS.flatMap((key) =>
      key in input ? [[key, input[key]]] : [],
    ),
  );

  return options as ImageUrlOptions;
}

export function compactImageUrlOptions(
  options: ImageUrlOptions,
): ImageUrlOptions {
  return Object.fromEntries(
    Object.entries(options).filter(([, value]) => value !== undefined),
  ) as ImageUrlOptions;
}

export function omitImageTransformProps<T extends Record<string, unknown>>(
  input: T,
) {
  return Object.fromEntries(
    Object.entries(input).filter(([key]) => !RESERVED_KEYS.has(key)),
  ) as Omit<T, keyof ImageUrlOptions | "id" | "url">;
}
