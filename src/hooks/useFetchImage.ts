import type { ImgwireImage } from "@imgwire/js";
import { useContext, useEffect, useState } from "react";
import { ImgwireContext } from "../context/ImgwireContext.ts";

export function useFetchImage(id: string): {
  data: ImgwireImage | null;
  isLoading: boolean;
  error: Error | null;
};
export function useFetchImage(
  id: string,
  options?: { enabled?: boolean },
): {
  data: ImgwireImage | null;
  isLoading: boolean;
  error: Error | null;
};
export function useFetchImage(
  id: string,
  options?: { enabled?: boolean },
): {
  data: ImgwireImage | null;
  isLoading: boolean;
  error: Error | null;
} {
  const client = useContext(ImgwireContext);
  const enabled = options?.enabled ?? true;
  const [data, setData] = useState<ImgwireImage | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(id) && enabled);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!enabled || !id) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    if (!client) {
      setData(null);
      setIsLoading(false);
      setError(
        new Error("useFetchImage must be used within <ImgwireProvider />."),
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    client.images
      .fetch(id)
      .then((image) => {
        if (cancelled) {
          return;
        }

        setData(image);
        setIsLoading(false);
      })
      .catch((cause) => {
        if (cancelled) {
          return;
        }

        setData(null);
        setError(
          cause instanceof Error ? cause : new Error("Failed to fetch image."),
        );
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [client, enabled, id]);

  return { data, isLoading, error };
}
