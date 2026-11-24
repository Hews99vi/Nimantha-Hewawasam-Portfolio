---
name: "Nimantha Hewawasam Portfolio"
description: "The implemented visual system for Nimantha Hewawasam’s software-development portfolio."
colors:
  paper: "#f7f7f2"
  surface: "#eeeee7"
  ink: "#20282c"
  muted: "#5b6264"
  line: "#d7d9d2"
  accent: "#0057d9"
  accent-hover: "#003d9c"
  dark: "#17262f"
  white: "#ffffff"
  hero-surround: "#d7ddd9"
  hero-surface: "#b7c4d2"
  hero-ink: "#24374c"
  hero-muted: "#354a5e"
  hero-line: "#94a6b9"
  lightbox: "#152027"
typography:
  display:
    fontFamily: "var(--font-manrope), sans-serif"
    fontSize: "clamp(2.7rem, 6.1vw, 5.8rem)"
    fontWeight: 650
    lineHeight: 1.12
    letterSpacing: "-0.035em"
  hero-display:
    fontFamily: "var(--font-manrope), sans-serif"
    fontSize: "clamp(3.4rem, 4.5vw, 5.5rem)"
    fontWeight: 800
    lineHeight: 0.97
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "var(--font-manrope), sans-serif"
    fontSize: "clamp(2rem, 3.7vw, 3.6rem)"
    fontWeight: 650
    lineHeight: 1.12
    letterSpacing: "-0.035em"
  title:
    fontFamily: "var(--font-manrope), sans-serif"
    fontSize: "1.4rem"
    fontWeight: 650
    lineHeight: 1.12
    letterSpacing: "-0.035em"
  body:
    fontFamily: "var(--font-manrope), sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  lead:
    fontFamily: "var(--font-manrope), sans-serif"
    fontSize: "clamp(1.12rem, 1.7vw, 1.4rem)"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "var(--font-manrope), sans-serif"
    fontSize: "0.88rem"
    fontWeight: 650
    lineHeight: 1.65
  button:
    fontFamily: "var(--font-manrope), sans-serif"
    fontSize: "0.88rem"
    fontWeight: 700
    lineHeight: 1.65
  hero-action:
    fontFamily: "var(--font-manrope), sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.5
  article-body:
    fontFamily: "var(--font-manrope), sans-serif"
    fontSize: "1.08rem"
    fontWeight: 400
    lineHeight: 1.9
  testimonial-lead:
    fontFamily: "var(--font-manrope), sans-serif"
    fontSize: "clamp(1.5rem, 2.25vw, 2rem)"
    fontWeight: 450
    lineHeight: 1.5
    letterSpacing: "-0.025em"
  testimonial-body:
    fontFamily: "var(--font-manrope), sans-serif"
    fontSize: "clamp(1.05rem, 1.35vw, 1.15rem)"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "-0.015em"
  testimonial-role:
    fontFamily: "var(--font-manrope), sans-serif"
    fontSize: "0.83rem"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  square: "0px"
  control: "6px"
  menu: "8px"
  media: "12px"
  hero-mobile: "16px"
  hero: "20px"
spacing:
  icon-gap: "10px"
  control-gap: "14px"
  small: "20px"
  copy: "24px"
  medium: "30px"
  large: "40px"
  caption-grid: "35px"
  section-heading: "45px"
  section-mobile: "65px"
  section: "100px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "13px 22px"
    height: "auto"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  hero-action-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.white}"
    typography: "{typography.hero-action}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
    height: "auto"
  hero-action-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.hero-ink}"
    typography: "{typography.hero-action}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
    height: "auto"
  button-text:
    textColor: "{colors.ink}"
    padding: "0px"
  project-cover:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.media}"
    width: "100%"
  navigation:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
  navigation-active:
    textColor: "{colors.accent}"
  gallery-trigger:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.media}"
    padding: "0px"
    width: "100%"
  lightbox:
    backgroundColor: "{colors.lightbox}"
    textColor: "{colors.paper}"
    padding: "20px 30px"
    width: "100vw"
    height: "100dvh"
  media-input:
    rounded: "{rounded.square}"
    padding: "9px"
    width: "100%"
---

# Design System: Nimantha Hewawasam Portfolio

## Overview

**Creative North Star: "Image-led editorial portfolio"**

The public portfolio uses warm off-white, charcoal, restrained cobalt, fine dividers, and self-hosted Manrope. Open editorial columns and varied image-led layouts put actual project work ahead of interface decoration. The existing name, portrait, and introduction composition remains the home hero’s recognizable opening.

