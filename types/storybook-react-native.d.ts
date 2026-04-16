declare module "@storybook/react-native" {
  export type StorybookConfig = {
    stories: string[];
    addons: Array<string | { name: string }>;
    reactNative?: Record<string, unknown>;
    features?: Record<string, boolean>;
  };

  export type Meta<T = unknown> = {
    title: string;
    component?: T;
    args?: Record<string, unknown>;
    render?: (args: any) => any;
    parameters?: Record<string, unknown>;
  };

  export type StoryObj<T = unknown> = {
    args?: Record<string, unknown>;
    render?: (args: any) => any;
    parameters?: Record<string, unknown>;
  };

  export type View = {
    getStorybookUI(options?: Record<string, unknown>): unknown;
  };

  export type Features = Record<string, boolean>;

  export function start(args: {
    annotations: unknown[];
    storyEntries: unknown[];
    options?: Record<string, unknown>;
  }): View;

  export function updateView(
    view: View,
    annotations: unknown[],
    storyEntries: unknown[],
    options?: Record<string, unknown>,
  ): void;
}
