export function normalizePublicAssetPath(value: string | null | undefined) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return null;
  }

  if (/^(https?:)?\/\//.test(trimmed) || /^(data|blob):/.test(trimmed)) {
    return trimmed;
  }

  const normalized = trimmed.replaceAll("\\", "/").replace(/^\.\//, "");

  if (normalized.startsWith("/public/")) {
    return normalized.replace(/^\/public/, "");
  }

  if (normalized.startsWith("public/")) {
    return `/${normalized.slice("public/".length)}`;
  }

  if (normalized.startsWith("/")) {
    return normalized;
  }

  return `/${normalized}`;
}
