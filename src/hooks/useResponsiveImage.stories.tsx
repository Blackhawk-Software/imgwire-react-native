import type { Meta, StoryObj } from "@storybook/react-native";
import { Text, View } from "react-native";
import { useResponsiveImage } from "./useResponsiveImage.ts";
import { EXAMPLE_IMAGE_URL } from "../storybook/baseUrl.ts";

function ResponsiveImageDemo() {
  const uri = useResponsiveImage({
    url: EXAMPLE_IMAGE_URL,
    width: 390,
    breakpoints: [
      { minWidth: 0, width: 320, dpr: [1, 2] },
      { minWidth: 375, width: 768, dpr: [2, 3] },
    ],
  });

  return (
    <View style={{ padding: 16 }}>
      <Text selectable>{uri}</Text>
    </View>
  );
}

const meta = {
  title: "Hooks/useResponsiveImage",
  component: ResponsiveImageDemo,
  render: () => <ResponsiveImageDemo />,
} satisfies Meta<typeof ResponsiveImageDemo>;

export default meta;

export const Basic: StoryObj<typeof meta> = {};
