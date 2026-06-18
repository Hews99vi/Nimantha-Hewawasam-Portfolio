import { revalidatePath } from "next/cache";

export function revalidateAdminPaths(extraPaths: string[] = []) {
  const paths = new Set(["/", "/blog", "/admin", ...extraPaths]);

  for (const path of paths) {
    revalidatePath(path);
  }
}
