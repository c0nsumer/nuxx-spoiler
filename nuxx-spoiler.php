<?php
/**
 * Plugin Name:       Spoiler
 * Plugin URI:        https://github.com/c0nsumer/nuxx-spoiler
 * Description:       Blur images and obscure text behind a click-to-reveal content warning. Adds a Spoiler block and an inline spoiler text format to the block editor.
 * Version:           1.10.0
 * Requires at least: 6.5
 * Requires PHP:      7.4
 * Author:            Steve Vigneau
 * Author URI:        https://nuxx.net/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       nuxx-spoiler
 *
 * @package NuxxSpoiler
 */

defined( 'ABSPATH' ) || exit;

/**
 * Register the Spoiler block (block.json lives in the build output) and
 * wire up translations bundled in languages/ (a .pot template lives there;
 * WordPress also checks wp-content/languages/plugins on its own).
 */
function nuxx_spoiler_init() {
	load_plugin_textdomain(
		'nuxx-spoiler',
		false,
		dirname( plugin_basename( __FILE__ ) ) . '/languages'
	);

	$block_type = register_block_type( __DIR__ . '/build/spoiler-block' );

	if ( $block_type ) {
		$script_handles = array_merge(
			(array) $block_type->editor_script_handles,
			(array) $block_type->view_script_handles
		);

		foreach ( $script_handles as $handle ) {
			wp_set_script_translations(
				$handle,
				'nuxx-spoiler',
				__DIR__ . '/languages'
			);
		}
	}
}
add_action( 'init', 'nuxx_spoiler_init' );

/**
 * The block's assets load automatically where the block appears, but the
 * inline spoiler format can occur in any rendered content (posts, synced
 * patterns, template parts, widgets) and its hiding is CSS-based — if the
 * stylesheet is missing, hidden text displays in the clear. Always load
 * the small front-end style and view script so the format fails closed.
 */
function nuxx_spoiler_enqueue_front_end_assets() {
	$block_type = WP_Block_Type_Registry::get_instance()->get_registered( 'nuxx/spoiler' );

	if ( ! $block_type ) {
		return;
	}

	foreach ( (array) $block_type->view_script_handles as $handle ) {
		wp_enqueue_script( $handle );
	}

	foreach ( (array) $block_type->style_handles as $handle ) {
		wp_enqueue_style( $handle );
	}
}
add_action( 'wp_enqueue_scripts', 'nuxx_spoiler_enqueue_front_end_assets' );

/**
 * Image-block spoiler toggle: when an Image block has the nuxxSpoiler
 * attribute (set in the editor by src/image-extension), transform its
 * figure in place — the figure stays the layout element, so floats,
 * captions, and text wrap are unaffected. The hidden state (inert,
 * aria-hidden, overlay) is server-rendered so it fails closed without
 * JavaScript, like the Spoiler block.
 *
 * @param string $block_content Rendered block HTML.
 * @param array  $block         Parsed block, including attrs.
 * @return string Filtered block HTML.
 */
function nuxx_spoiler_filter_image_block( $block_content, $block ) {
	if ( empty( $block['attrs']['nuxxSpoiler'] ) ) {
		return $block_content;
	}

	$figure_end = strrpos( $block_content, '</figure>' );

	if ( false === $figure_end ) {
		return $block_content;
	}

	$label = ! empty( $block['attrs']['nuxxSpoilerLabel'] )
		? $block['attrs']['nuxxSpoilerLabel']
		: __( 'Spoiler', 'nuxx-spoiler' );

	$processor = new WP_HTML_Tag_Processor( $block_content );

	if ( ! $processor->next_tag( 'figure' ) ) {
		return $block_content;
	}

	$processor->add_class( 'nuxx-spoiler' );
	$processor->add_class( 'nuxx-spoiler--media' );

	// Hide the figure's content from assistive tech and interaction
	// until revealed; view.js lifts these on reveal.
	while ( $processor->next_tag() ) {
		if ( in_array( $processor->get_tag(), array( 'A', 'IMG', 'FIGCAPTION' ), true ) ) {
			$processor->set_attribute( 'inert', true );
			$processor->set_attribute( 'aria-hidden', 'true' );
		}
	}

	$html = $processor->get_updated_html();

	$overlay = sprintf(
		'<button type="button" class="nuxx-spoiler__overlay" aria-expanded="false" aria-label="%s"><span class="nuxx-spoiler__pill">%s</span><span class="nuxx-spoiler__hint">%s</span></button>',
		esc_attr( sprintf( /* translators: %s: warning label, e.g. "NSFW". */ __( 'Show hidden content: %s', 'nuxx-spoiler' ), $label ) ),
		esc_html( $label ),
		esc_html__( 'Click to show', 'nuxx-spoiler' )
	);

	// Re-locate the closing tag: attribute edits changed offsets.
	$figure_end = strrpos( $html, '</figure>' );

	return substr_replace( $html, $overlay, $figure_end, 0 );
}
add_filter( 'render_block_core/image', 'nuxx_spoiler_filter_image_block', 10, 2 );
