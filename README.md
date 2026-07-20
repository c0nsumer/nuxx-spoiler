# Spoiler

Hide images, whole groups of blocks, or inline text behind a click-to-reveal content warning: blurred images, blacked-out text. Useful for spoilers, NSFW content, medical images, or anything else a reader should opt into seeing.

<img src="assets/nuxx-spoiler-image.png" alt="Static example image hidden by the Spoiler block: blurred, with a SPOILER pill and a Click to show hint overlaid." width="500">

*Static example image hidden by the Spoiler block: blurred, with a SPOILER pill and a Click to show hint overlaid.*

## Read More

Read more about this plugin and see examples of it in use [over here at nuxx.net](https://nuxx.net/blog/2026/07/20/nuxx-spoiler-the-wordpress-plugin/)


## Features

- **Spoiler block**: Wrap any content (images, galleries, paragraphs, embeds) in a container that blurs it under a translucent overlay with a warning pill. Click to reveal; a small corner button hides it again.
- **Image spoiler toggle**: Tagged image blocks get a "Hide behind a spoiler" setting that blurs the image exactly where it sits: floats, captions, sizing, and text wrap are untouched.
- **Inline spoiler text format**: Obscure a word or phrase mid-sentence with a solid bar. Click (or focus + Enter/Space) toggles it.
- **Warning label presets**: Spoiler, NSFW, Medical image, Content warning, Graphic content, Flashing lights, Nudity, plus a free-text field, per block.
- **First-class editor integration**:
  - Block inserter entry (search "spoiler", "nsfw", "hide", "blur"...)
  - "Turn into Spoiler": Select any block(s) and transform them into a Spoiler; *Ungroup* (in the block's options menu) transforms back. A lone Image block is steered to its own spoiler setting instead, since wrapping a floated image would break text flow.
  - Toolbar button for the inline format (under the ¶ formatting menu).
  - "Preview hidden state" toolbar toggle so you can see what visitors will see.
- **Accessibility-minded**: The overlay is a real button; the block's hidden content is `inert` and `aria-hidden` until revealed, so screen readers, tab order, and find-in-page can't leak it. Reveal/re-hide manage focus. `prefers-reduced-motion` is respected.
- **The block and the image toggle fail closed without JavaScript**: Their markup ships in the hidden state, so no JS means the content stays hidden. The inline format's bar is CSS-drawn and always loads, but without JavaScript the hidden text remains readable to screen readers and find-in-page (the ARIA state is applied at runtime).
- **Uninstall-safe**: Uninstalling the plugin leaves content un-hidden, for safe fallback if the plugin becomes unsupported/incompatible/undesirable.

## Caveats

Remember that this is courtesy hiding, not security. The content is present in the page HTML and appears un-hidden in RSS feeds and to non-CSS-parsing viewers. It is not a security tool.

## Installation

1. Download the latest release zip from the [releases page](https://github.com/c0nsumer/nuxx-spoiler/releases).
2. In WordPress admin: Plugins → Add New Plugin → Upload Plugin → choose the zip → Activate.

## Development

Requires Node.js ≥ 20.10.

```sh
npm install
npm run build        # production build into build/
npm run start        # watch mode
npm run env start    # local WordPress via wp-env (requires Docker)
npm run plugin-zip   # build an installable release zip
```

## Translations

Translations for ten locales are bundled (`de_DE`, `es_ES`, `fr_FR`, `it_IT`, `nl_NL`, `pl_PL`, `pt_BR`, `ru_RU`, `ja`, `zh_CN`) and load automatically when a site uses one of those languages. They are machine translations (AI-generated) that have not been reviewed by native speakers - corrections are very welcome, either as edits to the `.po` files in `languages/` or to the source table in `tools/translations.json`.

To regenerate after strings change (requires `wp-env` running):

```sh
npm run env run cli -- wp i18n make-pot wp-content/plugins/<dir> wp-content/plugins/<dir>/languages/nuxx-spoiler.pot --exclude=node_modules,src --domain=nuxx-spoiler
python3 tools/generate-po.py languages/nuxx-spoiler.pot tools/translations.json languages
npm run env run cli -- wp i18n make-mo wp-content/plugins/<dir>/languages
npm run env run cli -- wp i18n make-json wp-content/plugins/<dir>/languages --no-purge
```

## Theming

The inline spoiler bar color can be overridden by a theme:

```css
:root {
	--nuxx-spoiler-bar: #333;
}
```

## License

GPL-2.0-or-later. See [LICENSE](LICENSE).
