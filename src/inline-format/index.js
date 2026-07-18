/**
 * Inline spoiler text format for hiding a word or phrase mid-sentence.
 * Applied text renders as `<span class="wp-spoiler-inline">` and is shown as
 * a black bar on the front end until clicked (see view.js / style.scss).
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerFormatType, toggleFormat } from '@wordpress/rich-text';
import {
	RichTextShortcut,
	RichTextToolbarButton,
} from '@wordpress/block-editor';
import { unseen } from '@wordpress/icons';

const FORMAT_NAME = 'nuxx/spoiler-inline';

function Edit( { isActive, value, onChange, onFocus } ) {
	const onToggle = () => {
		onChange( toggleFormat( value, { type: FORMAT_NAME } ) );
		onFocus();
	};

	return (
		<>
			<RichTextShortcut type="access" character="s" onUse={ onToggle } />
			<RichTextToolbarButton
				icon={ unseen }
				title={ __( 'Spoiler', 'nuxx-spoiler' ) }
				onClick={ onToggle }
				isActive={ isActive }
				shortcutType="access"
				shortcutCharacter="s"
			/>
		</>
	);
}

registerFormatType( FORMAT_NAME, {
	title: __( 'Spoiler', 'nuxx-spoiler' ),
	tagName: 'span',
	className: 'wp-spoiler-inline',
	edit: Edit,
} );
