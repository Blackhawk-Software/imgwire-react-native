import React from "react";
import { vi } from "vitest";

export const Button = (props: Record<string, unknown>) =>
  React.createElement("button", props);

export const Image = ({
  source,
  ...props
}: {
  source?: { uri: string };
  [key: string]: unknown;
}) =>
  React.createElement("div", {
    ...props,
    "data-testid": "rn-image",
    "data-source-uri": source?.uri ?? ""
  });

export const PixelRatio = {
  get: vi.fn(() => 2)
};

export const Text = (props: Record<string, unknown>) =>
  React.createElement("span", props);

export const View = (props: Record<string, unknown>) =>
  React.createElement("div", props);
