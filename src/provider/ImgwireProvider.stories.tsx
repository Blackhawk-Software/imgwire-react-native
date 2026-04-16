import type { Meta, StoryObj } from "@storybook/react-native";
import { Text } from "react-native";
import { ImgwireProvider } from "./ImgwireProvider.tsx";

const meta = {
  title: "Provider/ImgwireProvider",
  component: ImgwireProvider,
  render: () => (
    <ImgwireProvider config={{ apiKey: "pk_demo" }}>
      <Text>Imgwire provider is mounted.</Text>
    </ImgwireProvider>
  )
} satisfies Meta<typeof ImgwireProvider>;

export default meta;

export const Basic: StoryObj<typeof meta> = {};
