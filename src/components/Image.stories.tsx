import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { Image } from "./Image.tsx";
import { EXAMPLE_IMAGE_URL } from "../storybook/baseUrl.ts";

const meta = {
  title: "Components/Image",
  component: Image,
  args: {
    style: { width: 280, height: 180 },
    url: EXAMPLE_IMAGE_URL
  },
  render: (args) => (
    <View style={{ padding: 16 }}>
      <Image {...args} />
    </View>
  )
} satisfies Meta<typeof Image>;

export default meta;

export const Basic: StoryObj<typeof meta> = {};

export const Transformed: StoryObj<typeof meta> = {
  args: {
    style: { width: 280, height: 180 },
    url: EXAMPLE_IMAGE_URL,
    width: 560,
    height: 360,
    format: "webp",
    quality: 80
  }
};
