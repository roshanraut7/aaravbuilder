"use client";

import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";

function getSnapshot() {
  return window.matchMedia(query).matches ? "reduced" : "full";
}

function subscribe(callback: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", callback);
  return () => {
    media.removeEventListener("change", callback);
  };
}

const serverPreference = () => "reduced" as const;

export function useMotionPreference() {
  const mode = useSyncExternalStore(subscribe, getSnapshot, serverPreference);
  return { enabled: mode === "full" };
}
