/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * The block is rendered server-side (render.php), so only the inner blocks
 * are persisted here.
 */
export default function save() {
	return <InnerBlocks.Content />;
}
