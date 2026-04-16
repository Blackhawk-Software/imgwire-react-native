import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { Button, Text, View } from "react-native";
import { ImgwireProvider } from "../provider/ImgwireProvider.tsx";
import { useUpload } from "./useUpload.ts";

function UploadDemo() {
  const [upload, progress] = useUpload();
  const [status, setStatus] = useState("idle");

  return (
    <View style={{ gap: 12, padding: 16 }}>
      <Button
        title="Upload Demo File"
        onPress={() => {
          setStatus("uploading");
          void upload({
            uri: "file:///tmp/example.jpg",
            name: "example.jpg",
            type: "image/jpeg",
          })
            .then(() => {
              setStatus("complete");
            })
            .catch(() => {
              setStatus("error");
            });
        }}
      />
      <Text>Status: {status}</Text>
      <Text>Progress: {progress.percent ?? 0}%</Text>
    </View>
  );
}

const meta = {
  title: "Hooks/useUpload",
  component: UploadDemo,
  render: () => (
    <ImgwireProvider config={{ apiKey: "pk_demo" }}>
      <UploadDemo />
    </ImgwireProvider>
  ),
} satisfies Meta<typeof UploadDemo>;

export default meta;

export const Basic: StoryObj<typeof meta> = {};
