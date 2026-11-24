"use client";
import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const article = document.getElementById("article-copy");
    if (!article) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const bounds = article.getBoundingClientRect();
      const range = Math.max(1, bounds.height - window.innerHeight);
      setProgress(Math.min(100, Math.max(0, Math.round(-bounds.top / range * 100))));
    };
    const update = () => { if (!frame) frame = requestAnimationFrame(measure); };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  return <div className="reader-progress" role="progressbar" aria-label="Article reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{ transform: `scaleX(${progress / 100})` }} /></div>;
}
