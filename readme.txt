=== Spoiler ===
Contributors: c0nsumer
Tags: spoiler, content warning, nsfw, blur, block
Requires at least: 6.5
Tested up to: 7.0
Requires PHP: 7.4
Stable tag: 1.7.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Blur images and obscure text behind a click-to-reveal content warning.

== Description ==

Hide content a reader should opt into seeing — spoilers, NSFW material, medical images — behind a blur with a warning label. One click reveals it; a small button hides it again.

Two mechanisms:

* **Spoiler block** — wraps any blocks (images, galleries, paragraphs, embeds) and blurs them under an overlay with a warning pill. Label presets (Spoiler, NSFW, Medical image, Content warning, Graphic content, Flashing lights, Nudity) plus free text.
* **Inline spoiler format** — obscures a word or phrase mid-sentence with a solid bar.

Editor integration: block inserter entry, "Turn into Spoiler" transform for existing blocks, inline-format toolbar button, and a keyboard shortcut (Shift+Alt+S / Ctrl+Option+S) that wraps selected blocks or toggles the inline format on selected text.

Accessibility: the overlay is a real button; hidden content is inert and aria-hidden until revealed so screen readers, tab order, and find-in-page cannot reach it. Without JavaScript, content stays hidden (fails closed).

Note: this is courtesy hiding, not security. Content is present in the page HTML and appears un-hidden in RSS feeds.

== Frequently Asked Questions ==

= Does the reveal persist across page loads? =

No. A reload re-hides everything.

= Can I change the inline bar color? =

Yes, via the `--nuxx-spoiler-bar` CSS custom property.

= Is hidden content removed from the page source? =

No. It ships blurred and inert but is present in the HTML and in RSS feeds. Do not use this for secrets.

== Changelog ==

= 1.7.0 =
* Three new label presets: Graphic content, Flashing lights, Nudity (translated for all bundled locales).
* Hovering hidden inline text now shows the browser's native tooltip ("Hidden text — click to show"); it disappears while the text is revealed.

= 1.6.0 =
* The spoiler wrapper now always spans the content area, like core's Group block. This replaces the shrink-wrap sizing from 1.4.1/1.5.2, which resolved percentage-based layouts (aligned figures, galleries, columns) against the wrong width on some themes. Content inside a spoiler now renders identically to the same content unwrapped, on any theme.

= 1.5.2 =
* Fixed left/right-aligned images rendering at half size inside a spoiler: core caps aligned figures at 50% of their container, which wrongly halved them against the spoiler's shrink-wrapped width.

= 1.5.1 =
* Removed the Unwrap toolbar button added in 1.5.0, keeping the block consistent with standard container blocks like Group. Use Ungroup in the block's options menu (or the keyboard shortcut) to turn a spoiler back into its contents.

= 1.5.0 =
* Added an Unwrap button to the Spoiler block's toolbar for turning a spoiler back into its contents in one click. (Ungroup in the options menu and the keyboard shortcut did this already, but were easy to miss.)

= 1.4.1 =
* The spoiler now shrink-wraps its content, so the blur, scrim, and re-hide button hug an image that is narrower than the content column instead of spanning the full column width. Use the block's alignment controls to position a shrunk spoiler.

= 1.4.0 =
* The plugin now uses the unique nuxx-spoiler slug throughout (install directory, text domain, CSS class prefix) in preparation for public distribution. Installs of earlier versions must delete the old plugin entry and install this version; content is unaffected.
* The legacy wp-spoiler-inline class stored in older posts is still recognized.

= 1.3.0 =
* Bundled translations for ten locales: German, Spanish, French, Italian, Dutch, Polish, Brazilian Portuguese, Russian, Japanese, and Simplified Chinese. These are machine translations, not yet reviewed by native speakers; corrections welcome.

= 1.2.0 =
* Overlay hint now reads "Click to show".
* Bundled-translation support: translations load from the plugin's languages/ directory, and a POT template is included for translators.

= 1.1.0 =
* Blur is now applied by the overlay (backdrop-filter), so hidden content is never scaled, clipped, or rounded and reveals exactly as authored.
* The wrapper now hugs its content, keeping the re-hide button evenly inset in the corner regardless of theme margins.
* Revealing fades the overlay out instead of removing it abruptly (disabled under reduced-motion preferences).

= 1.0.0 =
* Initial release: Spoiler block, inline spoiler format, label presets, keyboard shortcut, transforms.
