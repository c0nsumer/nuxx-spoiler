/**
 * Shared warning-label controls: a free-text field plus one-click presets.
 * Used by the Spoiler block's inspector and the Image block's spoiler panel.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, Flex, FlexItem, TextControl } from '@wordpress/components';

export const PRESET_LABELS = [
	__( 'Spoiler', 'nuxx-spoiler' ),
	__( 'NSFW', 'nuxx-spoiler' ),
	__( 'Medical image', 'nuxx-spoiler' ),
	__( 'Content warning', 'nuxx-spoiler' ),
	__( 'Graphic content', 'nuxx-spoiler' ),
	__( 'Flashing lights', 'nuxx-spoiler' ),
	__( 'Nudity', 'nuxx-spoiler' ),
];

export function LabelControls( { value, onChange } ) {
	return (
		<>
			<TextControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ __( 'Label', 'nuxx-spoiler' ) }
				help={ __(
					'Shown on the overlay so visitors know why the content is hidden.',
					'nuxx-spoiler'
				) }
				placeholder={ __( 'Spoiler', 'nuxx-spoiler' ) }
				value={ value }
				onChange={ onChange }
			/>
			<Flex wrap gap={ 2 } justify="flex-start">
				{ PRESET_LABELS.map( ( preset ) => (
					<FlexItem key={ preset }>
						<Button
							size="small"
							variant={
								value === preset ? 'primary' : 'secondary'
							}
							onClick={ () => onChange( preset ) }
						>
							{ preset }
						</Button>
					</FlexItem>
				) ) }
			</Flex>
		</>
	);
}
