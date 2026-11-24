"use client";
import { useEffect, useRef, useState } from "react";
import { Upload } from "tus-js-client";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  imageUrl,
  MAX_PROJECT_IMAGES,
  PROJECT_BUCKET,
  validateUpload,
} from "@/lib/project-media";
import type { ProjectImage } from "@/types/content";

type Task = { file: File; image: ProjectImage };
export function ProjectMediaEditor({
  projectId,
  images,
  onChange,
  disabled,
  onBusyChange,
}: {
  projectId: string;
  images: ProjectImage[];
  onChange: (images: ProjectImage[]) => void;
  disabled: boolean;
  onBusyChange: (busy: boolean) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [retry, setRetry] = useState(false);
  const [unused, setUnused] = useState<string[]>([]);
  const upload = useRef<Upload | null>(null);
  const task = useRef<Task | null>(null);
  const latest = useRef({ images, onChange, onBusyChange });
  const mounted = useRef(true);
  useEffect(() => {
    latest.current = { images, onChange, onBusyChange };
  }, [images, onChange, onBusyChange]);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      void upload.current?.abort();
      latest.current.onBusyChange(false);
    };
  }, []);
  const saved = !projectId.startsWith("temp-");
  function setUploading(value: boolean) {
    if (!mounted.current) return;
    setBusy(value);
    latest.current.onBusyChange(value);
  }
  async function start(current: Task) {
    setMessage("");
    setRetry(false);
    setUploading(true);
    setProgress(0);
    try {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error || !session)
        throw new Error(
          "Your session expired. Sign in again before uploading.",
        );
      const configured = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
      const hostname = configured.hostname.endsWith(".supabase.co")
        ? configured.hostname.replace(".supabase.co", ".storage.supabase.co")
        : configured.hostname;
      const endpoint = `${configured.protocol}//${hostname}${configured.port ? `:${configured.port}` : ""}/storage/v1/upload/resumable`;
      const uploader = new Upload(current.file, {
        endpoint,
        headers: {
          authorization: `Bearer ${session.access_token}`,
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
        },
        metadata: {
          bucketName: PROJECT_BUCKET,
          objectName: current.image.storage_path,
          contentType: current.file.type,
          cacheControl: "31536000",
        },
        chunkSize: 6 * 1024 * 1024,
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true,
        retryDelays: [0, 1000, 3000, 5000],
        fingerprint: async () =>
          `${PROJECT_BUCKET}:${current.image.storage_path}:${current.file.size}:${current.file.lastModified}`,
        onProgress: (sent, total) => {
          if (mounted.current) setProgress(Math.round((sent / total) * 100));
        },
        onError: () => {
          if (!mounted.current) return;
          setUploading(false);
          setRetry(true);
          setMessage(
            "Upload interrupted. Retry to resume, or discard this upload. Check that the gallery migration and storage policies are installed.",
          );
        },
        onSuccess: () => {
          if (!mounted.current) return;
          const latestImages = latest.current.images;
          if (latestImages.length >= MAX_PROJECT_IMAGES) {
            setUnused((paths) => [...paths, current.image.storage_path]);
            setMessage(
              "The gallery is full. This unused upload can be cleaned up below.",
            );
          } else {
            latest.current.onChange([...latestImages, current.image]);
            setMessage(
              "Original uploaded unchanged. Add alternative text, then save the project to publish it.",
            );
          }
          task.current = null;
          setUploading(false);
          setRetry(false);
        },
      });
      upload.current = uploader;
      const previous = await uploader.findPreviousUploads();
      if (previous[0]) uploader.resumeFromPreviousUpload(previous[0]);
      if (!mounted.current) return;
      uploader.start();
    } catch (error) {
      setUploading(false);
      setRetry(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "Upload failed. Retry the original file.",
      );
    }
  }
  async function choose(file: File) {
    const error = validateUpload(file);
    if (error) {
      setMessage(error);
      return;
    }
    if (images.length >= MAX_PROJECT_IMAGES) {
      setMessage(
        "A project can have up to 10 images. Remove one and save before adding another.",
      );
      return;
    }
    try {
      const bitmap = await createImageBitmap(file);
      const width = bitmap.width,
        height = bitmap.height;
      bitmap.close();
      if (width > 50000 || height > 50000)
        throw new Error(
          "The image must be at most 50,000 pixels in either dimension.",
        );
      const extension =
        file.type === "image/jpeg"
          ? "jpg"
          : file.type === "image/png"
            ? "png"
            : "webp";
      const current = {
        file,
        image: {
          storage_path: `${projectId}/${crypto.randomUUID()}.${extension}`,
          alt: "",
          caption: "",
          width,
          height,
          size: file.size,
        },
      };
      task.current = current;
      await start(current);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "This file could not be decoded as an image. Export it as PNG, JPEG, or WebP and retry.",
      );
    }
  }
  async function cancel() {
    await upload.current?.abort();
    if (task.current)
      setUnused((paths) => [...paths, task.current!.image.storage_path]);
    task.current = null;
    setRetry(false);
    setUploading(false);
    setMessage("Upload discarded. Choose a file to start again.");
  }
  function update(index: number, patch: Partial<ProjectImage>) {
    onChange(
      images.map((image, i) => (i === index ? { ...image, ...patch } : image)),
    );
  }
  function move(index: number, delta: number) {
    const reordered = [...images];
    [reordered[index], reordered[index + delta]] = [
      reordered[index + delta],
      reordered[index],
    ];
    onChange(reordered);
  }
  async function cleanup() {
    try {
      const response = await fetch("/api/admin/project-media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paths: unused }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setUnused([]);
      setMessage(result.message);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Cleanup failed. Retry.",
      );
    }
  }
  return (
    <section className="media-editor">
      <h4>Project images · {images.length} / 10</h4>
      <p>
        Original files are preserved. PNG, JPEG, or WebP · up to 20 MB each. For
        detailed desktop screenshots, aim for 2400–3200 px wide. The first image
        is the cover.
      </p>
      {!saved ? (
        <p>Save this project’s details before uploading images.</p>
      ) : (
        <>
          <label className="upload-control">
            Add an original image
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              disabled={
                disabled || busy || retry || images.length >= MAX_PROJECT_IMAGES
              }
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) void choose(file);
              }}
            />
          </label>
          {busy && (
            <div className="upload-progress">
              <progress
                max={100}
                value={progress}
                aria-label="Upload progress"
              />
              <span>{progress}%</span>
              <button type="button" onClick={() => void cancel()}>
                Cancel
              </button>
            </div>
          )}
          {retry && (
            <div className="media-actions">
              <button
                type="button"
                onClick={() => {
                  if (task.current) void start(task.current);
                }}
              >
                Retry upload
              </button>
              <button type="button" onClick={() => void cancel()}>
                Discard upload
              </button>
            </div>
          )}
        </>
      )}
      <p role="status">{message}</p>
      {unused.length > 0 && (
        <button
          type="button"
          className="text-action"
          disabled={busy || disabled}
          onClick={() => void cleanup()}
        >
          Clean up discarded uploads
        </button>
      )}
      <div className="media-items">
        {images.map((image, index) => (
          <div className="media-item" key={image.storage_path}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl(image.storage_path)}
              alt={image.alt || `Project image ${index + 1}`}
            />
            <small>
              {index === 0 ? "Cover · " : ""}
              {image.width} × {image.height} px ·{" "}
              {(image.size / 1024 / 1024).toFixed(2)} MB
            </small>
            <label>
              Alternative text (required)
              <input
                value={image.alt}
                maxLength={500}
                disabled={disabled || busy}
                onChange={(event) => update(index, { alt: event.target.value })}
              />
            </label>
            <label>
              Caption
              <textarea
                value={image.caption}
                maxLength={2000}
                disabled={disabled || busy}
                onChange={(event) =>
                  update(index, { caption: event.target.value })
                }
              />
            </label>
            <div className="media-actions">
              <button
                type="button"
                disabled={disabled || busy || index === 0}
                onClick={() => move(index, -1)}
              >
                Move earlier
              </button>
              <button
                type="button"
                disabled={disabled || busy || index === images.length - 1}
                onClick={() => move(index, 1)}
              >
                Move later
              </button>
              <button
                type="button"
                disabled={disabled || busy}
                onClick={() => {
                  setUnused((paths) => [...paths, image.storage_path]);
                  onChange(images.filter((_, i) => i !== index));
                }}
              >
                Remove
              </button>
              {index > 0 && (
                <button
                  type="button"
                  disabled={disabled || busy}
                  onClick={() =>
                    onChange([image, ...images.filter((_, i) => i !== index)])
                  }
                >
                  Make cover
                </button>
              )}
            </div>
            <a
              className="text-action"
              href={imageUrl(image.storage_path)}
              target="_blank"
              rel="noreferrer"
            >
              View original
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