This records the implemented public system, not a new identity proposal. The CMS retains some earlier navy/white, square-field styling; the media editor shares the current neutral tokens. Surface modes and page strategy remain in .impeccable/direction.md. Review screenshots use explicitly labeled synthetic media and feedback; they are layout evidence, not portfolio claims.

**Key Characteristics:**
- Warm neutral surfaces with a restrained cobalt action color.
- Fine dividers and open columns rather than nested panels.
- Contained, uncropped project screenshots and original-resolution inspection.
- A preserved portrait hero that stacks before its columns collide.

## Colors

The palette pairs warm neutrals with a single cobalt accent; the retained hero has a distinct blue-gray surround.

### Primary

- **Cobalt** (`accent`): primary links, buttons, focus outlines, active navigation, and small emphasis marks. The darker hover value belongs to primary button interaction.
- **White** (`white`): primary button text.

### Neutral

- **Paper** (`paper`): page canvas, mobile menu, and gallery label background.
- **Soft Surface** (`surface`): project image mats, honest text previews, and selected section backgrounds.
- **Charcoal** (`ink`): main text; **Muted Charcoal** (`muted`): supporting copy and metadata.
- **Fine Divider** (`line`): rules, list boundaries, and quiet strokes.
- **Deep Charcoal** (`dark`): contact invitation and article code blocks.
- **Hero Surround**, **Hero Surface**, **Hero Ink**, **Hero Muted**, and **Hero Line**: the retained portrait composition and its embedded header. These are contextual colors, not additional action accents.
- **Viewer Charcoal** (`lightbox`): full-viewport image viewer and backdrop.

Frontmatter owns the exact reusable values. Contextual viewer controls, selection colors, and older admin utility colors remain in source; they are not a second public palette.

## Typography

**Display and Body Font:** self-hosted variable Manrope, supplied by `next/font/local` from `@fontsource-variable/manrope`, with a sans-serif fallback and swap loading.

**Code Font:** native `ui-monospace, monospace` for article code.

The same family carries compact labels, readable prose, and tightly tracked headings. Headings use balanced wrapping; normal body text can break long words.

### Hierarchy

- **Display:** general page headings; project, journal, and article titles have their own responsive clamps in source. The journal title uses (2.8–4.5rem) with (1.1) leading; reader titles use (2.2–3.6rem) with (1.15) leading and a (22ch) maximum measure.
- **Hero Display:** heavier, tighter name lettering. The desktop token is overridden by tablet and phone rules described in Layout.
- **Headline:** section headings; **Title:** normal third-level headings.
- **Body:** inherited base size with relaxed leading. **Lead:** introductory copy.
- **Label:** navigation. **Button:** slightly heavier action text.
- **Article Body:** longer reading text within the reader's copy column, with explicit heading spacing and underlined inline links. Journal card titles use (1.35–1.85rem) with (1.3) leading; the featured title uses (1.7–2.5rem).

Use the token roles as the default hierarchy, not as a requirement to make every page title identical. Introductory copy is commonly limited to (65ch); section-heading descriptions use (30ch).

## Layout

The main shell is centered with a maximum width of (1180px) and desktop side gutters of (40px). The header has its own wider maximum of (1320px). Sections normally use (100px) vertical padding; page introductions use (85px) above and (65px) below. Open two-column grids, dividers, and changes in surface color establish grouping.

Project lists use two columns with (65px) row and (35px) column gaps. The first featured project spans the grid with a (1.5fr / 1fr) image-and-caption split and a divider. Other projects use image or text previews above captions.

The journal uses the shared shell, a compact opening, and a separate featured image-and-copy split of (1.1fr / 1fr). The archive has three columns with (48px) row and (28px) column gaps, becoming two columns at or below (1100px) and one at or below (600px). The featured split also stacks at (600px), while the opening stacks at (800px). Journal visuals use a (600/380) aspect ratio. Reader headers pair the title and metadata with a compact square visual; at (800px), the visual moves below the title and uses a wide (600/280) ratio with a (300px) maximum height. Reader copy is capped at (740px), beside a sticky contents column above (800px). Below that breakpoint, native contents sit above the copy; contents links use two columns until (600px), then one. Without headings, the copy column is centered. Related reading uses two columns, stacking at (600px).

The desktop hero sits inside a (30px) surround, up to (1760px) wide, with a viewport-related height clamped by (720px) minimum and (980px) maximum. The name anchors left, the portrait is centered at (51%) and sized to (80%) height, and the introduction sits right. The transparent portrait remains fully visible rather than becoming a cropped cover.

