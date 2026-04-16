import { ImgwireClient, type ImgwireClientOptions } from "@imgwire/js";
import { useContext, useRef } from "react";
import { ImgwireContext } from "../context/ImgwireContext.ts";

export function useClient(): ImgwireClient;
export function useClient(config: ImgwireClientOptions): ImgwireClient;
export function useClient(config?: ImgwireClientOptions): ImgwireClient {
  const sharedClient = useContext(ImgwireContext);
  const isolatedClientRef = useRef<ImgwireClient | null>(null);
  const lastConfigRef = useRef<ImgwireClientOptions | undefined>(undefined);

  if (sharedClient) {
    return sharedClient;
  }

  if (!config) {
    throw new Error(
      "useClient must be used within <ImgwireProvider /> or called with a config object."
    );
  }

  if (isolatedClientRef.current === null || lastConfigRef.current !== config) {
    isolatedClientRef.current = new ImgwireClient(config);
    lastConfigRef.current = config;
  }

  return isolatedClientRef.current;
}
