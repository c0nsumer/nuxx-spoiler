/**
 * Image-block spoiler toggle: adds "Hide behind a spoiler" to the core
 * Image block's settings, following the same extension pattern core uses
 * for its own lightbox toggle. The front-end markup is produced by a
 * render_block filter in PHP, so the figure itself stays the layout
 * element - floats, captions, and text wrap are untouched.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { LabelControls } from '../label-controls';

addFilter(
	'blocks.registerBlockType',
	'nuxx-spoiler/image-attributes',
	( settings, name ) => {
		if ( name !== 'core/image' ) {
			return settings;
		}

		return {
			...settings,
			attributes: {
				...settings.attributes,
				nuxxSpoiler: { type: 'boolean', default: false },
				nuxxSpoilerLabel: { type: 'string', default: '' },
			},
		};
	}
);

const withSpoilerControls = createHigherOrderComponent(
	( BlockEdit ) =>
		function SpoilerImageControls( props ) {
			if ( props.name !== 'core/image' ) {
				return <BlockEdit { ...props } />;
			}

			const { attributes, setAttributes } = props;
			const { nuxxSpoiler, nuxxSpoilerLabel } = attributes;

			return (
				<>
					<BlockEdit { ...props } />
					<InspectorControls>
						<PanelBody
							title={ __( 'Spoiler', 'nuxx-spoiler' ) }
							initialOpen={ !! nuxxSpoiler }
						>
							<ToggleControl
								__nextHasNoMarginBottom
								label={ __(
									'Hide behind a spoiler',
									'nuxx-spoiler'
								) }
								help={ __(
									'Blur the image in place until a visitor clicks to show it.',
									'nuxx-spoiler'
								) }
								checked={ !! nuxxSpoiler }
								onChange={ ( value ) =>
									setAttributes( { nuxxSpoiler: value } )
								}
							/>
							{ nuxxSpoiler && (
								<LabelControls
									value={ nuxxSpoilerLabel }
									onChange={ ( value ) =>
										setAttributes( {
											nuxxSpoilerLabel: value,
										} )
									}
								/>
							) }
						</PanelBody>
					</InspectorControls>
				</>
			);
		},
	'withSpoilerControls'
);

addFilter(
	'editor.BlockEdit',
	'nuxx-spoiler/image-controls',
	withSpoilerControls
);

const withSpoilerIndicator = createHigherOrderComponent(
	( BlockListBlock ) =>
		function SpoilerImageIndicator( props ) {
			if (
				props.name !== 'core/image' ||
				! props.attributes.nuxxSpoiler
			) {
				return <BlockListBlock { ...props } />;
			}

			return (
				<BlockListBlock
					{ ...props }
					className="nuxx-spoiler is-spoiler-editor"
					wrapperProps={ {
						...props.wrapperProps,
						'data-spoiler-label':
							props.attributes.nuxxSpoilerLabel ||
							__( 'Spoiler', 'nuxx-spoiler' ),
					} }
				/>
			);
		},
	'withSpoilerIndicator'
);

addFilter(
	'editor.BlockListBlock',
	'nuxx-spoiler/image-indicator',
	withSpoilerIndicator
);
