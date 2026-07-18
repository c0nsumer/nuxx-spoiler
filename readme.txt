=== Spoiler ===
Contributors: c0nsumer
Tags: spoiler, content warning, nsfw, blur, block
Requires at least: 6.5
Tested up to: 7.0
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Blur images and obscure text behind a click-to-reveal content warning.

== Description ==

Hide content a reader should opt into seeing — spoilers, NSFW material, medical images — behind a blur with a warning label. One click reveals it; a small button hides it again.

Two mechanisms:

* **Spoiler block** — wraps any blocks (images, galleries, paragraphs, embeds) and blurs them under an overlay with a warning pill. Label presets (Spoiler, NSFW, Medical image, Content warning) plus free text.
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

= 1.0.0 =
* Initial release: Spoiler block, inline spoiler format, label presets, keyboard shortcut, transforms.
