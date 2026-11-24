"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import type { ProjectImage } from "@/types/content";
import { imageUrl } from "@/lib/project-media";
import { MediaImage } from "@/components/MediaImage";

export function ProjectGallery({
  images,
  title,
  children,
}: {
  images: ProjectImage[];
  title: string;
  children: React.ReactNode;
}) {
  const [active, setActive] = useState<number | null>(null);
  const [zoom, setZoom] = useState(false);
  const [failed, setFailed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const isOpen = active !== null;
  const image = active === null ? null : images[active];
  useEffect(() => {
    if (!isOpen) return;
    const element = dialog.current;
    const overflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
      opener.current?.focus();
    };
  }, [isOpen]);
  function close() {
    setActive(null);
    setZoom(false);
    setFailed(false);
  }
  function move(delta: number) {
    setActive((index) =>
      index === null ? null : (index + delta + images.length) % images.length,
    );
    setZoom(false);
    setFailed(false);
  }
  function figure(item: ProjectImage, index: number) {
    return (
      <figure
        className={index === 0 ? "project-main-image" : ""}
        key={item.storage_path}
      >
        <button
          className="gallery-open"
          type="button"
          aria-label={`Open image ${index + 1}: ${item.alt}`}
          onClick={(event) => {
            opener.current = event.currentTarget;
            setActive(index);
            setFailed(false);
          }}
        >
          <MediaImage
            src={imageUrl(item.storage_path)}
            alt={item.alt}
            width={item.width}
            height={item.height}
            quality={95}
            sizes="(max-width: 768px) 100vw, 1180px"
            retryable={false}
            priority={index === 0}
          />
          <span>
            <ZoomIn size={17} /> View image
          </span>
        </button>
        {item.caption && <figcaption>{item.caption}</figcaption>}
      </figure>
    );
  }
  return (
    <>
      {images[0] && figure(images[0], 0)}
      {children}
      {images.length > 1 && (
        <section className="project-screenshots">
          <h2>A closer look.</h2>
          {images.slice(1).map((item, index) => figure(item, index + 1))}
        </section>
      )}
      <dialog
        ref={dialog}
        className="lightbox"
        aria-labelledby="gallery-title"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClose={() => {
          if (active !== null) close();
        }}
        onKeyDown={(event) => {
          if (event.target instanceof HTMLInputElement) return;
          if (event.key === "ArrowRight") {
            event.preventDefault();
            move(1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            move(-1);
          }
        }}
      >
        {image && (
          <>
            <div className="lightbox-toolbar">
              <h2 id="gallery-title">
                {title}
                <span aria-live="polite">
                  {(active ?? 0) + 1} / {images.length}
                </span>
              </h2>
              <div>
                <button
                  type="button"
                  onClick={() => setZoom(!zoom)}
                  aria-pressed={zoom}
                  aria-label={
                    zoom ? "Fit image" : "Zoom to original resolution"
                  }
                >
                  {zoom ? <ZoomOut /> : <ZoomIn />}
                </button>
                <a
                  href={imageUrl(image.storage_path)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="View original image in a new tab"
                >
                  <ExternalLink />
                </a>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close image viewer"
                  autoFocus
                >
                  <X />
                </button>
              </div>
            </div>
            <div className={`lightbox-stage ${zoom ? "is-zoomed" : ""}`}>
              {failed ? (
                <div className="image-error">
                  <p>Image could not be loaded.</p>
                  <button onClick={() => setFailed(false)}>Retry image</button>
                </div>
              ) : zoom ? (
                <Image
                  unoptimized
                  key={`${image.storage_path}-original`}
                  src={imageUrl(image.storage_path)}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  onError={() => setFailed(true)}
                />
              ) : (
                <MediaImage
                  key={image.storage_path}
                  src={imageUrl(image.storage_path)}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  quality={95}
                  sizes="100vw"
                />
              )}
            </div>
            <div className="lightbox-bottom">
              <p>{image.caption || image.alt}</p>
              {images.length > 1 && (
                <div className="lightbox-arrows">
                  <button aria-label="Previous image" onClick={() => move(-1)}>
                    <ArrowLeft />
                  </button>
                  <button aria-label="Next image" onClick={() => move(1)}>
                    <ArrowRight />
                  </button>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="lightbox-thumbnails" aria-label="Choose image">
                {images.map((item, index) => (
                  <button
                    key={item.storage_path}
                    aria-label={`Image ${index + 1}: ${item.alt}`}
                    aria-pressed={active === index}
                    onClick={() => {
                      setActive(index);
                      setZoom(false);
                      setFailed(false);
                    }}
                  >
                    <MediaImage
                      src={imageUrl(item.storage_path)}
                      alt=""
                      width={item.width}
                      height={item.height}
                      sizes="80px"
                      retryable={false}
                    />
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </dialog>
    </>
  );
}
