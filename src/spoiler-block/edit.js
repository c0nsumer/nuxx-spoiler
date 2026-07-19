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
import {
	Button,
	Flex,
	FlexItem,
	PanelBody,
	TextControl,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { seen, unseen } from '@wordpress/icons';

const PRESET_LABELS = [
	__( 'Spoiler', 'nuxx-spoiler' ),
	__( 'NSFW', 'nuxx-spoiler' ),
	__( 'Medical image', 'nuxx-spoiler' ),
	__( 'Content warning', 'nuxx-spoiler' ),
];

export default function Edit( { attributes, setAttributes } ) {
	const { label } = attributes;
	const [ isPreviewingHidden, setIsPreviewingHidden ] = useState( false );
	const effectiveLabel = label || __( 'Spoiler', 'nuxx-spoiler' );

	const blockProps = useBlockProps( {
		className:
			'wp-spoiler is-spoiler-editor' +
			( isPreviewingHidden ? ' is-preview-hidden' : '' ),
		'data-spoiler-label': effectiveLabel,
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'wp-spoiler__content' },
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
					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Label', 'nuxx-spoiler' ) }
						help={ __(
							'Shown on the overlay so visitors know why the content is hidden.',
							'nuxx-spoiler'
						) }
						placeholder={ __( 'Spoiler', 'nuxx-spoiler' ) }
						value={ label }
						onChange={ ( value ) =>
							setAttributes( { label: value } )
						}
					/>
					<Flex wrap gap={ 2 } justify="flex-start">
						{ PRESET_LABELS.map( ( preset ) => (
							<FlexItem key={ preset }>
								<Button
									size="small"
									variant={
										label === preset
											? 'primary'
											: 'secondary'
									}
									onClick={ () =>
										setAttributes( { label: preset } )
									}
								>
									{ preset }
								</Button>
							</FlexItem>
						) ) }
					</Flex>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div { ...innerBlocksProps } />
				{ isPreviewingHidden && (
					<div className="wp-spoiler__overlay" aria-hidden="true">
						<span className="wp-spoiler__pill">
							{ effectiveLabel }
						</span>
						<span className="wp-spoiler__hint">
							{ __( 'Click to show', 'nuxx-spoiler' ) }
						</span>
					</div>
				) }
			</div>
		</>
	);
}
