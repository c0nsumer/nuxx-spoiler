/**
 * Front-end behavior: reveal / re-hide for the Spoiler block and the inline
 * spoiler format. Markup ships in the hidden state (blur + inert), so
 * without JavaScript content stays hidden — this script only ever reveals.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

const EYE_OFF_SVG =
	'<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>';

function setBlockHidden( root, contents, overlay, hidden ) {
	root.classList.toggle( 'is-revealed', ! hidden );
	overlay.setAttribute( 'aria-expanded', hidden ? 'false' : 'true' );

	contents.forEach( ( content ) => {
		if ( hidden ) {
			content.setAttribute( 'inert', '' );
			content.setAttribute( 'aria-hidden', 'true' );
		} else {
			content.removeAttribute( 'inert' );
			content.removeAttribute( 'aria-hidden' );
		}
	} );
}

function initBlockSpoiler( root ) {
	const overlay = root.querySelector( ':scope > .nuxx-spoiler__overlay' );

	if ( ! overlay ) {
		return;
	}

	// The Spoiler block wraps its content in a single container div; the
	// image-block variant (.nuxx-spoiler--media) is the figure itself, so
	// its hidden elements are the figure's own children.
	const contents = root.classList.contains( 'nuxx-spoiler--media' )
		? [ ...root.children ].filter(
				( el ) =>
					! el.classList.contains( 'nuxx-spoiler__overlay' ) &&
					! el.classList.contains( 'nuxx-spoiler__rehide' )
		  )
		: [ root.querySelector( ':scope > .nuxx-spoiler__content' ) ].filter(
				Boolean
		  );

	if ( ! contents.length ) {
		return;
	}

	const rehide = document.createElement( 'button' );
	rehide.type = 'button';
	rehide.className = 'nuxx-spoiler__rehide';
	rehide.title = __( 'Hide again', 'nuxx-spoiler' );
	rehide.setAttribute(
		'aria-label',
		__( 'Hide content again', 'nuxx-spoiler' )
	);
	rehide.innerHTML = EYE_OFF_SVG;
	root.appendChild( rehide );

	overlay.addEventListener( 'click', () => {
		setBlockHidden( root, contents, overlay, false );
		rehide.focus();
	} );

	rehide.addEventListener( 'click', () => {
		setBlockHidden( root, contents, overlay, true );
		overlay.focus();
	} );
}

function initInlineSpoiler( span ) {
	// Wrap the hidden text so it can be aria-hidden while the outer element
	// acts as the labeled, focusable control.
	const inner = document.createElement( 'span' );
	inner.className = 'nuxx-spoiler-inline__text';
	inner.setAttribute( 'aria-hidden', 'true' );

	while ( span.firstChild ) {
		inner.appendChild( span.firstChild );
	}
	span.appendChild( inner );

	const hiddenLabel = __( 'Hidden text; activate to reveal', 'nuxx-spoiler' );
	const hoverHint = __( 'Hidden text — click to show', 'nuxx-spoiler' );
	span.setAttribute( 'role', 'button' );
	span.setAttribute( 'tabindex', '0' );
	span.setAttribute( 'aria-expanded', 'false' );
	span.setAttribute( 'aria-label', hiddenLabel );
	span.setAttribute( 'title', hoverHint );

	const toggle = () => {
		const revealed = span.classList.toggle( 'is-revealed' );
		span.setAttribute( 'aria-expanded', revealed ? 'true' : 'false' );

		if ( revealed ) {
			inner.removeAttribute( 'aria-hidden' );
			// Let the accessible name come from the now-visible text.
			span.removeAttribute( 'aria-label' );
			span.removeAttribute( 'title' );
		} else {
			inner.setAttribute( 'aria-hidden', 'true' );
			span.setAttribute( 'aria-label', hiddenLabel );
			span.setAttribute( 'title', hoverHint );
		}
	};

	span.addEventListener( 'click', toggle );
	span.addEventListener( 'keydown', ( event ) => {
		if ( event.key === 'Enter' || event.key === ' ' ) {
			event.preventDefault();
			toggle();
		}
	} );
}

function init() {
	document.querySelectorAll( '.nuxx-spoiler' ).forEach( ( root ) => {
		if ( ! root.dataset.spoilerInit ) {
			root.dataset.spoilerInit = 'true';
			initBlockSpoiler( root );
		}
	} );

	// .wp-spoiler-inline is the legacy class stored in content by pre-1.4
	// versions of the inline format; keep recognizing it.
	document
		.querySelectorAll( '.nuxx-spoiler-inline, .wp-spoiler-inline' )
		.forEach( ( span ) => {
			if ( ! span.dataset.spoilerInit ) {
				span.dataset.spoilerInit = 'true';
				initInlineSpoiler( span );
			}
		} );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', init );
} else {
	init();
}
