"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useMotionPreference } from "./motion-preference";

export default function MotionControls() {
  const { enabled, setEnabled } = useMotionPreference();
  return (
    <div
      className="motion-controls"
      aria-label="Animation controls"
      data-lenis-prevent
    >
      <button
        type="button"
        aria-label={enabled ? "Pause animations" : "Play animations"}
        aria-pressed={enabled}
        onClick={() => setEnabled(!enabled)}
      >
        {enabled ? <Pause size={13} /> : <Play size={13} />}
        <span>{enabled ? "Motion on" : "Motion off"}</span>
      </button>
      <span className="motion-controls-divider" />
      <button
        type="button"
        aria-label="Replay intro animation"
        title="Replay intro animation"
        onClick={() => {
          if (!enabled) {
            window.scrollTo(0, 0);
            setEnabled(true);
          } else {
            window.dispatchEvent(new Event("aarav:replay-intro"));
          }
        }}
      >
        <RotateCcw size={14} />
        <span className="replay-label">Replay</span>
      </button>
    </div>
  );
}
