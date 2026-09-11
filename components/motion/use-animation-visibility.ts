"use client";

import { useEffect, useRef } from "react";
import styles from "./animation-visibility.module.css";

export function useAnimationVisibility() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let nearViewport = true;
    const update = () => {
      element.dataset.motionPaused = String(document.hidden || !nearViewport);
    };

    element.classList.add(styles.boundary);
    const observer = typeof IntersectionObserver === "undefined" ? null :
      new IntersectionObserver(([entry]) => {
        nearViewport = entry.isIntersecting;
        update();
      }, { rootMargin: "120px" });

    observer?.observe(element);
    document.addEventListener("visibilitychange", update);
    update();

    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", update);
      element.classList.remove(styles.boundary);
      delete element.dataset.motionPaused;
    };
  }, []);

  return ref;
}
