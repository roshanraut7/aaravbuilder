"use client";

import { useSyncExternalStore } from "react";

const key = "aarav-motion";
const changeEvent = "aarav:motion-change";
const query = "(prefers-reduced-motion: reduce)";
let sessionPreference: "full" | "reduced" | undefined;

function getSnapshot() {
  if (sessionPreference) return sessionPreference;
  try {
    const saved = localStorage.getItem(key);
    if (saved === "full" || saved === "reduced") return saved;
  } catch {
    /* Fall back to the system preference when storage is unavailable. */
  }
  return window.matchMedia(query).matches ? "reduced" : "full";
}

function subscribe(callback: () => void) {
  const media = window.matchMedia(query);
  const onStorage = () => {
    sessionPreference = undefined;
    callback();
  };
  media.addEventListener("change", callback);
  window.addEventListener(changeEvent, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    media.removeEventListener("change", callback);
    window.removeEventListener(changeEvent, callback);
    window.removeEventListener("storage", onStorage);
  };
}

const serverPreference = () => "reduced" as const;

export function useMotionPreference() {
  const mode = useSyncExternalStore(subscribe, getSnapshot, serverPreference);
  const setEnabled = (enabled: boolean) => {
    sessionPreference = enabled ? "full" : "reduced";
    try {
      localStorage.setItem(key, sessionPreference);
    } catch {
      /* Session choice still works. */
    }
    window.dispatchEvent(new Event(changeEvent));
  };
  return { enabled: mode === "full", setEnabled };
}
