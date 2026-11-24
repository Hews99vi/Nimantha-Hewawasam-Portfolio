import { revalidatePath, revalidateTag } from "next/cache";

export function revalidateAdminPaths(extraPaths: string[] = []) {
  revalidateTag("portfolio-content", { expire: 0 });
  const paths = new Set([
    "/",
    "/work",
    "/about",
    "/services",
    "/contact",
    "/blog",
    "/admin",
    "/sitemap.xml",
    ...extraPaths,
  ]);

  for (const path of paths) {
    revalidatePath(path);
    if (path === "/work" || path === "/blog")
      revalidatePath(`/(site)${path}/[slug]`, "page");
  }
}
