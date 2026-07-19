<?php
/**
 * Plugin Name:       Spoiler
 * Plugin URI:        https://github.com/c0nsumer/nuxx-spoiler
 * Description:       Blur images and obscure text behind a click-to-reveal content warning. Adds a Spoiler block and an inline spoiler text format to the block editor.
 * Version:           1.8.0
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
