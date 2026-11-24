"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function InteriorMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (
      !root.current ||
      !window.IntersectionObserver ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("has-entered");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    root.current
      .querySelectorAll("[data-reveal]")
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  return (
    <div className="interior-motion" ref={root}>
      {children}
    </div>
  );
}
