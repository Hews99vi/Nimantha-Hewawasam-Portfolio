# Nimantha Hewawasam Portfolio

Next.js App Router portfolio with a Supabase CMS. Public pages: Home, Work, project details, About, Services, Blog/article details, and Contact. `/admin` uses Supabase Auth plus membership in `public.admins`.

## Local development

Use Node.js 22 LTS (22.12 or newer within Node 22) and npm. Install with `npm ci`, copy `.env.example` to `.env.local`, and set your Supabase URL, public anon key, and canonical site URL. Run `npm run dev`.

Only `next dev` without Supabase configuration uses development content. Configured database failures are explicit errors in both public pages and admin; collections deliberately left empty stay empty. Production build/start requires valid Supabase settings and a complete canonical origin. Use `NEXT_PUBLIC_SITE_URL=http://localhost:3000` locally and your real HTTPS origin in production. Database failures never create editable sample records. Successful ISR entries remain subject to Next.js revalidation behavior; unavailable content offers retry.

## Hero actions

Introduction keeps editable primary and secondary action labels/destinations. The defaults are **View projects** (`/work`) and **Get in touch** (`/contact`). Exact original seed pairs are upgraded consistently when content is read by the public site and admin; customized values are preserved. No database command or reseeding is needed for this refinement. Saving Introduction invalidates the shared public content cache.

## Social icons

Admin → Social Links provides **LinkedIn**, **GitHub**, and **WhatsApp** brand icons with live previews. Existing `LinkedIn` + `briefcaseBusiness` and `GitHub` + `code2` pairs display the corresponding brand logo in both public content and admin; other custom selections are preserved. Saving an item persists the selected key. URLs remain separately editable: use a complete `https://` profile URL, without a leading `#`. No migration or reseeding is needed.

