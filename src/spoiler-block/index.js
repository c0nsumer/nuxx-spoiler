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
				isMatch: ( attributes, blocks ) =>
					! (
						blocks.length === 1 &&
						blocks[ 0 ].name === metadata.name
					),
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
