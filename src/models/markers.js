export const MARKERS = {
    EMPTY: 0,
    FIRST_PLAYER: 1,
    SECOND_PLAYER: 2
}

export function getMarkerText(marker) {
    if (marker === MARKERS.FIRST_PLAYER) {
        return 'X'
    }

    if (marker === MARKERS.SECOND_PLAYER) {
        return 'O'
    }

    return ''
}

export const MARKER_SVG = {
  [MARKERS.FIRST_PLAYER]: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="X">
        <path d="M16 16 48 48M48 16 16 48" fill="none" stroke="#d64545" stroke-width="9" stroke-linecap="round"/>
    </svg>
  `,

  [MARKERS.SECOND_PLAYER]: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="O">
        <circle cx="32" cy="32" r="20" fill="none" stroke="#277e63" stroke-width="9"/>
    </svg>
  `
}

export function getMarkerSvg(marker) {
  return MARKER_SVG[marker] || ''
}