Responsive behavior follows the actual CSS cascade:

- At or below (1100px), the hero stacks into name → portrait → introduction. The dedicated (801px–1100px) override removes the maximum height, uses a (480px) portrait and (5rem) name, and keeps the normal desktop navigation until its own breakpoint. The portrait is centered with normal flow and no translate transform.
- At or below (800px), the shell gutters become (20px), section padding becomes (65px), navigation becomes a menu panel, and the hero uses a (14px) surround, (390px) portrait, and responsive name size. Featured projects become vertical. Split copy and contact sections stack; many other content grids remain two-column. The journal and reader follow their own breakpoints above.
- At or below (560px), project, service, project-context, and media-editor grids become one column. The portrait becomes (330px) tall. Hero actions share a wrapping row; the stacked frame grows with longer labels. Brand logos form two columns and footer rows stack. About and testimonials have their own content-driven breakpoints described below.
- Above (1500px), the hero name’s maximum width tightens to (42%); the portrait remains centered at (51%).

About has its own responsive layout: facts become two columns at or below (960px). At or below (700px), the opening becomes title → portrait → introduction; the portrait is capped at (420px) wide, while biography and principle rows stack. The toolkit keeps a connected two-column discipline map beside its selected tools; at (1000px), the columns tighten and button icons sit above their labels. At (640px), the selected tools move below the map, and project previews become one column. Long discipline and tool names wrap within their available width.

Services places its disclosure list beside a sticky conceptual schematic. At or below (800px), the schematic moves inside the open disclosure and the list becomes one column. The connected process changes from horizontal numbered nodes to a vertical sequence at (1100px). Contact pairs editorial copy with a dark connection panel; at (800px), the panel stacks below the copy with a (600px) maximum width. Panel padding tightens at (640px).

Home’s About teaser uses a (360px) portrait column beside its heading and copy, with (80px) vertical padding. At or below (960px), its columns become (0.75fr / 1.25fr) with a (40px) gap. At or below (640px), the portrait is (128px) wide beside the heading, copy spans below, and vertical padding becomes (56px).

**The Artifact Rule.** Keep project screenshots uncropped and cap their display width at their intrinsic pixel width or the available width, whichever is smaller.

`MediaImage` enforces `max-width: min(100%, intrinsic-width)` inline. Project covers use contain fitting inside a (16/11) mat; detail-page images have automatic width and a (850px) maximum height. Article cover photography uses cover fitting and is a separate pattern.

## Elevation & Depth

Ordinary content is flat. Tonal backgrounds, spacing, image mats, and fine dividers supply depth. The portrait has a subtle drop shadow; the expanded mobile navigation has a soft shadow. The modal viewer uses a solid dark full-screen surface and native dialog backdrop rather than a floating glass panel.

### Shadow Vocabulary

- **Portrait:** `drop-shadow(0 20px 25px #20304016)` keeps the transparent portrait grounded.
- **Mobile menu:** `0 15px 30px #17262f16` separates the open panel from page content.

**The Flat Surface Rule.** Use tonal surfaces and fine dividers for ordinary grouping; the existing shadows are limited to the portrait and open mobile menu.

## Shapes

Media containers use the shared media radius. Primary buttons and gallery labels use the smaller control radius; the mobile menu has its own intermediate radius. The hero is broader and softer at desktop, slightly tighter on phones. Fine borders are generally (1px); the active navigation underline is (2px). The gallery’s selected thumbnail receives a (2px) outline.

Lists, native service disclosures, and text sections generally remain unboxed. Admin fields retain square corners; their appearance is not evidence that public media should lose its rounded containment.

## Components

### Buttons and text actions

The primary action is cobalt with white text, the control radius, a minimum height of (50px), and padding of (13px 22px). Hover darkens the fill over (0.2s). Text actions are underlined with a quiet divider-colored underline, a (44px) minimum height, and cobalt hover text. Disabled buttons use a waiting cursor and reduced opacity.

Hero actions use a wrapping flex row with a (12px) gap and stretch alignment. Both links have a (48px) minimum height, (14px) semibold (600) text, (6px) corners, (12px 20px) padding, and a (140px) minimum width bounded by the available space. The primary uses cobalt; the secondary has a transparent background, hero-ink text, and a (1px) current-color outline. Labels may wrap and increase height. Defaults are “View projects” → `/work` and “Get in touch” → `/contact`; both stay editable in Introduction. Only exact shipped legacy action pairs normalize to these defaults; custom values are retained. No database migration or reseeding is needed.

