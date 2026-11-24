/** Home is a preview; the complete CMS description stays on Work and project pages. */
export function projectTeaser(description: string, limit = 220) {
  const text = description.trim();
  const first = text.split(/(?<=[.!?])\s+/u)[0];
  if (first.length <= limit) return first;
  const clipped = first.slice(0, limit);
  const boundary = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, boundary > limit / 2 ? boundary : limit).trimEnd()}…`;
}
