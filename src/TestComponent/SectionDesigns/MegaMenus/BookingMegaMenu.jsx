// TravelStaysBookingMegaMenuCollection

// BookingMegaMenu · Section designs › Mega menus

// Description:
// Dropdown panel content for a boutique stays / travel-booking website (fictional
// "Elsewhere" brand). Depending on `variant` the visitor browses architectural villas,
// a mock search bar with trending destinations, stay collections by typology, hosted
// experiences or discounted weekend deals, each with a reserve/book CTA.

// Design:
// - Five hard-coded layouts in deep teal tones (plus one light cream variant) with terracotta #e07d5b highlights, serif headlines and responsive card grids.
// - Variant 1 — "Architectural Stays": #102530 panel, three villa cards with Unsplash photo (zoom on hover), price badge, location, star rating, amenities and a "Reserve Sanctuary" link.
// - Variant 2 — "Destination Finder": light #f7f5f0 panel, white search widget (read-only Where "Kyoto, Japan", static When/Guests, "Search 420 Stays" button) and a row of trending-destination pill links.
// - Variant 3 — "Stays by Typology": #14232c panel, four collection cards (Mid-Century Modern, Wilderness Treehouses, Historic Watchtowers, Overwater Sanctuaries) with property counts and "Explore Collection" links.
// - Variant 4 — "Host Experiences": #1a2d36 panel, header with a "Host an Experience" pill link and three experience cards (location/duration, title, price per guest, rating, "Reserve" link).
// - Variant 5 — "Weekend Escapes": #0e1d24 panel, "Save Up to 35%" header with static countdown text and three deal cards (drive time, was/now price, dates) with "Instant Book Weekend" button-links.

// What it does:
// - variant picks one of five panel files in MegaMenus/booking/: 1 → MegaMenu01 (ArchitecturalStaysMegaMenu),
//   2 → MegaMenu02 (DestinationFinderMegaMenu), 3 → MegaMenu03 (StaysByTypologyMegaMenu),
//   4 → MegaMenu04 (HostExperiencesMegaMenu), 5 → MegaMenu05 (WeekendEscapesMegaMenu).
//   Any other value renders MegaMenu05.
// - Every anchor and the Variant 2 search button call `closeMenu` on click; hrefs are placeholders (e.g. "#book-villa", "#dest", "#browse-type", "#instant-book").
// - Purely presentational: no real search, booking or countdown logic; all data is hard-coded and there is no state or effect.
// - `accent` is destructured with a default but never referenced; all colours are hard-coded Tailwind values.
// - Normally rendered by MegaMenu (category "booking"), which normalises `variant` to 1-5 and supplies `closeMenu`.

// @param {object} props
// @param {number} [props.variant=1] Design to render (1-5); unknown values render Variant 5.
// @param {Function} props.closeMenu Called on click of every link/CTA so the parent mega menu can close.
// @param {string} [props.accent='#b65f47'] Accent colour; accepted but currently unused (colours are hard-coded).
// @param {'md'} [props.size='md'] Only size; exposed as data-size (no visual change).
// @param {boolean} [props.disabled=false] Exposed as data-disabled (no visual change).
// @param {boolean} [props.loading=false] Exposed as data-disabled (no visual change).
// @param {string} [props.className] Passed to the chosen panel, which merges it onto its root <div> with cn().
// @param {object} [props.rest] Any other props (id, aria-*, ref, handlers) are passed to the chosen panel.

// Usage example:
// ```jsx
// import { useState } from 'react';
// import TravelStaysBookingMegaMenuCollection from '@/TestComponent/SectionDesigns/MegaMenus/BookingMegaMenu';

// function StaysMenu() {
//     const [open, setOpen] = useState(true)
//     return open ? <TravelStaysBookingMegaMenuCollection variant={2} closeMenu={() => setOpen(false)} /> : null
// }

// // Usual route: MegaMenu picks this component for category="booking"
// // <MegaMenu category="booking" variant={2} accent="#b65f47" label="Destination Finder" />
// ```


'use client'

import ArchitecturalStaysMegaMenu from './booking/MegaMenu01';
import DestinationFinderMegaMenu from './booking/MegaMenu02';
import StaysByTypologyMegaMenu from './booking/MegaMenu03';
import HostExperiencesMegaMenu from './booking/MegaMenu04';
import WeekendEscapesMegaMenu from './booking/MegaMenu05';

const menus = {
    1: ArchitecturalStaysMegaMenu,
    2: DestinationFinderMegaMenu,
    3: StaysByTypologyMegaMenu,
    4: HostExperiencesMegaMenu,
    5: WeekendEscapesMegaMenu,
}

export function TravelStaysBookingMegaMenuCollection({
    variant = 1,
    size = 'md',
    disabled = false,
    loading = false,
    closeMenu,
    accent = '#b65f47',
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

export default TravelStaysBookingMegaMenuCollection