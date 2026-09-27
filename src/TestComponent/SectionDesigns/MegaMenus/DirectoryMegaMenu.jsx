// LocalDirectoryMegaMenuCollection

// DirectoryMegaMenu · Section designs › Mega menus

// Description:
// Dropdown panel content for an independent city / business directory (fictional
// "Good Neighbor" brand). Depending on `variant` the visitor sees category link lists,
// a mock faceted search with nearby places, editorial field guides, a B2B directory of
// verified studios or neighbourhood walking loops.

// Design:
// - Five hard-coded layouts in dark forest-green tones (plus one light variant) with lime #d9f064 highlights and responsive grids (1 column on mobile, 3-4 from md/lg).
// - Variant 1 — "Local Guilds": #14201e panel, "4,820 Personally Verified Local Establishments" header, three category link columns (Food & Provisions, Home & Architecture, Craft & Repair) and a "Guide of the Month" card with a "Download Offline Map" link.
// - Variant 2 — "Power Search": light #f5f8f5 panel, read-only search field with a "Filters (4 active)" button, static filter chips and three nearby-place cards (distance, opening hours, rating).
// - Variant 3 — "Curated Guides": #182622 panel, three editorial guide cards with Unsplash cover image (zoom on hover), serif title and author/location.
// - Variant 4 — "Verified Studios": #12201c panel, "Post Anonymous RFP" pill link and three B2B category cards (studio count, minimum budget, example studios) with "View Studios & Verified Reviews" links.
// - Variant 5 — "District Walks": #1b2b27 panel, walking-score header and three district cards (city, loop length, highlights) with "Open GPS Walking Loop" links.

// What it does:
// - variant picks one of five panel files in MegaMenus/directory/: 1 → MegaMenu01 (LocalGuildsMegaMenu),
//   2 → MegaMenu02 (PowerSearchMegaMenu), 3 → MegaMenu03 (CuratedGuidesMegaMenu),
//   4 → MegaMenu04 (VerifiedStudiosMegaMenu), 5 → MegaMenu05 (DistrictWalksMegaMenu).
//   Any other value renders MegaMenu05.
// - Anchors in Variants 1, 4 and 5 call `closeMenu` on click (placeholder hrefs such as "#cat", "#rfp", "#map-loop").
// - Variants 2 and 3 contain no links and never call `closeMenu`; the Variant 2 "Filters" button has no click handler.
// - Purely presentational: no search/filter logic, state or effects; all data is hard-coded.
// - `accent` is destructured with a default but never referenced; all colours are hard-coded Tailwind values.
// - Normally rendered by MegaMenu (category "directory"), which normalises `variant` to 1-5 and supplies `closeMenu`.

// @param {object} props
// @param {number} [props.variant=1] Design to render (1-5); unknown values render Variant 5.
// @param {Function} props.closeMenu Called on click of the links/CTAs (Variants 1, 4, 5) so the parent mega menu can close.
// @param {string} [props.accent='#527354'] Accent colour; accepted but currently unused (colours are hard-coded).
// @param {'md'} [props.size='md'] Only size; exposed as data-size (no visual change).
// @param {boolean} [props.disabled=false] Exposed as data-disabled (no visual change).
// @param {boolean} [props.loading=false] Exposed as data-disabled (no visual change).
// @param {string} [props.className] Passed to the chosen panel, which merges it onto its root <div> with cn().
// @param {object} [props.rest] Any other props (id, aria-*, ref, handlers) are passed to the chosen panel.

// Usage example:
// ```jsx
// import { useState } from 'react';
// import LocalDirectoryMegaMenuCollection from '@/TestComponent/SectionDesigns/MegaMenus/DirectoryMegaMenu';

// function GuildsMenu() {
//     const [open, setOpen] = useState(true)
//     return open ? <LocalDirectoryMegaMenuCollection variant={1} closeMenu={() => setOpen(false)} /> : null
// }

// // Usual route: MegaMenu picks this component for category="directory"
// // <MegaMenu category="directory" variant={1} accent="#d9f064" label="Local Guilds" />
// ```


'use client'

import LocalGuildsMegaMenu from './directory/MegaMenu01';
import PowerSearchMegaMenu from './directory/MegaMenu02';
import CuratedGuidesMegaMenu from './directory/MegaMenu03';
import VerifiedStudiosMegaMenu from './directory/MegaMenu04';
import DistrictWalksMegaMenu from './directory/MegaMenu05';

const menus = {
    1: LocalGuildsMegaMenu,
    2: PowerSearchMegaMenu,
    3: CuratedGuidesMegaMenu,
    4: VerifiedStudiosMegaMenu,
    5: DistrictWalksMegaMenu,
}

export function LocalDirectoryMegaMenuCollection({
    variant = 1,
    size = 'md',
    disabled = false,
    loading = false,
    closeMenu,
    accent = '#527354',
    className,
    ...props
}) {
    const Menu = menus[variant] || menus[5]

    return (
        <Menu
            size={size}
            disabled={disabled}
            loading={loading}
            closeMenu={closeMenu}
            className={className}
            {...props}
        />
    )
}

export default LocalDirectoryMegaMenuCollection