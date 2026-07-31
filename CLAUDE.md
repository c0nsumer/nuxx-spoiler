# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A WordPress Gutenberg plugin ("Spoiler", text domain `nuxx-spoiler`) that hides content behind a blurred, click-to-reveal warning. Built with `@wordpress/scripts`; requires Node ≥ 20.10. There is no test suite.

## Commands

```sh
npm install
npm run build        # production build into build/ (gitignored; nuxx-spoiler.php loads the block from build/)
npm run start        # watch mode
npm run lint:js
npm run lint:css
npm run format
npm run plugin-zip   # installable release zip
npm run env start    # local WordPress via wp-env (requires Docker); plugin dir is mounted per .wp-env.json
```

## Architecture

Three user-facing features share one build entry, `src/spoiler-block/index.js`, which registers the block and side-effect-imports the other two:

1. **Spoiler block** (`src/spoiler-block/`) — a dynamic block: `save.js` persists only `<InnerBlocks.Content />`; the real front-end markup comes from `render.php`. `edit.js` provides the label inspector panel and a "preview hidden state" toolbar toggle. `index.js` also defines the "Turn into Spoiler" transform (any blocks except a lone Spoiler or lone Image — images are steered to their own toggle) and `ungroup` to transform back.
2. **Image spoiler toggle** (`src/image-extension/index.js`) — extends `core/image` with `nuxxSpoiler`/`nuxxSpoilerLabel` attributes and inspector controls via block filters. The front-end markup is produced server-side by the `render_block_core/image` filter in `nuxx-spoiler.php`, which rewrites the figure in place so floats/captions/text wrap are untouched.
3. **Inline spoiler format** (`src/inline-format/index.js`) — rich-text format `nuxx/spoiler-inline`, stored as `<span class="nuxx-spoiler-inline">`. All its interactive behavior (role, focus, ARIA, toggle) is added at runtime by `view.js`. The legacy class `.wp-spoiler-inline` (pre-1.4 content) must keep working.

Shared pieces: `src/label-controls.js` (label text field + preset buttons, used by both the block and the image panel) and `src/spoiler-block/view.js` (front-end reveal/re-hide for all three features). `nuxx-spoiler.php` force-enqueues the view script and styles on every front-end page — not just where the block appears — because the inline format can occur anywhere and its hiding is CSS-based.

## Invariants to preserve

- **Fail closed**: block and image markup ship in the hidden state (`inert`, `aria-hidden`, blur); `view.js` only ever reveals. Without JavaScript, content stays hidden. Never move the hidden state to something JS applies on load.
- **Accessibility**: hidden content is `inert` + `aria-hidden` so screen readers, tab order, and find-in-page can't leak it; reveal/re-hide manage focus (reveal focuses the re-hide button and vice versa). Accessible names must match visible text — an `aria-label` that differs from the rendered pill/hint fails WCAG 2.5.3 (Label in Name); comments in `render.php`, `nuxx-spoiler.php`, and `view.js` mark these spots. `prefers-reduced-motion` is respected in the styles.
- **Uninstall-safe**: content must render un-hidden (not broken) if the plugin is removed.
- **Version sync**: the version string lives in `package.json`, the `nuxx-spoiler.php` header, and `src/spoiler-block/block.json`. Bump all three together; commit messages use the form `1.12.1: short description`.

## Translations

All user-facing strings use the `nuxx-spoiler` text domain. Ten locales are bundled in `languages/` (`.po`/`.mo` plus md5-named `.json` files for JS strings), generated from the machine-translation table `tools/translations.json` by `tools/generate-po.py`. When strings change, add entries to `tools/translations.json` and regenerate — the full command sequence (make-pot → generate-po.py → make-mo → make-json, run through wp-env) is in README.md under "Translations".

`readme.txt` is the WordPress.org-format readme; `README.md` is for GitHub. Keep user-visible feature descriptions consistent between them.
