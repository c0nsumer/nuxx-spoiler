<?php
/**
 * Front-end render for the Spoiler block.
 *
 * Ships in the hidden state so content stays obscured without JavaScript;
 * view.js handles reveal/re-hide. The inner content is inert + aria-hidden
 * until revealed so screen readers and tab order cannot reach it.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Inner blocks markup.
 * @var WP_Block $block      Block instance.
 *
 * @package NuxxSpoiler
 */

$nuxx_spoiler_label = ! empty( $attributes['label'] )
	? $attributes['label']
	: __( 'Spoiler', 'nuxx-spoiler' );
?>
<div <?php echo get_block_wrapper_attributes( array( 'class' => 'wp-spoiler' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="wp-spoiler__content" inert aria-hidden="true">
		<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- inner blocks markup. ?>
	</div>
	<button
		type="button"
		class="wp-spoiler__overlay"
		aria-expanded="false"
		aria-label="<?php echo esc_attr( sprintf( /* translators: %s: warning label, e.g. "NSFW". */ __( 'Reveal hidden content: %s', 'nuxx-spoiler' ), $nuxx_spoiler_label ) ); ?>"
	>
		<span class="wp-spoiler__pill"><?php echo esc_html( $nuxx_spoiler_label ); ?></span>
		<span class="wp-spoiler__hint"><?php esc_html_e( 'Click to reveal', 'nuxx-spoiler' ); ?></span>
	</button>
</div>
