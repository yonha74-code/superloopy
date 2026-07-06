# DESIGN

## Atmosphere / Signature

This clone follows the local source J-Vers site shell: sharp editorial typography, high-contrast white/navy bands, and motion-led layouts. The intentional deviations are limited to Superloopy copy, the first viewport, proof-oriented replacement imagery, crew member illustrations, and Blueyard WebGL scenes where the cloned ornaments felt too close to the source brand.

## Color

- Background light: source computed white / `--source-bg-light`
- Background navy: source deep navy section color / `--source-bg-navy`
- Accent lavender: source hero and form gradient color / `--source-accent-lavender`
- Hero orbit warm base: `#fff0cf` / `--superloopy-blueyard-hero-bg`
- Hero badge shadow: `rgba(27, 29, 32, 0.28)` / `--superloopy-hero-badge-shadow`
- Install section cool base: `#e6eeec` / `--superloopy-command-section-bg`
- Install section paper middle: `#f5f5ee` / `--superloopy-command-section-paper`
- Install section warm edge: `#f2e0d4` / `--superloopy-command-section-warm`
- Install command surface: `#fffdf8` / `--superloopy-command-card`
- Install command line: `#101217` / `--superloopy-command-line`
- Install command ink: `#101217` / `--superloopy-command-ink`
- Install command code ink: `#f7f5ef` / `--superloopy-command-code-ink`
- Install command muted: `#5f6872` / `--superloopy-command-muted`
- Install command prompt: `#8ed081` / `--superloopy-command-prompt`
- Install copy button: `#fff7e5` / `--superloopy-command-copy-bg`
- Install copy button ink: `#101217` / `--superloopy-command-copy-ink`
- Install accent: `#e8774f` / `--superloopy-command-accent`
- Start CTA base: `#101217` / `--superloopy-cta-bg`
- Start CTA lift: `#293752` / `--superloopy-cta-bg-alt`
- Start CTA accent: `#e8774f` / `--superloopy-cta-accent`
- Start CTA accent glow: `rgba(232, 119, 79, 0.42)` / `--superloopy-cta-accent-glow`
- Start CTA warm edge: `#3a261f` / `--superloopy-cta-warm`
- Start CTA border: `rgba(255, 247, 229, 0.38)` / `--superloopy-cta-border`
- Start CTA shine: `rgba(255, 247, 229, 0.24)` / `--superloopy-cta-shine`
- Start CTA shadow: `rgba(17, 25, 43, 0.22)` / `--superloopy-cta-shadow`
- Proof image wash: `#f8efe0` / `--superloopy-proof-image-bg`
- Eye scene base: `#fff0cf` / `--superloopy-eye-bg`
- Eye scene frame: `#c9f2ec` / `--superloopy-eye-frame-bg`
- Eye scene frame start: `#d6f6ee` / `--superloopy-eye-frame-start`
- Eye scene frame end: `#b4c3ff` / `--superloopy-eye-frame-end`
- Eye scene glow: `rgba(255, 255, 255, 0.76)` / `--superloopy-eye-glow`
- Eye scene soft glow: `rgba(189, 239, 232, 0.64)` / `--superloopy-eye-glow-soft`
- Eye scene shadow: `rgba(9, 11, 17, 0.16)` / `--superloopy-eye-frame-shadow`
- Eye scene progress rail: `rgba(16, 18, 23, 0.18)` / `--superloopy-eye-progress-bg`
- Loading overlay wash: `rgba(255, 240, 207, 0.96)` / `--superloopy-loader-bg`
- Loading rail: `rgba(16, 18, 23, 0.14)` / `--superloopy-loader-rail`
- Loading rail fill: `rgba(16, 18, 23, 0.86)` / `--superloopy-loader-fill`
- Media radius: `0.8rem` / `--superloopy-media-radius`
- Install command card shadow: `rgba(18, 22, 27, 0.08)` / `--superloopy-command-card-shadow`
- Install command copy border: `rgba(255, 247, 229, 0.14)` / `--superloopy-command-copy-border`
- Install command copy inner line: `rgba(255, 247, 229, 0.08)` / `--superloopy-command-copy-inner`
- Install command copy shadow: `rgba(16, 18, 23, 0.12)` / `--superloopy-command-copy-shadow`
- Foreground dark: source computed black text / `--source-fg-dark`
- Foreground light: source computed white text / `--source-fg-light`
- Border: source currentColor opacity borders / `--source-border`

## Typography

- Font stack: original Next-hosted woff2 files under `/_next/static/media`.
- Display: source `.h2` and headline classes, all values preserved from original CSS.
- Body: source body and paragraph classes, all values preserved from original CSS.
- Labels: source uppercase medium labels, all values preserved from original CSS.

## Spacing

- Spacing scale: original utility classes and CSS bundles are preserved verbatim.
- Container/gutters: source `.container` rules from `/_next/static/css`.
- Section rhythm: source `pt-*`, `pb-*`, grid, and gap utility classes are preserved in the DOM.

## Components

- Header/menu: original server-rendered DOM, CSS, and Next runtime chunks, with one compact EN/DE/KR/ES locale control, GitHub icons for social links, and a plain GitHub text link injected after hydration.
- Hero: original split heading spans, CTA, and scroll cue, with the first-section video layer hidden and replaced by Blueyard's `landing-orb` WebGL iframe. The original J-Vers lavender whirl is replaced by the supplied transparent Superloopy badge image at `/assets/superloopy-hero-badge.png`.
- Start CTA: original button DOM with a dark ink base, warm accent light, subtle shine pass, and preserved arrow affordance.
- Orbit loader: a full-viewport warm wash with Superloopy wordmark and an indeterminate linear rail. It appears immediately, clears after the orbit iframe load event, and falls back to a timed dismiss so users never get trapped.
- Content sections: original CMS image blocks, cards, counters, case metrics, and step list, rewritten where visible copy needs to describe Superloopy.
- Crew imagery: cloned person imagery is swapped after hydration for local crew member assets under `/crew`, cropped to fill the media frame instead of floating inside it.
- Proof imagery: the four feature cards use generated, non-person images for evidence receipts, skill lanes, visible progress, and the final gate.
- Eye scene: the steps section uses a dedicated local WebGL renderer for Blueyard's `/webgl/models/eye.glb` iris-line geometry inside a sticky, scroll-reactive model stage with a rendered preview fallback instead of the original gear ornament. On desktop the stage uses a viewport-height clamp so the biology visual feels sectional instead of preview-card sized; mobile keeps the compact source-safe aspect.
- Dead proof link: the `/proof` open-proof CTA is hidden because the static clone has no proof page to open.
- Install command section: the original partner form DOM is replaced after hydration with two terminal-style command cards for Codex and Claude Code, each with a right-side copy button wired to the clipboard.
- FAQ/footer: original DOM and runtime interactions.

## Motion

- Original Next runtime and bundled animation code are retained outside the first hero media layer.
- GLTF/GLB models under `/models` and `/webgl/models` are mirrored locally so the original runtime and the dedicated biology eye renderer can draw from local assets. The eye renderer maps section scroll progress to camera, group position, and group rotation, with pointer movement adding a small camera-pivot response. It renders only while near the viewport and caps pixel ratio for performance.
- Orbit loader motion uses transform and opacity only, with reduced-motion switching the rail to a static filled state.

## Depth

- Depth comes from the original page plus targeted Superloopy layers: WebGL orbit/eye scenes, flat editorial cards, generated proof boards, crew image blocks, and source CSS shadows/borders.
- New styling is constrained to documented Superloopy tokens above.
