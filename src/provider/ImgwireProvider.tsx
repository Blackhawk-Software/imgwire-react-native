import { ImgwireClient, type ImgwireClientOptions } from "@imgwire/js";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { ImgwireContext } from "../context/ImgwireContext.ts";

export type ImgwireProviderProps = {
  config: ImgwireClientOptions;
  children: ReactNode;
};

export function ImgwireProvider({ config, children }: ImgwireProviderProps) {
  const client = useMemo(
    () => new ImgwireClient(config),
    [
      config.apiKey,
      config.baseUrl,
      config.timeoutMs,
      config.fetch,
      config.getUploadToken,
      config.xhrFactory
    ]
  );

  return (
    <ImgwireContext.Provider value={client}>{children}</ImgwireContext.Provider>
  );
}
