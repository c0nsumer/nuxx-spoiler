=== Spoiler ===
Contributors: c0nsumer
Tags: spoiler, content warning, nsfw, blur, block
Requires at least: 6.5
Tested up to: 7.0
Requires PHP: 7.4
Stable tag: 1.12.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Hide images, groups of blocks, or inline text behind a blurred, click-to-reveal content warning.

== Description ==

Hide content a reader should opt into seeing - spoilers, NSFW material, medical images - behind a blur with a warning label. One click reveals it; a small button hides it again.

Three mechanisms:

* **Spoiler block**: Wraps any blocks (images, galleries, paragraphs, embeds) and blurs them under an overlay with a warning pill. Label presets (Spoiler, NSFW, Medical image, Content warning, Graphic content, Flashing lights, Nudity) plus free text.
* **Image spoiler toggle**: A "Hide behind a spoiler" setting on every Image block that blurs the image exactly where it sits, leaving floats, captions, and text wrap untouched. The blur covers the image only; captions stay visible (use the Spoiler block if a caption itself must be hidden).
* **Inline spoiler format**: Obscures a word or phrase mid-sentence with a solid bar.

Editor integration: block inserter entry, "Turn into Spoiler" transform for existing blocks (Ungroup transforms back), and an inline-format toolbar button.

Accessibility: the overlay is a real button, and hidden content is inert and aria-hidden until revealed so screen readers, tab order, and find-in-page cannot reach it. The block and the image toggle fail closed without JavaScript - their markup ships in the hidden state. The inline format's bar is drawn with CSS that always loads; without JavaScript it stays visually obscured but remains readable to screen readers and find-in-page, since its ARIA state is applied at runtime.

Note: this is courtesy hiding, not security. Content is present in the page HTML and appears un-hidden in RSS feeds.

== Frequently Asked Questions ==

= Does the reveal persist across page loads? =

No. A reload re-hides everything.

= Can I change the inline bar color? =

Yes, via the `--nuxx-spoiler-bar` CSS custom property.

= Is hidden content removed from the page source? =

No. It ships blurred and inert but is present in the HTML and in RSS feeds. It is a courtesy tool, not a security tool.

== Changelog ==

= 1.12.0 =
* First production release.
