import assets from "@/lib/local-image-assets.json";

/** Prebuilt responsive images avoid cold resizing work on shared hosting. */
export function LocalImage({ image, alt, sizes, className, priority = false, eager = false }: {
  image: keyof typeof assets;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  eager?: boolean;
}) {
  const asset = assets[image];
  const fallback = asset.variants.find(variant => variant.width >= 768) ?? asset.variants[asset.variants.length - 1];
  const srcSet = asset.variants.map(variant => `${variant.src} ${variant.width}w`).join(", ");
  return <>
    {priority && <link rel="preload" as="image" href={fallback.src} imageSrcSet={srcSet} imageSizes={sizes} />}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={fallback.src} srcSet={srcSet} sizes={sizes} width={asset.width} height={asset.height}
      alt={alt} className={className} loading={priority || eager ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined} decoding="async" />
  </>;
}
