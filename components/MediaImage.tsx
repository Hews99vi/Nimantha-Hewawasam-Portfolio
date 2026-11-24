"use client";
import Image from "next/image";
import { useState } from "react";
export function MediaImage({
  src,
  alt,
  width,
  height,
  quality = 90,
  sizes = "100vw",
  priority = false,
  className = "",
  retryable = true,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  quality?: 90 | 95;
  sizes?: string;
  priority?: boolean;
  className?: string;
  retryable?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <span className="image-error" role="status">
        <span>Image unavailable.</span>
        {retryable && (
          <button type="button" onClick={() => setFailed(false)}>
            Retry image
          </button>
        )}
      </span>
    );
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      quality={quality}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      className={className}
      style={{ maxWidth: `min(100%, ${width}px)` }}
      onError={() => setFailed(true)}
    />
  );
}