Home, shared project cards, and shared contact invitations use text and hover/focus treatments rather than decorative diagonal arrows. Keep functional previous/next controls in galleries and pagination. Homepage service rows remain full-width navigation links; the selected row, hover, and keyboard focus use cobalt, with an underlined “View service” action.

Links, buttons, disclosure summaries, and form controls receive a cobalt (3px) focus outline with a (5px) offset. Do not infer a universal pressed treatment: source defines only the component states that exist.

### Navigation

Social profiles use filled LinkedIn and GitHub brand SVGs from Font Awesome Free (CC BY 4.0), with attribution retained in `components/BrandIcons.tsx`. They inherit the existing text color, use the shared icon sizing, and are hidden from assistive technology because their links already have accessible names. Generic business/code icons remain available for other content; only the shipped social label/icon pairs are normalized. Admin previews and public rendering share the same registry. The two logos add no external font or icon service.

The logo and two-line name anchor the left edge; Work, About, Services, Blog, and Contact form a compact row. Current routes have cobalt text and an underline. At the mobile breakpoint, a labeled (44px) menu toggle opens a paper panel with a fine border, radius, and shadow. It closes on route selection, Escape, outside pointer interaction, or focus leaving its links. Escape returns focus to the toggle. It is a disclosure menu, not a modal focus trap.

### Project cards and previews

The artifact leads the card; caption metadata, a linked title, description, and underlined project action sit outside the image mat. Hover gently scales cover imagery to (1.025) over (0.6s) with the shared easing curve. A project without an image shows an explicit text preview using its actual problem, category, and tags, rather than a fabricated screenshot. Image failures show “Image unavailable.”

Home shows the first three public projects in its compact preview variant. It uses the first description sentence, shortened from a (220-character) clipping window with a word boundary and ellipsis when needed, followed by up to four saved technology tags separated by fine bottom rules. The first project retains the featured image-and-caption split. Work and project detail pages retain complete descriptions; the compact presentation does not change CMS content.

### Gallery and native dialog

Every detail-page image is a labeled button with a small “View image” badge. The native modal dialog fills the viewport. It provides a close control, fit/original zoom toggle, original-file link, caption, image count, and, for multiple images, arrows and a horizontally scrollable thumbnail strip. Left/right keys cycle images; Escape closes; closing restores focus to the opener and body scrolling. Switching images resets zoom and error state.

Previews use image quality (90); detail and fitted viewer images use (95). The initial detail image is eager with high fetch priority. Original zoom uses the unoptimized immutable original at natural size in a scrollable stage. Failure feedback includes retry where the control is not nested inside another button. Captions and alternative text remain meaningful.

### Home About teaser

“A person behind the pixels” pairs the same uncropped, user-supplied portrait with the CMS introduction on the soft surface. A ruled three-column capability strip shows the first three active CMS technology groups in saved order, with their existing cobalt category icons. The complete biography remains on About. Shared image corners and a fine footer rule frame the underlined “More about me” link. Home omits the saved contact location; location content elsewhere remains unchanged. The original PNG remains unchanged, with responsive quality-(95) lazy delivery. The existing `#about` anchor, CMS content ownership, and Services layout are preserved; no database migration is required.

### About portrait, biography, and approach

The About opening uses the shared paper canvas, ink, Manrope, image radius, and underlined text actions. On desktop, an uncropped portrait occupies the left column; the heading and personal introduction occupy the right. The portrait retains its natural aspect ratio, with an identity/location caption below. Introductory copy is limited to (42ch). The biography repeats the aligned two-column rhythm; facts sit below as a ruled four-column list. Up to two published project covers with saved images follow as genuine work previews, linked to their detail pages and shown uncropped on soft mats. The preview section is omitted when no eligible projects exist. Working principles use light, divided heading-and-description rows with the saved category icons. The shared dark contact invitation closes the page.

Tools use the soft surface with a connected discipline map and a selected-tools inspector. Each discipline is a native button with an icon, label, and `aria-pressed` state; the first active discipline is initially selected. Selected buttons receive cobalt borders and icons. The inspector updates its heading and saved tool labels, announces the update politely, and separates tool labels with fine bottom rules. CMS active state and ordering remain authoritative; no illustrative tools enter runtime content.

The user supplied `public/images/nimantha-about.png` at (3506 × 4381px); the original PNG is used unchanged. Responsive image delivery uses quality (95) and preload without cropping the portrait. Existing CMS biography, facts, tool groups, principles, ordering, and visibility remain authoritative. This refinement adds no photo-upload schema or new content ownership rule.

