/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	BlockControls,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { PanelBody, ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { seen, unseen } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { LabelControls } from '../label-controls';

export default function Edit( { attributes, setAttributes } ) {
	const { label } = attributes;
	const [ isPreviewingHidden, setIsPreviewingHidden ] = useState( false );
	const effectiveLabel = label || __( 'Spoiler', 'nuxx-spoiler' );

	const blockProps = useBlockProps( {
		className:
			'nuxx-spoiler is-spoiler-editor' +
			( isPreviewingHidden ? ' is-preview-hidden' : '' ),
		'data-spoiler-label': effectiveLabel,
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'nuxx-spoiler__content' },
		{ template: [ [ 'core/paragraph' ] ] }
	);

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={ isPreviewingHidden ? seen : unseen }
						label={
							isPreviewingHidden
								? __( 'Show content', 'nuxx-spoiler' )
								: __( 'Preview hidden state', 'nuxx-spoiler' )
						}
						isPressed={ isPreviewingHidden }
						onClick={ () =>
							setIsPreviewingHidden( ! isPreviewingHidden )
						}
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'Warning label', 'nuxx-spoiler' ) }>
					<LabelControls
						value={ label }
						onChange={ ( value ) =>
							setAttributes( { label: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div { ...innerBlocksProps } />
				{ isPreviewingHidden && (
					<div className="nuxx-spoiler__overlay" aria-hidden="true">
						<span className="nuxx-spoiler__pill">
							{ effectiveLabel }
						</span>
						<span className="nuxx-spoiler__hint">
							{ __( 'Click to show', 'nuxx-spoiler' ) }
						</span>
					</div>
				) }
			</div>
		</>
	);
}
