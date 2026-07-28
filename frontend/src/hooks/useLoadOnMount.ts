"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { ApiError } from "@/lib/api";

export function useLoadOnMount(load: () => Promise<void>) {
  const [error, setError] = useState<string | null>(null);

  const onLoad = useEffectEvent(async () => {
    try {
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load");
    }
  });

  useEffect(() => {
    // Mount-time fetch for admin screens; state updates after the network response.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional data load on mount
    void onLoad();
  }, []);

  return { error, setError };
}