### Home service explorer

Home pairs a conceptual schematic and the selected description with the published service navigation list. The six services in the reviewed content use native links to `/services#service-{id}`; CMS active state and ordering remain authoritative. The first published service is initially selected. Keyboard focus or non-touch pointer entry changes the diagram, title, and description; touch activation follows the link. Each newly selected schematic runs its existing finite cobalt connection trace once. Selection remains navigation rather than a tab or disclosure.

The preview has a flat soft-surface mat, caption rule, and no enclosing rounded border. The explorer uses a (0.9fr / 1.1fr) split and a responsive (32–80px) gap; at or below (768px), its preview sits above the links, capped at (480px). Rows have fine dividers, a saved category icon, title, and underlined action, with (76px) minimum height, tightening to (70px) on narrow screens. With JavaScript unavailable, the first preview and every native service link remain usable; unpublished services produce explanatory empty text.

### Service disclosures and process

Services use native `details`/`summary` rows with top dividers, saved category icons, compact titles, and a plus icon rotating (45deg) when open. The first active service starts open; selecting another opens that row and updates the conceptual schematic, while selecting the open row closes it. Existing `#service-{id}` deep links open the matching row. The desktop schematic retains the last selection if every row is closed. With no published services, explanatory empty text replaces the list and no schematic is shown.

The schematic uses code-native interface, logic, data, and flow geometry chosen from the saved service category. It is explicitly captioned “Conceptual view,” with an accessible description, rather than presented as a delivered project. Paper nodes, charcoal connections, cobalt ports, and one finite cobalt trace sit on the soft surface within the shared media radius. On narrow screens, only the open row contains its schematic. The process uses connected circular (40px) number nodes, cobalt tabular numerals, and fine neutral connecting rules; the vertical sequence begins at (1100px), before a disconnected wrapped row can form. Published descriptions and process ordering remain unchanged.

### Contact and feedback

The shared contact invitation remains a dark tonal section with a large underlined contact link. The Contact page uses a smaller editorial heading beside a dark connection panel with code-native globe geometry. The globe is decorative, not a map of client locations or activity. Saved location and availability remain visible beside active, non-placeholder social profile links. Existing LinkedIn and GitHub brand icons retain their established treatment.

The panel repeats the saved location beside a real clock with tabular numerals. A location matching “Sri Lanka” uses `Asia/Colombo` and the “Local time” label; other saved locations use an explicit “UTC” label rather than an inferred local zone. The direct email link uses `mailto:`. Copy email keeps its text action and reserved status area; actual clipboard success or failure is announced and cleared after (5s). Email text wraps, and panel actions receive a paper-colored keyboard focus outline for contrast. The optional WhatsApp action sits below Copy email, separated by a fine rule, with the Font Awesome brand SVG, “Chat on WhatsApp,” and the saved number. It inherits the panel foreground and focus treatment; absent or invalid numbers produce no action. Admin Contact includes a labeled optional telephone field, format example, associated guidance, and validation.

Home testimonials form an open editorial composition on the soft surface. A compact heading column sits beside an automatically advancing native scroll-snap rail with manual controls with a (48–100px) responsive gap. Each review occupies the rail’s full width and preserves its complete quotation, a small cobalt quote mark, and initials-only attribution. All quotes use the same responsive (1.35–1.85rem) scale with (1.6) leading and a (42ch) measure. Circular (44px) initials sit beside the name and role/company, (32px) below the quotation. There are no white panels, enclosing card borders, card radii, or hover lift. The heading stacks above the rail at (960px).

After JavaScript enhancement, a fine ruled control row shows a “Review n of total” counter and (44px) previous/next buttons when multiple reviews exist. Automatic advances are not announced; the counter is polite when reduced motion disables rotation. Boundary buttons disable at the first and last review. The focusable rail and individual quotations retain native keyboard focus and scrolling; swipe, trackpad, and keyboard browsing remain available; the native scrollbar is visually hidden. All published quotes stay in the document in saved order. Without JavaScript, controls stay hidden and a swipe/scroll hint accompanies the native rail, so no inert buttons appear. Reviews advance every (6s) while at least half the rail is visible, then return immediately from the last to the first. Rotation pauses on hover, keyboard focus, hidden tabs, and offscreen content. Rotation resumes after hover and focus leave. Manual navigation keeps the same automatic rotation; no pause/play control is displayed. Reduced motion disables automatic rotation and makes button scrolling immediate. Only genuine published feedback belongs in runtime content; omit the section when none is published.