The inline SVG logos use unchanged artwork from [Font Awesome Free 7.3.1](https://github.com/FortAwesome/Font-Awesome/tree/7.x/svgs/brands), copyright 2026 Fonticons, Inc., under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Attribution is retained in the SVG descriptions and source. They inherit the existing text color and require no external icon service.

## WhatsApp contact

For an existing database, run `supabase/migrations/202611240001_contact_whatsapp.sql` once in the Supabase SQL editor before deploying this feature. It adds an optional column and format constraint without changing contact content or access policies. New databases using `supabase/schema.sql` already include it. Do not reseed.

In **Admin → Contact**, enter **WhatsApp number (optional)** with `+` and the country code, for example `+94 77 123 4567` (format example only), then **Save Changes**. Omit the local leading zero. Spaces, brackets and hyphens are accepted and removed when saved. Clear the field and save to hide WhatsApp. Invalid input or failed saves keep your edits; missing migration errors name the SQL file to apply.

The Contact panel shows the saved number with the recognizable WhatsApp logo and a **Chat on WhatsApp** link. It follows [WhatsApp’s documented click-to-chat format](https://faq.whatsapp.com/5913398998672934). No message is sent by the website. Confirm the number belongs to your active WhatsApp account; format validation cannot establish account ownership or availability. Older contact records remain usable with the field empty. Saving Contact invalidates the shared public cache.

## Database upgrade — existing installations

1. Back up the database. Apply `supabase/migrations/202610270001_project_galleries.sql`, `supabase/migrations/202611240001_contact_whatsapp.sql`, and `supabase/migrations/202611240002_admin_integrity.sql` in order in the Supabase SQL editor, skipping already-applied migrations. They are additive/idempotent; the integrity migration installs admin-only transaction functions without rewriting content.
2. Confirm that `projects` has `slug` and `images`, and Storage has the `project-images` bucket with a 20 MB limit and the supplied admin policies.
3. Complete the one-time Namecheap release setup below before enabling automatic deployment. Keep the public build settings and cPanel runtime settings consistent. A change to `NEXT_PUBLIC_*` settings requires a new build and commit/release; completed commit-named release directories are immutable.
4. Smoke-test a public project URL, admin login, image upload, save/reload, and testimonial activation.

For a new database use `supabase/schema.sql`. **Do not run `supabase/seed.sql` against an existing installation:** it deliberately deletes and replaces content. Its testimonial examples are inactive.

The migration is additive and leaves project IDs/content intact. Existing project slugs are generated once; changing a title does not change its URL. The database trigger makes featured-project changes atomic. Only exact unchanged shipped testimonial examples are deactivated. The previous application can run against the upgraded schema; preserve the new columns and bucket when rolling back. Do not delete originals as part of rollback.

## Project images

Save a project before uploading. Add PNG, JPEG, or WebP files up to 20 MB, at most 10 per project. Uploads use TUS directly to Supabase with progress, cancellation, retry, and resumption, avoiding Namecheap request-body limits. Retry resumes an interrupted transfer within the same editor session; a new file selection starts a new upload. Files are sent unchanged under unique object paths. There is no overwrite policy: replacement means a new upload.

Add alternative text, optional captions, and order images before saving the project. The first image is the cover. Removal is saved before detached files are deleted. A cleanup failure does not undo a successful save; use **Clean up discarded uploads** to retry. Abandoned files from closed admin sessions can remain in Storage: inspect database references before manually removing them. Storage policies prohibit deleting originals still referenced by a saved project.

Use sharp source screenshots, ideally 2400–3200 px wide for desktop work. Originals retain their uploaded bytes and dimensions. Next.js serves responsive previews at quality 90 and large gallery images at quality 95; the original-view/zoom paths bypass transformation. Screenshots are public portfolio assets, including direct URLs to their originals; disabling a project removes it from browsing but does not revoke already shared file URLs.

## Blog journal

`/blog` features one published article and an archive with topic links and a GET search form. Filters use `?q=…&topic=…` URLs, support browser Back/refresh and retain native navigation without JavaScript. Search checks titles, excerpts and active topic names; drafts remain excluded from discovery, related reading and direct URLs.

Admin → Blog Settings keeps the existing fields: **Page heading** is the former eyebrow, **Opening statement** is the former title, and Introduction opens under **About this journal**. Featured title supplies the feature section’s accessible name; featured introduction appears below it. There is no schema change or reseeding.

Article pages keep their existing slugs, SEO fields and Markdown content. Contents links are generated from Markdown level-2/3 headings, with stable unique anchors; related reading favors shared topics. The reading-position line enhances the page without hiding content when scripts are unavailable.

Existing uploaded cover URLs are preserved. Missing, failed, and exact shipped `/images/nimantha-hero.png` placeholder covers use native geometric editorial artwork, chosen by topic; no portfolio screenshots or article claims are fabricated. Replace the cover in Blog Posts whenever genuine editorial imagery is available. Reduced motion disables the featured connection trace.

## Feedback

The existing Testimonials editor controls the Home feedback section. Add genuine quotes with the customer's name and role/company. New entries are private/inactive until **Publicly visible** is enabled. Empty feedback collections render no public section.

Feedback appears on Home after the brands and before the contact invitation. The six-second rail preserves full quotes, saved order and initials-only attribution. It pauses while hovered/focused, out of view, in a hidden tab or under reduced motion. Focused cards explicitly align with the counter; manual controls remain available without a playback button or scrollbar.

## Verification

- `npm run lint`
- `npm run typecheck` (build first after moving routes to refresh Next's generated types)
- `npm test` — media validation, authorization, project normalization, and PostgreSQL migration/RLS tests using PGlite.
- `npx playwright install chromium`, then `npm run test:e2e` — starts an isolated local backend and Next dev server; exercises public browsing, the image viewer, mobile menu, and viewport layouts. Screenshots go to `.impeccable/review/`.
- `npm run test:standalone` — builds an isolated production bundle against the synthetic backend and verifies nonce CSP, headers, login hydration, public routes, assets, sitemap and health.
- `npm run build` — production compilation against the configured Supabase and environment validation.
- `npm audit --audit-level=moderate` — the release security gate.

Browser fixtures are explicitly synthetic and exist only under `tests/`; they are not application fallbacks. Local browser tests fulfill optimized image requests using fixture bytes, so they do not establish real Supabase/Next image delivery or upload integrity.

Before release against real Supabase, upload both a detailed PNG and a JPEG/WebP, including a file above 6 MB. Interrupt/resume an upload, save/reload, reorder/replace/remove, and test anonymous/non-admin access. Download each original and compare SHA-256 to the local source (`shasum -a 256`). Inspect quality-90/95 derivatives on a high-density screen, original zoom, transparency, and screenshot text. The browser suite also checks the real Next.js image optimizer with a local transparent source (quality allowlist, dimensions, no upscaling, and unchanged original bytes). Live service testing requires configured credentials and was not performed during offline implementation.

## Safe admin writes and rendering

Blog create/update and collection reordering call transaction functions from `202611240002_admin_integrity.sql`. Missing migration errors keep edits and identify the file to apply. Failed saves roll back article text, publication, categories and feature selection together. Existing HTTP endpoints and successful response shapes remain; malformed requests use 400, uniqueness conflicts use 409, expired sessions use 401, non-admin users use 403 and service outages use 503. API errors avoid raw database details. About and other saves share cache invalidation.

Publication inputs are converted from the editor's local time to ISO with an offset/UTC before submission. API timestamps without a timezone are rejected. Social profiles need complete HTTP/HTTPS URLs without a leading `#`; valid mailto destinations are supported. Hero links also support local routes and section anchors. Contact email is validated.

Article Markdown is retained unchanged in the database and sanitized on every render. Scripts, handlers, unsafe URL schemes, embedded forms/frames/SVG and inline styles are removed while headings, contents anchors, code, lists, tables and ordinary images remain. Admin pages use per-request script/style nonces with verified Supabase cookie refresh; API authorization remains independent of the proxy. Public CSP retains cache compatibility (its script policy allows Next's inline bootstrap), and blocks inline event handlers, framing, unsafe base URLs and object embeds. It is not a strict nonce CSP for public pages. All responses receive nosniff, DENY framing and a restrictive referrer policy.

## Automatic Namecheap deployment

Once bootstrapped, a **push to `main`** runs checks and automatically updates the site. Other branches and pull requests validate without deployment credentials. The workflow serializes releases, skips superseded commits, verifies database prerequisites using public reads/denied anonymous calls, builds the exact commit and retains a portable artifact. No production migration is executed by CI.

A small fixed `server.cjs` launcher selects `releases/<commit SHA>/server.js`. Uploads finish before `release-ready.json` is transferred; activation and last-good pointers sit outside release directories. Completed releases are never overwritten, including reruns of the same commit. An interrupted pointer falls back to a verified last-good release. Routine activation restarts through `tmp/restart.txt`; `/api/health` must report the expected revision on three consecutive checks and page/asset/sitemap checks must succeed. Otherwise the workflow restores the last-good pointer, restarts, verifies rollback and fails visibly. A failed rollback requires operator recovery. Old releases are retained for now; remove only inactive versions after checking both pointers.

### One-time setup before the first automatic release

1. Back up the current app and database; apply the migrations above. Keep the existing root `server.js` and its files until setup and rollback rehearsal succeed. Do not reseed.
2. In cPanel, confirm Node 22, the exact application root, SCP access, and restart-file support. Create `releases/` and `tmp/` inside that root. The workflow's `probe` only reads the existing root `DEPLOYED_SHA`; it cannot establish Node selection or restart support. Verify those in cPanel before continuing.
3. Keep the existing GitHub secrets `CPANEL_HOST`, `CPANEL_PORT`, `CPANEL_USERNAME`, `CPANEL_APP_PATH`, `CPANEL_SSH_KEY`, optional `CPANEL_SSH_PASSPHRASE`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_SITE_URL`. Add `CPANEL_KNOWN_HOSTS`: the OpenSSH host entry verified against your hosting account/provider through a trusted channel, including `[host]:port` for a nonstandard port. Do not establish trust from an unauthenticated network scan alone. Production site URL must be a complete HTTPS origin, without a path or trailing query.
4. Leave repository variable `CPANEL_RELEASES_READY` unset. Run **Validate and deploy portfolio → Run workflow → release_mode: stage** on the current `main` commit. This uploads a complete version and the unused root `server.cjs`; it does not change the active pointer or restart the existing app. The workflow will not silently fall back to overwriting the live application.
5. In File Manager create root `current-release.json` with `{"revision":"FULL_40_CHARACTER_COMMIT_SHA"}` matching the staged commit. During a controlled setup window set the cPanel startup file to `server.cjs` and restart. If initial bootstrap fails, restore the startup file to the untouched root `server.js` and restart; first-time setup has no last-good pointer yet.
6. Run the workflow with **release_mode: verify-bootstrap** for that same current main commit. It checks the live revision, content service, pages, assets and sitemap before creating `last-good-release.json`. Then set repository variable `CPANEL_RELEASES_READY=true`. Do not configure a required manual approval for routine deployments if you want push-to-main automation.
7. Rehearse a failed candidate and verified rollback in a staging/copy environment before depending on automation. Subsequent pushes to `main` use the default `deploy` mode with no manual server steps. Branch protection with the `validate` job required is recommended; the workflow itself also gates deployment on that job.

The standalone app must have the same Supabase and site URL environment values as its build. `/api/health` returns only readiness and revision, with no-store headers; it returns 503 on missing release identity/configuration or unavailable content service. Root `DEPLOYED_SHA` is the legacy access probe; the running release's own marker and health revision identify the active version.

Never publish cPanel application files through a static document root. The release artifact removes all `.env*` files; no service-role credential is needed. Browser fixtures and screenshots are test evidence, not a substitute for real admin authentication, large-upload/hash verification, hosting header checks or an actual rollback drill.

### Release verification status — 24 November 2026

The repair pass passed 94 unit/integration tests, 26 development browser regressions, TypeScript, ESLint, dependency audit (zero reported vulnerabilities), and an isolated production build against the configured public Supabase content. A production standalone server also passed the release smoke test. Desktop and mobile fixture screenshots were reviewed; fixtures do not certify authenticated live integration.

The read-only live database preflight did **not** pass: the required admin transaction functions or their anonymous-access grants could not be verified. Apply `supabase/migrations/202611240002_admin_integrity.sql`, then rerun `node --env-file=.env scripts/deploy/preflight.mjs` (or use the corresponding production environment). Do not reseed. Keep deployment disabled until this check and the one-time hosting setup above succeed. Authenticated live admin saves, large resumable uploads/original-byte verification, and a real Namecheap rollback rehearsal remain release checks; no live migration, deployment, or hosting change was performed in this repair pass.
