// CommunityHubMegaMenuCollection

// CommunityMegaMenu · Section designs › Mega menus

// Description:
// The panel content for community and forum navbars, normally rendered by MegaMenu
// (category="community"). It shows one of five community designs: guild discovery, in-person
// city meetups, trending threads with a karma leaderboard, peer Q&A reviews, or a Discord and
// open-collective hub. Links are hash anchors that close the menu when clicked.

// Design:
// - Warm dark browns (#1b1513 to #291f1b) with peach #ffccad accents, plus one light variant using terracotta #a34c38; static data mapped into cards.
// - Variant 1 — "Guilds & Spaces": #241c19 with peach top border; header with a pinging "members active" pill, three guild cards (online count, latest topic, hashtags, "Join Guild") and a "Create a Guild" link.
// - Variant 2 — "City Chapters": light #fcf8f5 with terracotta; "24 Global City Chapters" header and four meetup cards (Berlin, Tokyo, London, New York) with date, venue, spots left and "RSVP".
// - Variant 3 — "Topic Radar & Leaderboard": #1e1715; 8/4 split with three trending thread links (votes, author, replies) and a top-3 karma leaderboard.
// - Variant 4 — "Peer Q&A": #291f1b with terracotta top border; "Post a Question / Request Review" CTA and three review cards with SOLVED/ACTIVE status and "View Thread" links.
// - Variant 5 — "Discord Collective": #1b1513 with indigo Discord accents; members-online pill and three cards: live voice lounge, Open Collective ledger and community charter.

// What it does:
// - variant picks one of five panel files in MegaMenus/community/: 1 → MegaMenu01 (GuildsSpacesMegaMenu),
//   2 → MegaMenu02 (CityChaptersMegaMenu), 3 → MegaMenu03 (TopicRadarLeaderboardMegaMenu),
//   4 → MegaMenu04 (PeerQAMegaMenu), 5 → MegaMenu05 (DiscordCollectiveMegaMenu).
//   Any other value renders MegaMenu05.
// - Every <a> calls closeMenu on click; there is no state or effect. The Variant 3 leaderboard rows are not interactive.
// - Colours are hard-coded; the accent prop is accepted but not used anywhere in the markup.

// @param {object} props
// @param {number} [props.variant=1] Design to render: 1–4, any other value falls back to Variant 5.
// @param {Function} props.closeMenu Called when any link in the panel is clicked (MegaMenu passes its own close handler).
// @param {string} [props.accent='#a34c38'] Accepted for API consistency with the other category menus; currently unused.
// @param {'md'} [props.size='md'] Only size; exposed as data-size (no visual change).
// @param {boolean} [props.disabled=false] Exposed as data-disabled (no visual change).
// @param {boolean} [props.loading=false] Exposed as data-disabled (no visual change).
// @param {string} [props.className] Passed to the chosen panel, which merges it onto its root <div> with cn().
// @param {object} [props.rest] Any other props (id, aria-*, ref, handlers) are passed to the chosen panel.

// Usage example:
// ```jsx
// import { useState } from 'react';
// import CommunityHubMegaMenuCollection from '@/TestComponent/SectionDesigns/MegaMenus/CommunityMegaMenu';

// // Normally rendered for you by <MegaMenu category="community" variant={4} />
// export default function ForumMenuPreview() {
//     const [open, setOpen] = useState(true)
//     if (!open) return null
//     return (
//         <div className="rounded-lg border border-[#a34c38] shadow-2xl">
//             <CommunityHubMegaMenuCollection variant={4} closeMenu={() => setOpen(false)} />
//         </div>
//     )
// }
// ```


'use client'

import GuildsSpacesMegaMenu from './community/MegaMenu01';
import CityChaptersMegaMenu from './community/MegaMenu02';
import TopicRadarLeaderboardMegaMenu from './community/MegaMenu03';
import PeerQAMegaMenu from './community/MegaMenu04';
import DiscordCollectiveMegaMenu from './community/MegaMenu05';

const menus = {
    1: GuildsSpacesMegaMenu,
    2: CityChaptersMegaMenu,
    3: TopicRadarLeaderboardMegaMenu,
    4: PeerQAMegaMenu,
    5: DiscordCollectiveMegaMenu,
}

export function CommunityHubMegaMenuCollection({
    variant = 1,
    size = 'md',
    disabled = false,
    loading = false,
    closeMenu,
    accent = '#a34c38',
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

export default CommunityHubMegaMenuCollection