### Fields and CMS boundary

There is no public contact form. The media editor’s labeled inputs/textareas have a fine neutral border, full width, square corners, (9px) padding, and a small label gap. Existing login and other CMS controls retain legacy navy/white utility colors and square forms. This document records that pre-existing variation; it does not declare a completed CMS visual migration.

### Journal discovery and article reader

The saved blog page heading (the CMS `eyebrow` field) becomes the journal's actual page title; the saved `title` is its opening statement. The complete saved introduction lives in a native “About this journal” disclosure. Featured copy remains below the feature, and the saved featured title labels its section for assistive technology. The featured article is omitted from the ordinary archive to avoid duplicate cards; filtered results may include it. Published article titles, excerpts, metadata, and active topics remain CMS-owned.

Cards keep open captions below rounded visuals, with quiet metadata, underlined topic links, and a “Read article” action. Real uploaded covers remain unchanged and use cover fitting. Absent or failed covers, and only the exact shipped portrait seed path `/images/nimantha-hero.png`, reveal topic-based code-native geometry. These decorative SVGs are conceptual editorial art, not product screenshots. Featured geometry uses paper strokes on cobalt; ordinary cards and readers use cobalt strokes on the soft surface. No generated raster is required.

The ruled discovery bar pairs wrapping topic links with a labeled search field and a (44px) icon submit button. Active topics use cobalt text and a (2px) underline; the field uses a single charcoal bottom rule. Search and topic selection persist as `q` and `topic` URL parameters, preserving shareable links, browser history, and native GET submission without JavaScript. Search matches the title, excerpt, and active topic names. Clear-filter and empty-result paths lead back to the archive. Existing loader rules remain authoritative for drafts and inactive categories; this visual change adds no database or blog API contract.

Article contents are a native open disclosure with links to stable, unique heading IDs; second-level and third-level headings appear in the list, with nested headings indented. Complete source wording is retained. A fixed cobalt (3px) reading-position bar measures article copy through animation-frame updates. Up to two published articles close the reader, prioritizing shared topics and preserving saved order for ties and remaining suggestions. Ordinary links, native disclosures, and the shared focus treatment remain usable without enhancement.

### Motion and reading

Project hover uses the shared easing; primary and text actions use brief color transitions. About, Services, and Contact add one-time section entrances of (550ms) with a small (12px) vertical movement. Content is visible before enhancement; the observer unobserves entered sections and disconnects on unmount. Toolkit selection uses a (250ms) entrance. Service traces run once over (900ms); the contact connection trace runs once over (1400ms). These interior effects add no infinite decorative loops. Home reuses the service trace on selection; the feedback rail advances every (6s) when visible and idle, with reading pauses and manual navigation. Reduced motion disables this automatic rotation.

Reduced motion leaves all content and selected state visible, stops spatial entrances and wire traces, and removes toolkit/toggle transitions. Smooth page scrolling is also disabled, with existing global animations and transitions effectively removed. Articles use deliberate paragraph/heading spacing, underlined cobalt links, dark code blocks, and horizontally scrollable code or tables where required.

Only the journal's featured conceptual visual draws its connection trace, once over (900ms); archive and reader visuals remain still. Reduced motion removes the trace animation. The journal adds no autoplay.

## Do's and Don'ts

### Do:

- **Do** reuse the public palette and self-hosted variable Manrope.
- **Do** preserve the hero’s name, portrait, and introduction relationship, including its stacked tablet layout.
- **Do** show real project images in full, preserve captions, and keep original-resolution access.
- **Do** retain visible keyboard focus, native disclosure/dialog behavior, and reduced-motion support.
- **Do** represent unavailable images and missing feedback honestly.

### Don't:

- **Don't** invent screenshots, testimonials, client claims, or decorative replacement media.
- **Don't** enlarge gallery images beyond their intrinsic width or crop project screenshots to fill a frame.
- **Don't** spread the hero’s blue-gray surface across every page; ordinary content uses paper and surface neutrals.
- **Don't** replace open lists and dividers with nested cards or add unrelated gradients and glow.
- **Don't** treat fixture-based review or the limited finish review as live Supabase or full-site approval.

Public element defaults belong to Tailwind's base layer so admin utility typography and control sizing take precedence. Testimonial focus explicitly aligns the focused review with the visible rail; reduced-motion settings keep that alignment immediate. These fixes preserve the existing public palette and compositions.
