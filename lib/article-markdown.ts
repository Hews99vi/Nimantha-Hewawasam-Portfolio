import { Marked, TextRenderer } from "marked";
import sanitizeHtml from "sanitize-html";

export type ArticleHeading = { id: string; text: string; depth: number };
function plainLabel(value: string) {
  const entities: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", "#39": "'" };
  return value.replace(/<[^>]*>/gu, "").replace(/&([a-z]+|#39);/giu, (entity, name: string) => entities[name] ?? entity);
}

export function prepareArticle(markdown: string) {
  const headings: ArticleHeading[] = [];
  const used = new Set<string>();
  // Per-article state prevents headings from leaking between cached/server requests.
  const parser = new Marked({ gfm: true, breaks: true, async: false, renderer: {
    heading({ tokens, depth }) {
      const text = plainLabel(this.parser.parseInline(tokens, new TextRenderer()));
      const base = `section-${text.normalize("NFKD").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/gu, "") || "heading"}`;
      let id = base;
      let suffix = 2;
      while (used.has(id)) id = `${base}-${suffix++}`;
      used.add(id);
      if (depth === 2 || depth === 3) headings.push({ id, text, depth });
      return `<h${depth} id="${id}">${this.parser.parseInline(tokens)}</h${depth}>\n`;
    },
  } });
  const html = sanitizeHtml(parser.parse(markdown) as string, {
    allowedTags: ["h1", "h2", "h3", "h4", "h5", "h6", "p", "br", "hr", "strong", "em", "b", "i", "s", "del", "blockquote", "ul", "ol", "li", "pre", "code", "a", "img", "figure", "figcaption", "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption", "sup", "sub", "kbd"],
    allowedAttributes: { a: ["href", "title"], img: ["src", "alt", "title", "width", "height", "loading"], ol: ["start"], th: ["colspan", "rowspan", "scope"], td: ["colspan", "rowspan"], h1: ["id"], h2: ["id"], h3: ["id"], h4: ["id"], h5: ["id"], h6: ["id"] },
    allowedClasses: { code: [/^language-[a-z0-9_-]+$/i] },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["http", "https"] },
    allowProtocolRelative: false,
    transformTags: { img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy" } }) },
  });
  return { html, headings };
}
