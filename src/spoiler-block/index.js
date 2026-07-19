/**
 * WordPress dependencies
 */
import { registerBlockType, createBlock, cloneBlock } from '@wordpress/blocks';
import { unseen } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import metadata from './block.json';
import '../inline-format';
import '../image-extension';
import './style.scss';
import './editor.scss';

registerBlockType( metadata.name, {
	icon: unseen,
	edit: Edit,
	save,
	transforms: {
		from: [
			{
				type: 'block',
				isMultiBlock: true,
				blocks: [ '*' ],
				isMatch: ( attributes, blocks ) => {
					if ( blocks.length !== 1 ) {
						return true;
					}

					// Don't offer wrapping for a lone Spoiler block, or
					// for a lone Image block — images should use their
					// own "Hide behind a spoiler" setting, which blurs
					// in place without breaking text flow. (Transforms
					// cannot redirect to a different block type, so the
					// option is hidden rather than repurposed.)
					return (
						blocks[ 0 ].name !== metadata.name &&
						blocks[ 0 ].name !== 'core/image'
					);
				},
				__experimentalConvert: ( blocks ) =>
					createBlock(
						metadata.name,
						{},
						blocks.map( ( block ) => cloneBlock( block ) )
					),
			},
		],
		ungroup: ( attributes, innerBlocks ) => innerBlocks,
	},
} );
