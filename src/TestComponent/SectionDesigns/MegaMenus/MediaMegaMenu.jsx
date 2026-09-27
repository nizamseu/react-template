// EditorialMediaMegaMenuCollection

// MediaMegaMenu · Section designs › Mega menus

// Description:
// The panel content for magazine, news and podcast navbars, normally rendered by MegaMenu
// (category="media"). It shows one of five publishing designs: a Sunday broadsheet with a
// newsletter sign-up, a podcast player, a high-contrast gazette index, a live news wire,
// or a photo monograph showcase.

// Design:
// - Editorial typography (serif headlines, mono metadata) with rust #a8472b or peach #e7a37c accents on paper-cream or near-black backgrounds; static data mapped into lists and cards.
// - Variant 1 — "Sunday Broadsheet": paper #f2efe9 with rust top border; 5/4/3 grid with a cover essay (image, headline, byline), "Cultural Index" story links with read times, and a newsletter box (email input + "Receive Dispatch").
// - Variant 2 — "Broadcast Podcast Player": charcoal #191919 with peach; episode card with static waveform bars, "Play Episode" button and Apple Podcasts / Spotify links, plus three series-archive links.
// - Variant 3 — "High-Contrast Gazette": black #121212 with white top border; edition header, three numbered columns of story links (Long Essays, Critique & Reviews, Field Reports) and an archive link.
// - Variant 4 — "Breaking News Wire": off-white #f7f5f2; red "BREAKING WIRE" banner with pinging dot and four timestamped, tagged news cards with a "Save" button.
// - Variant 5 — "Art Book Monograph": dark brown #1a1816; monograph header, three photo-folio cards (image, photo count, photographer) and an "Order Limited Print Edition" link.

// What it does:
// - variant picks one of five panel files in MegaMenus/media/: 1 → MegaMenu01 (SundayBroadsheetMegaMenu),
//   2 → MegaMenu02 (BroadcastPodcastPlayerMegaMenu), 3 → MegaMenu03 (HighContrastGazetteMegaMenu),
//   4 → MegaMenu04 (BreakingNewsWireMegaMenu), 5 → MegaMenu05 (ArtBookMonographMegaMenu).
//   Any other value renders MegaMenu05.
// - Most links, and the Variant 1 "Receive Dispatch" button, call closeMenu on click; the button only closes the menu, the email input is not submitted or stored.
// - The Variant 2 Apple Podcasts / Spotify links do not call closeMenu; "Play Episode" and the Variant 4 "Save" buttons have no handler, so nothing in Variant 4 closes the menu.
// - The Variant 1 cover headline and the Variant 5 folio cards have hover styles but are not links.
// - Colours are hard-coded; the accent prop is accepted but not used anywhere in the markup.

// @param {object} props
// @param {number} [props.variant=1] Design to render: 1–4, any other value falls back to Variant 5.
// @param {Function} props.closeMenu Called when a link (or the Variant 1 newsletter button) is clicked (MegaMenu passes its own close handler).
// @param {string} [props.accent='#a84f34'] Accepted for API consistency with the other category menus; currently unused.
// @param {'md'} [props.size='md'] Only size; exposed as data-size (no visual change).
// @param {boolean} [props.disabled=false] Exposed as data-disabled (no visual change).
// @param {boolean} [props.loading=false] Exposed as data-disabled (no visual change).
// @param {string} [props.className] Passed to the chosen panel, which merges it onto its root <div> with cn().
// @param {object} [props.rest] Any other props (id, aria-*, ref, handlers) are passed to the chosen panel.

// Usage example:
// ```jsx
// import { useState } from 'react';
// import EditorialMediaMegaMenuCollection from '@/TestComponent/SectionDesigns/MegaMenus/MediaMegaMenu';

// // Normally rendered for you by <MegaMenu category="media" variant={1} />
// export default function MagazineMenuPreview() {
//     const [open, setOpen] = useState(true)
//     if (!open) return null
//     return (
//         <div className="rounded-lg border border-black/15 shadow-xl">
//             <EditorialMediaMegaMenuCollection variant={1} closeMenu={() => setOpen(false)} />
//         </div>
//     )
// }
// ```


'use client'

import SundayBroadsheetMegaMenu from './media/MegaMenu01';
import BroadcastPodcastPlayerMegaMenu from './media/MegaMenu02';
import HighContrastGazetteMegaMenu from './media/MegaMenu03';
import BreakingNewsWireMegaMenu from './media/MegaMenu04';
import ArtBookMonographMegaMenu from './media/MegaMenu05';

const menus = {
    1: SundayBroadsheetMegaMenu,
    2: BroadcastPodcastPlayerMegaMenu,
    3: HighContrastGazetteMegaMenu,
    4: BreakingNewsWireMegaMenu,
    5: ArtBookMonographMegaMenu,
}

export function EditorialMediaMegaMenuCollection({
    variant = 1,
    size = 'md',
    disabled = false,
    loading = false,
    closeMenu,
    accent = '#a84f34',
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

export default EditorialMediaMegaMenuCollection