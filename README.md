# @imgwire/react-native

[![npm version](https://img.shields.io/npm/v/%40imgwire%2Freact-native)](https://www.npmjs.com/package/@imgwire/react-native)
[![CI](https://github.com/Blackhawk-Software/imgwire-react-native/actions/workflows/ci.yml/badge.svg)](https://github.com/Blackhawk-Software/imgwire-react-native/actions/workflows/ci.yml)
[![Release](https://github.com/Blackhawk-Software/imgwire-react-native/actions/workflows/release.yml/badge.svg)](https://github.com/Blackhawk-Software/imgwire-react-native/actions/workflows/release.yml)

`@imgwire/react-native` is the React Native SDK for imgwire. It provides a thin, TypeScript-first native layer on top of `@imgwire/js` so you can:

- share a single imgwire client through React context
- render transformed imgwire images with React Native primitives
- upload files from `file://` or app-local URIs with progress tracking
- build responsive transformation URLs manually for native layouts

Imgwire docs: https://imgwire.dev/docs

Underlying JavaScript SDK:

- [`@imgwire/js` repository](https://github.com/Blackhawk-Software/imgwire-js)

## Installation

```bash
yarn add @imgwire/react-native
```

Peer dependencies:

- `react >= 18`
- `react-native >= 0.70`

## Quick Start

Expo is the recommended starting point.

```bash
npx create-expo-app my-app
cd my-app
yarn add @imgwire/react-native
```

```tsx
import { ImgwireProvider, Image, useUpload } from "@imgwire/react-native";

export default function App() {
  return (
    <ImgwireProvider config={{ apiKey: "pk_123" }}>
      <Screen />
    </ImgwireProvider>
  );
}

function Screen() {
  const [upload, progress] = useUpload();

  return (
    <>
      <Image id="img_123" style={{ width: 300, height: 200 }} />
    </>
  );
}
```

## Upload Example

```ts
await upload({
  uri: "file:///path/to/image.jpg",
  name: "image.jpg",
  type: "image/jpeg"
});
```

`useUpload()` reads the URI into binary data and sends it through `@imgwire/js` using `uploadRawWithProgress(...)`, so the flow works in Expo and bare React Native without the browser `File` API.

## Key Concepts

### `ImgwireProvider`

Creates a shared `ImgwireClient` instance and exposes it through context.

```tsx
<ImgwireProvider config={{ apiKey: "pk_123" }}>
  <App />
</ImgwireProvider>
```

### `useClient`

Returns the provider client when one exists, or creates an isolated client when you pass config directly.

```tsx
const client = useClient();
const isolated = useClient({ apiKey: "pk_123" });
```

### `Image`

Bridges imgwire URL generation to React Native `Image`.

```tsx
<Image
  url="https://cdn.imgwire.dev/example.jpg"
  style={{ width: 300, height: 200 }}
  width={600}
  format="webp"
/>
```

If you pass `url`, rendering stays fully synchronous. If you pass `id`, the SDK fetches the image record first so it can reuse the canonical `cdn_url` from imgwire and then applies transformations.

### `useResponsiveImage`

Returns a manually selected native image URL for the current layout width.

```tsx
const uri = useResponsiveImage({
  id: "img_123",
  width: screenWidth,
  breakpoints: [
    { minWidth: 0, width: 320, dpr: [1, 2] },
    { minWidth: 768, width: 768, dpr: [2, 3] }
  ]
});
```

## Compatibility

- Expo supported
- iOS and Android supported
- Bare React Native supported

## Development

```bash
yarn install
yarn build
yarn storybook
```

Validation commands:

```bash
yarn typecheck
yarn test
yarn ci
```

Storybook stories are included for:

- `Image`
- upload hook demo
- responsive hook demo
- provider setup

## Contributing

- Follow existing patterns from the sibling Imgwire SDKs.
- Keep the React Native layer thin over `@imgwire/js`.
- Maintain strict TypeScript typing.
- Add or update Storybook stories when changing public behavior.

## License

MIT. See [LICENSE](./LICENSE).
