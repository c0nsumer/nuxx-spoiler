/**
 * Registers an editor-wide keyboard shortcut (Shift+Alt+S / Ctrl+Option+S)
 * that wraps the selected blocks in a Spoiler block, or unwraps a selected
 * Spoiler block. When the cursor is inside rich text, the inline spoiler
 * format's own shortcut (same combination) takes over instead.
 *
 * The shortcut is registered in the keyboard-shortcuts store so it appears
 * in the editor's shortcut help modal, but the actual handling uses a
 * document-level listener: components rendered through registerPlugin mount
 * outside the editor's ShortcutProvider, so useShortcut() would never bind.
 * Gutenberg re-dispatches keydown events from the canvas iframe to the top
 * document, so one listener covers both.
 */

/**
 * WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins';
import { store as keyboardShortcutsStore } from '@wordpress/keyboard-shortcuts';
import { isKeyboardEvent } from '@wordpress/keycodes';
import { useEffect } from '@wordpress/element';
import { select, useDispatch } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { createBlock, cloneBlock } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

const SHORTCUT_NAME = 'nuxx-spoiler/wrap';
const BLOCK_NAME = 'nuxx/spoiler';

function SpoilerShortcut() {
	const { registerShortcut } = useDispatch( keyboardShortcutsStore );
	const { replaceBlocks, multiSelect } = useDispatch( blockEditorStore );

	useEffect( () => {
		registerShortcut( {
			name: SHORTCUT_NAME,
			category: 'block',
			description: __(
				'Wrap the selected blocks in a Spoiler block (or unwrap a selected Spoiler block).',
				'nuxx-spoiler'
			),
			keyCombination: {
				modifier: 'access',
				character: 's',
			},
		} );
	}, [ registerShortcut ] );

	useEffect( () => {
		const onKeyDown = ( event ) => {
			if ( ! isKeyboardEvent.access( event, 's' ) ) {
				return;
			}

			if ( event.defaultPrevented ) {
				return;
			}

			// A text selection inside rich text is handled by the inline
			// format's RichTextShortcut.
			if ( event.target?.isContentEditable ) {
				return;
			}

			const clientIds =
				select( blockEditorStore ).getSelectedBlockClientIds();

			if ( ! clientIds.length ) {
				return;
			}

			const blocks =
				select( blockEditorStore ).getBlocksByClientId( clientIds );

			if ( blocks.some( ( block ) => ! block ) ) {
				return;
			}

			event.preventDefault();

			if ( blocks.length === 1 && blocks[ 0 ].name === BLOCK_NAME ) {
				const inner = blocks[ 0 ].innerBlocks.map( ( block ) =>
					cloneBlock( block )
				);
				replaceBlocks( clientIds, inner );

				// Keep every released block selected so pressing the
				// shortcut again wraps them all back up.
				if ( inner.length > 1 ) {
					multiSelect(
						inner[ 0 ].clientId,
						inner[ inner.length - 1 ].clientId
					);
				}
				return;
			}

			replaceBlocks(
				clientIds,
				createBlock(
					BLOCK_NAME,
					{},
					blocks.map( ( block ) => cloneBlock( block ) )
				)
			);
		};

		document.addEventListener( 'keydown', onKeyDown );

		return () => document.removeEventListener( 'keydown', onKeyDown );
	}, [ replaceBlocks, multiSelect ] );

	return null;
}

registerPlugin( 'nuxx-spoiler-shortcut', { render: SpoilerShortcut } );
