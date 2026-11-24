/** Stored links are validated without guessing or rewriting somebody's destination. */
export function isWebUrl(value: string) {
  if (/\s|[\\\u0000-\u001f\u007f]/u.test(value)) return false;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) && Boolean(url.hostname) && !url.username && !url.password;
  } catch { return false; }
}

export function isActionHref(value: string) {
  if (isWebUrl(value)) return true;
  if (/\s|[\\\u0000-\u001f\u007f]/u.test(value)) return false;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  // Domain-looking fragments are usually accidentally pasted external URLs.
  if (/^#[\p{L}\p{N}_-]+$/u.test(value)) return true;
  return /^mailto:[^?\s@]+@[^?\s@]+\.[^?\s@]+(?:\?[^\s]*)?$/iu.test(value);
}
