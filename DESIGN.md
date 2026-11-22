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

- **Display:** general page headings; the project title and article title use their own smaller responsive clamps in source.
- **Hero Display:** heavier, tighter name lettering. The desktop token is overridden by tablet and phone rules described in Layout.
- **Headline:** section headings; **Title:** normal third-level headings.
- **Body:** inherited base size with relaxed leading. **Lead:** introductory copy.
- **Label:** navigation. **Button:** slightly heavier action text.
- **Article Body:** longer reading text, with a centered reading column, explicit heading spacing, and underlined inline links.

Use the token roles as the default hierarchy, not as a requirement to make every page title identical. Introductory copy is commonly limited to (65ch); section-heading descriptions use (30ch).

## Layout

The main shell is centered with a maximum width of (1180px) and desktop side gutters of (40px). The header has its own wider maximum of (1320px). Sections normally use (100px) vertical padding; page introductions use (85px) above and (65px) below. Open two-column grids, dividers, and changes in surface color establish grouping.

Project lists use two columns with (65px) row and (35px) column gaps. The first featured project spans the grid with a (1.5fr / 1fr) image-and-caption split and a divider. Other projects use image or text previews above captions. The first blog item also spans its grid with an image-and-text composition. The article reading shell is capped at (760px).

The desktop hero sits inside a (30px) surround, up to (1760px) wide, with a viewport-related height clamped by (720px) minimum and (980px) maximum. The name anchors left, the portrait is centered at (51%) and sized to (80%) height, and the introduction sits right. The transparent portrait remains fully visible rather than becoming a cropped cover.

Responsive behavior follows the actual CSS cascade:

- At or below (1100px), the hero stacks into name → portrait → introduction. The dedicated (801px–1100px) override removes the maximum height, uses a (480px) portrait and (5rem) name, and keeps the normal desktop navigation until its own breakpoint. The portrait is centered with normal flow and no translate transform.
- At or below (800px), the shell gutters become (20px), section padding becomes (65px), navigation becomes a menu panel, and the hero uses a (14px) surround, (390px) portrait, and responsive name size. Featured projects and the leading blog card become vertical. Split copy and contact sections stack; many other content grids remain two-column.
- At or below (560px), project, service, project-context, blog, and media-editor grids become one column. The portrait becomes (330px) tall. Hero actions share a wrapping row; the stacked frame grows with longer labels. Brand logos form two columns and footer rows stack. About and testimonials have their own content-driven breakpoints described below.
- Above (1500px), the hero name’s maximum width tightens to (42%); the portrait remains centered at (51%).

About has its own responsive layout: at or below (960px), tools place their heading above the groups and facts become two columns. At or below (700px), the opening becomes title → portrait → introduction; the portrait is capped at (420px) wide, while biography and principle rows stack. Tool groups become one column at (480px). Long tool names wrap within their column rather than causing horizontal overflow.

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

Home, shared project cards, and shared contact invitations use text and hover/focus treatments rather than decorative diagonal arrows. Keep functional previous/next controls in galleries and pagination. Homepage service rows remain full-width links with underlined cobalt text on hover/focus.

Links, buttons, disclosure summaries, and form controls receive a cobalt (3px) focus outline with a (5px) offset. Do not infer a universal pressed treatment: source defines only the component states that exist.

### Navigation

Social profiles use filled LinkedIn and GitHub brand SVGs from Font Awesome Free (CC BY 4.0), with attribution retained in `components/BrandIcons.tsx`. They inherit the existing text color, use the shared icon sizing, and are hidden from assistive technology because their links already have accessible names. Generic business/code icons remain available for other content; only the shipped social label/icon pairs are normalized. Admin previews and public rendering share the same registry. The two logos add no external font or icon service.

The logo and two-line name anchor the left edge; Work, About, Services, Blog, and Contact form a compact row. Current routes have cobalt text and an underline. At the mobile breakpoint, a labeled (44px) menu toggle opens a paper panel with a fine border, radius, and shadow. It closes on route selection, Escape, outside pointer interaction, or focus leaving its links. Escape returns focus to the toggle. It is a disclosure menu, not a modal focus trap.

