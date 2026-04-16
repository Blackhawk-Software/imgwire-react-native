declare module "@storybook/react-native" {
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
}
