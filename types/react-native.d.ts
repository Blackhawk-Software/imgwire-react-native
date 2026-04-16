declare module "react-native" {
  import type { ComponentType } from "react";

  export type ImageSourcePropType = {
    uri: string;
  };

  export type ImageProps = {
    source?: ImageSourcePropType;
    style?: unknown;
    testID?: string;
    accessibilityLabel?: string;
    resizeMode?: "cover" | "contain" | "stretch" | "repeat" | "center";
    [key: string]: unknown;
  };

  export const Image: ComponentType<ImageProps>;
  export const View: ComponentType<Record<string, unknown>>;
  export const Text: ComponentType<Record<string, unknown>>;
  export const Button: ComponentType<Record<string, unknown>>;
  export const PixelRatio: {
    get(): number;
  };
}