### Project cards and previews

The artifact leads the card; caption metadata, a linked title, description, and underlined project action sit outside the image mat. Hover gently scales cover imagery to (1.025) over (0.6s) with the shared easing curve. A project without an image shows an explicit text preview using its actual problem, category, and tags, rather than a fabricated screenshot. Image failures show “Image unavailable.”

### Gallery and native dialog

Every detail-page image is a labeled button with a small “View image” badge. The native modal dialog fills the viewport. It provides a close control, fit/original zoom toggle, original-file link, caption, image count, and, for multiple images, arrows and a horizontally scrollable thumbnail strip. Left/right keys cycle images; Escape closes; closing restores focus to the opener and body scrolling. Switching images resets zoom and error state.

Previews use image quality (90); detail and fitted viewer images use (95). The initial detail image is eager with high fetch priority. Original zoom uses the unoptimized immutable original at natural size in a scrollable stage. Failure feedback includes retry where the control is not nested inside another button. Captions and alternative text remain meaningful.

### Home About teaser

“A person behind the pixels” pairs the same uncropped, user-supplied portrait with the complete CMS introduction and biography on the soft surface. Shared image corners and a fine footer rule connect the underlined “More about me” link to the saved contact location; the location is omitted when empty. The original PNG remains unchanged, with responsive quality-(95) lazy delivery. The existing `#about` anchor, CMS content ownership, and Services layout are preserved; no database migration is required.

### About portrait, biography, and approach

The About opening uses the shared paper canvas, ink, Manrope, image radius, and underlined text actions. On desktop, an uncropped portrait occupies the left column; the heading and personal introduction occupy the right. The portrait retains its natural aspect ratio, with an identity/location caption below. Introductory copy is limited to (42ch). The biography repeats the aligned two-column rhythm; facts sit below as a ruled four-column list. Tools use the soft surface with open, ruled groups; working principles use light, divided heading-and-description rows. The shared dark contact invitation closes the page.

The user supplied `public/images/nimantha-about.png` at (3506 × 4381px); the original PNG is used unchanged. Responsive image delivery uses quality (95) and preload without cropping the portrait. Existing CMS biography, facts, tool groups, principles, ordering, and visibility remain authoritative. This refinement adds no photo-upload schema or new content ownership rule.

### Service disclosures and process

Services use native `details`/`summary` rows with top dividers, a large title, generous vertical padding, and a plus icon rotating (45deg) when open. The body stays within (75ch). The process uses a horizontal numbered sequence on larger screens and a single vertical ruled sequence at the mobile breakpoint. Numbers use cobalt and tabular numerals.

### Contact and feedback

The contact invitation is a dark tonal section with a large underlined contact link. Contact uses direct email and social links. Copy email uses a text action and a reserved status area; actual clipboard success or failure is announced and cleared after (5s).

Testimonials form an open editorial composition on the soft surface. A compact heading column sits beside the quotations with a (48–100px) responsive gap. The first quotation leads at (24–32px), with a small cobalt quote mark; further reviews use smaller body type in paired columns separated by fine neutral top rules. A final unpaired review spans the available width. There are no white panels, enclosing borders, card radii, or minimum heights. Circular (44px) text initials sit beside the name and role/company as one attribution group, (24–32px) below the complete quotation. The heading stacks above the reviews at (960px); paired reviews become one column at (640px). Preserve admin order, initials-only identity, and the supplied wording. These are static reading surfaces with no hover lift. Only genuine published feedback belongs in runtime content; omit the section when none is published.

### Fields and CMS boundary

There is no public contact form. The media editor’s labeled inputs/textareas have a fine neutral border, full width, square corners, (9px) padding, and a small label gap. Existing login and other CMS controls retain legacy navy/white utility colors and square forms. This document records that pre-existing variation; it does not declare a completed CMS visual migration.

### Motion and reading

Project hover uses the shared easing; primary and text actions use brief color transitions. Smooth page scrolling is disabled under reduced motion, with animations and transitions effectively removed. Articles use deliberate paragraph/heading spacing, underlined cobalt links, dark code blocks, and horizontally scrollable code or tables where required.

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
