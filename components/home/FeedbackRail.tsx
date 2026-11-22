"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeToMotion(onChange: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** Native scrolling remains available when enhancement or autoplay is disabled. */
export function FeedbackRail({ children, count }: { children: ReactNode; count: number }) {
  const rail = useRef<HTMLDivElement>(null);
  const id = useId();
  const [position, setPosition] = useState(0);
  const reducedMotion = useSyncExternalStore(
    subscribeToMotion,
    () => window.matchMedia(motionQuery).matches,
    () => true,
  );
  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    element.parentElement?.classList.add("feedback-ready");
    const update = () => setPosition(Math.round(element.scrollLeft / element.clientWidth));
    element.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      element.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const element = rail.current;
    const browser = element?.parentElement;
    if (!element || !browser || count < 2 || reducedMotion || !window.IntersectionObserver) return;

    let visible = false;
    let hovered = browser.matches(":hover");
    let focused = browser.contains(document.activeElement);
    let timer: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      clearTimeout(timer);
      if (!visible || hovered || focused || document.hidden) return;
      timer = setTimeout(() => {
        const current = Math.round(element.scrollLeft / element.clientWidth);
        const next = (current + 1) % count;
        element.scrollTo({
          left: next * element.clientWidth,
          // Avoid panning across every intervening quote when returning to the start.
          behavior: next === 0 ? "instant" : "smooth",
        });
      }, 6_000);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
      schedule();
    }, { threshold: 0.5 });
    const enter = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      hovered = true;
      schedule();
    };
    const leave = () => { hovered = false; schedule(); };
    const focusIn = () => {
      focused = true;
      schedule();
    };
    const focusOut = (event: FocusEvent) => {
      focused = event.relatedTarget instanceof Node && browser.contains(event.relatedTarget);
      schedule();
    };
    observer.observe(element);
    browser.addEventListener("pointerenter", enter);
    browser.addEventListener("pointerleave", leave);
    browser.addEventListener("focusin", focusIn);
    browser.addEventListener("focusout", focusOut);
    document.addEventListener("visibilitychange", schedule);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      browser.removeEventListener("pointerenter", enter);
      browser.removeEventListener("pointerleave", leave);
      browser.removeEventListener("focusin", focusIn);
      browser.removeEventListener("focusout", focusOut);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [count, position, reducedMotion]);

  function move(direction: number) {
    const element = rail.current;
    if (!element) return;
    element.scrollTo({
      left: Math.max(0, Math.min(count - 1, position + direction)) * element.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }
  return (
    <div className="feedback-browser">
      <div className="feedback-controls">
        <span aria-live={reducedMotion ? "polite" : "off"} aria-atomic="true">Review {position + 1} of {count}</span>
        {count > 1 && <div>
          <button type="button" onClick={() => move(-1)} disabled={position === 0} aria-label="Previous review" aria-controls={id}>
            <ChevronLeft size={21} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => move(1)} disabled={position >= count - 1} aria-label="Next review" aria-controls={id}>
            <ChevronRight size={21} aria-hidden="true" />
          </button>
        </div>}
      </div>
      {count > 1 && <p className="feedback-scroll-hint">Swipe or scroll to browse feedback.</p>}
      <div
        className="feedback-rail" ref={rail} id={id} role="region" aria-label="Customer feedback" tabIndex={0}

      >
        {children}
      </div>
    </div>
  );
}
