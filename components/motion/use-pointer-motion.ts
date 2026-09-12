"use client";

import { useEffect, useRef, type CSSProperties, type PointerEvent } from "react";

export function usePointerMotion(
  initial: CSSProperties,
  project: (x: number, y: number) => Record<string, string>,
) {
  const frame = useRef<number | null>(null);
  const active = useRef<HTMLElement | null>(null);
  const point = useRef({ x: 0, y: 0 });
  const enabled = useRef(false);

  useEffect(() => {
    const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const reset = () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
      if (active.current) {
        for (const [name, value] of Object.entries(initial)) {
          active.current.style.setProperty(name, String(value));
        }
      }
      active.current = null;
    };
    const updatePreference = () => {
      enabled.current = finePointer.matches && !reduced.matches;
      reset();
    };
    updatePreference();
    finePointer.addEventListener("change", updatePreference);
    reduced.addEventListener("change", updatePreference);
    window.addEventListener("resize", reset);
    window.addEventListener("scroll", reset, { passive: true });
    document.addEventListener("visibilitychange", reset);
    return () => {
      reset();
      finePointer.removeEventListener("change", updatePreference);
      reduced.removeEventListener("change", updatePreference);
      window.removeEventListener("resize", reset);
      window.removeEventListener("scroll", reset);
      document.removeEventListener("visibilitychange", reset);
    };
  }, [initial]);

  const reset = (event: PointerEvent<HTMLElement>) => {
    if (active.current !== event.currentTarget) return;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    for (const [name, value] of Object.entries(initial)) {
      event.currentTarget.style.setProperty(name, String(value));
    }
    active.current = null;
  };

  return {
    onPointerMove(event: PointerEvent<HTMLElement>) {
      if (!enabled.current || event.pointerType === "touch") return;
      active.current = event.currentTarget;
      point.current = { x: event.clientX, y: event.clientY };
      if (frame.current !== null) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        const element = active.current;
        if (!element || !enabled.current) return;
        // Measure the stationary hit area, never the artwork being transformed.
        const bounds = element.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        const x = Math.max(0, Math.min(1, (point.current.x - bounds.left) / bounds.width));
        const y = Math.max(0, Math.min(1, (point.current.y - bounds.top) / bounds.height));
        for (const [name, value] of Object.entries(project(x, y))) {
          element.style.setProperty(name, value);
        }
      });
    },
    onPointerLeave: reset,
    onPointerCancel: reset,
  };
}
