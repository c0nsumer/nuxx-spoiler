<?php
/**
 * Plugin Name:       Spoiler
 * Plugin URI:        https://nuxx.net/
 * Description:       Blur images and obscure text behind a click-to-reveal content warning. Adds a Spoiler block and an inline spoiler text format to the block editor.
 * Version:           1.0.0
 * Requires at least: 6.5
 * Requires PHP:      7.4
 * Author:            Steve @ nuxx.net
 * Author URI:        https://nuxx.net/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       nuxx-spoiler
 *
 * @package NuxxSpoiler
 */

defined( 'ABSPATH' ) || exit;

/**
 * Register the Spoiler block (block.json lives in the build output).
 */
function nuxx_spoiler_init() {
	register_block_type( __DIR__ . '/build/spoiler-block' );
}
add_action( 'init', 'nuxx_spoiler_init' );

/**
 * The block's style/view script only load when the block is present. The
 * inline spoiler text format can appear in posts that contain no Spoiler
 * block, so enqueue the same assets when any queried post uses it.
 */
function nuxx_spoiler_maybe_enqueue_inline_assets() {
	if ( is_admin() ) {
		return;
	}

	$posts = isset( $GLOBALS['wp_query']->posts ) ? $GLOBALS['wp_query']->posts : array();

	foreach ( (array) $posts as $queried_post ) {
		if ( empty( $queried_post->post_content ) ) {
			continue;
		}

		if ( false === strpos( $queried_post->post_content, 'wp-spoiler-inline' ) ) {
			continue;
		}

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

		return;
	}
}
add_action( 'wp_enqueue_scripts', 'nuxx_spoiler_maybe_enqueue_inline_assets' );
