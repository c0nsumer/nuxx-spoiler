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

defined( 'ABSPATH' ) || exit;

$nuxx_spoiler_label = ! empty( $attributes['label'] )
	? $attributes['label']
	: __( 'Spoiler', 'nuxx-spoiler' );

// Dynamic blocks must output the anchor themselves; WordPress only
// serializes it into static save markup.
$nuxx_spoiler_wrapper = array( 'class' => 'nuxx-spoiler' );
if ( ! empty( $attributes['anchor'] ) ) {
	$nuxx_spoiler_wrapper['id'] = $attributes['anchor'];
}
?>
<div <?php echo get_block_wrapper_attributes( $nuxx_spoiler_wrapper ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="nuxx-spoiler__content" inert aria-hidden="true">
		<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- inner blocks markup. ?>
	</div>
	<button
		type="button"
		class="nuxx-spoiler__overlay"
		aria-expanded="false"
		aria-label="<?php echo esc_attr( sprintf( /* translators: %s: warning label, e.g. "NSFW". */ __( 'Show hidden content: %s', 'nuxx-spoiler' ), $nuxx_spoiler_label ) ); ?>"
	>
		<span class="nuxx-spoiler__pill"><?php echo esc_html( $nuxx_spoiler_label ); ?></span>
		<span class="nuxx-spoiler__hint"><?php esc_html_e( 'Click to show', 'nuxx-spoiler' ); ?></span>
	</button>
</div>
