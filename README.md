# Nimantha Hewawasam Portfolio

Next.js App Router portfolio with a Supabase CMS. Public pages: Home, Work, project details, About, Services, Blog/article details, and Contact. `/admin` uses Supabase Auth plus membership in `public.admins`.

## Local development

Use Node.js 22 LTS and npm. Install with `npm ci`, copy `.env.example` to `.env.local`, and set your Supabase URL, public anon key, and canonical site URL. Run `npm run dev`.

Without Supabase configuration the public pages show the existing development content; admin clearly reports that configuration is missing. No project screenshots or customer feedback are fabricated. `NEXT_PUBLIC_SITE_URL` supplies the canonical origin and sitemap; the sitemap is empty until it is configured.

## Hero actions

Introduction keeps editable primary and secondary action labels/destinations. The defaults are **View projects** (`/work`) and **Get in touch** (`/contact`). Exact original seed pairs are upgraded consistently when content is read by the public site and admin; customized values are preserved. No database command or reseeding is needed for this refinement. Saving Introduction invalidates the shared public content cache.

## Social icons

Admin → Social Links provides **LinkedIn** and **GitHub** brand icons with live previews. Existing `LinkedIn` + `briefcaseBusiness` and `GitHub` + `code2` pairs display the corresponding brand logo in both public content and admin; other custom selections are preserved. Saving an item persists the selected key. URLs remain separately editable: use a complete `https://` profile URL, without a leading `#`. No migration or reseeding is needed.

The two inline SVG logos use unchanged artwork from [Font Awesome Free 7.3.1](https://github.com/FortAwesome/Font-Awesome/tree/7.x/svgs/brands), copyright 2026 Fonticons, Inc., under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Attribution is retained in the SVG descriptions and source. They inherit the existing text color and require no external icon service.

## Database upgrade — existing installations

1. Back up the database. Apply `supabase/migrations/202610270001_project_galleries.sql` in the Supabase SQL editor before deploying the new application.
2. Confirm that `projects` has `slug` and `images`, and Storage has the `project-images` bucket with a 20 MB limit and the supplied admin policies.
3. Deploy using the existing Namecheap workflow. Set `NEXT_PUBLIC_SITE_URL` as a GitHub Actions secret alongside the existing Supabase secrets. Keep the same public environment values in the cPanel Node app; rebuild after changing `NEXT_PUBLIC_*` values.
4. Smoke-test a public project URL, admin login, image upload, save/reload, and testimonial activation.

For a new database use `supabase/schema.sql`. **Do not run `supabase/seed.sql` against an existing installation:** it deliberately deletes and replaces content. Its testimonial examples are inactive.

The migration is additive and leaves project IDs/content intact. Existing project slugs are generated once; changing a title does not change its URL. The database trigger makes featured-project changes atomic. Only exact unchanged shipped testimonial examples are deactivated. The previous application can run against the upgraded schema; preserve the new columns and bucket when rolling back. Do not delete originals as part of rollback.

## Project images

Save a project before uploading. Add PNG, JPEG, or WebP files up to 20 MB, at most 10 per project. Uploads use TUS directly to Supabase with progress, cancellation, retry, and resumption, avoiding Namecheap request-body limits. Retry resumes an interrupted transfer within the same editor session; a new file selection starts a new upload. Files are sent unchanged under unique object paths. There is no overwrite policy: replacement means a new upload.

Add alternative text, optional captions, and order images before saving the project. The first image is the cover. Removal is saved before detached files are deleted. A cleanup failure does not undo a successful save; use **Clean up discarded uploads** to retry. Abandoned files from closed admin sessions can remain in Storage: inspect database references before manually removing them. Storage policies prohibit deleting originals still referenced by a saved project.

Use sharp source screenshots, ideally 2400–3200 px wide for desktop work. Originals retain their uploaded bytes and dimensions. Next.js serves responsive previews at quality 90 and large gallery images at quality 95; the original-view/zoom paths bypass transformation. Screenshots are public portfolio assets, including direct URLs to their originals; disabling a project removes it from browsing but does not revoke already shared file URLs.

## Feedback

The existing Testimonials editor controls the Home feedback section. Add genuine quotes with the customer's name and role/company. New entries are private/inactive until **Publicly visible** is enabled. Empty feedback collections render no public section.

Feedback appears on Home after the brands and before the contact invitation. An open quotation layout displays customer initials beside their name and role, preserving the complete feedback and saved order. The first quotation leads; additional reviews flow below with fine dividers. No customer photos or database changes are needed for this layout.

## Verification

- `npm run lint`
- `npx tsc --noEmit` (run a build first after moving routes, to refresh Next's generated types)
- `npm test` — media validation, authorization, project normalization, and PostgreSQL migration/RLS tests using PGlite.
- `npx playwright install chromium`, then `npm run test:e2e` — starts an isolated local backend and Next dev server; exercises public browsing, the image viewer, mobile menu, and viewport layouts. Screenshots go to `.impeccable/review/`.
- `npm run build` — production compilation and type checks.

Browser fixtures are explicitly synthetic and exist only under `tests/`; they are not application fallbacks. Local browser tests fulfill optimized image requests using fixture bytes, so they do not establish real Supabase/Next image delivery or upload integrity.

Before release against real Supabase, upload both a detailed PNG and a JPEG/WebP, including a file above 6 MB. Interrupt/resume an upload, save/reload, reorder/replace/remove, and test anonymous/non-admin access. Download each original and compare SHA-256 to the local source (`shasum -a 256`). Inspect quality-90/95 derivatives on a high-density screen, original zoom, transparency, and screenshot text. The browser suite also checks the real Next.js image optimizer with a local transparent source (quality allowlist, dimensions, no upscaling, and unchanged original bytes). Live service testing requires configured credentials and was not performed during offline implementation.
