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
// - variant selects the layout through if (variant === 1..4); any other value renders the Variant 5 design.
// - Every <a> calls closeMenu on click; there is no state or effect. The Variant 3 leaderboard rows are not interactive.
// - Colours are hard-coded; the accent prop is accepted but not used anywhere in the markup.

// @param {object} props
// @param {number} [props.variant=1] Design to render: 1–4, any other value falls back to Variant 5.
// @param {Function} props.closeMenu Called when any link in the panel is clicked (MegaMenu passes its own close handler).
// @param {string} [props.accent='#a34c38'] Accepted for API consistency with the other category menus; currently unused.
// @param {'md'} [props.size='md'] Only size; exposed as data-size (no visual change).
// @param {boolean} [props.disabled=false] Exposed as data-disabled (no visual change).
// @param {boolean} [props.loading=false] Exposed as data-disabled (no visual change).
// @param {string} [props.className] Merged onto the root <div> of every variant with cn().
// @param {object} [props.rest] Any other props (id, aria-*, ref, handlers) are spread onto the root <div> of every variant.

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

import {
    HiArrowRight,
    HiOutlineChat,
    HiOutlineFire,
    HiOutlineGlobe,
    HiOutlineLocationMarker,
    HiOutlineMicrophone,
    HiOutlineSparkles,
    HiOutlineUserGroup,
} from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

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
    // VARIANT 1: Spaces & Guilds Discovery (COMMONROOM)
    if (variant === 1) {
        return (
            <div
                data-variant={variant}
                data-size={size}
                data-disabled={disabled || loading}
                className={cn(
                    'bg-[#241c19] text-[#f7e6de] p-8 border-t-2 border-[#ffccad]',
                    className,
                )}
                {...props}
            >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                    <div>
                        <span className="font-mono text-[10px] uppercase tracking-[.25em] text-[#ffccad]">
                            COMMONROOM &bull; EXPLORE 120+ ACTIVE GUILDS
                        </span>
                        <h3 className="mt-1 font-bold text-2xl text-white">Find Your Community of Practice</h3>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-[#352520] px-4 py-1.5 text-xs text-[#ffccad]">
                        <span className="h-2 w-2 rounded-full bg-[#ffccad] animate-ping" />
                        <span>3,842 members active right now</span>
                    </div>
                </div>

                {/* 3 Guild Cards */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            name: 'Creative Code & Shaders',
                            members: '4,820 members',
                            online: '142 online',
                            topic: 'Latest: "Raymarching SDF optimization in WebGL"',
                            tags: ['Three.js', 'GLSL', 'Math'],
                        },
                        {
                            name: 'Independent Founders Salon',
                            members: '2,190 members',
                            online: '89 online',
                            topic: 'Latest: "Bootstrapping B2B tools to $1M ARR"',
                            tags: ['SaaS', 'Revenue', 'Playbooks'],
                        },
                        {
                            name: 'Type Designers Worldwide',
                            members: '3,410 members',
                            online: '67 online',
                            topic: 'Latest: "Variable font optical sizing in CSS"',
                            tags: ['Typography', 'Glyphs', 'Foundry'],
                        },
                    ].map((guild) => (
                        <div
                            key={guild.name}
                            className="flex flex-col justify-between rounded-lg border border-white/10 bg-white/5 p-5 hover:border-[#ffccad] transition-colors"
                        >
                            <div>
                                <div className="flex items-center justify-between text-[11px] font-mono text-[#ffccad]">
                                    <span>GUILD</span>
                                    <span>{guild.online}</span>
                                </div>
                                <h4 className="mt-2 text-base font-bold text-white">{guild.name}</h4>
                                <p className="mt-2 text-xs text-white/70 italic">{guild.topic}</p>
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                    {guild.tags.map((t) => (
                                        <span key={t} className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-white/80">
                                            #{t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                                <span className="text-white/50">{guild.members}</span>
                                <a
                                    href="#join-guild"
                                    onClick={closeMenu}
                                    className="rounded bg-[#ffccad] px-3 py-1 font-bold text-[#241c19] hover:bg-white transition-colors"
                                >
                                    Join Guild
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-white/60">
                    <span>Have an idea for a new specialty guild? Start one with 5 founding members.</span>
                    <a href="#new-guild" onClick={closeMenu} className="font-bold text-[#ffccad] underline">
                        Create a Guild &rarr;
                    </a>
                </div>
            </div>
        )
    }

    // VARIANT 2: IRL Meetups & Global City Chapters
    if (variant === 2) {
        return (
            <div
                data-variant={variant}
                data-size={size}
                data-disabled={disabled || loading}
                className={cn(
                    'bg-[#fcf8f5] text-[#2c1d18] p-8 border-t border-[#ebded7]',
                    className,
                )}
                {...props}
            >
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#ebded7] pb-4 gap-4">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-[.25em] text-[#a34c38]">
                            IN-REAL-LIFE CHAPTERS &bull; SALONS & WORKSHOPS
                        </span>
                        <h3 className="mt-1 font-serif text-2xl">Connect Beyond the Screen</h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#a34c38]">
                        <HiOutlineLocationMarker /> 24 Global City Chapters
                    </div>
                </div>

                {/* 4 City Meetup Cards */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        {
                            city: 'Berlin',
                            venue: 'Betahaus Kreuzberg',
                            date: 'THU OCT 15',
                            title: 'Creative Code & Craft Beer Salon',
                            spots: '6 spots left',
                        },
                        {
                            city: 'Tokyo',
                            venue: 'FabCafe Shibuya',
                            date: 'SAT OCT 17',
                            title: 'Generative Typography Night',
                            spots: 'Waitlist only',
                        },
                        {
                            city: 'London',
                            venue: 'Shoreditch Studios',
                            date: 'WED OCT 21',
                            title: 'Design Systems Roundtable',
                            spots: '12 spots left',
                        },
                        {
                            city: 'New York',
                            venue: 'A/D/O Greenpoint',
                            date: 'FRI OCT 23',
                            title: 'Independent Founders Mixer',
                            spots: '8 spots left',
                        },
                    ].map((meetup) => (
                        <div
                            key={meetup.city}
                            className="rounded-lg border border-[#ebded7] bg-white p-4 flex flex-col justify-between hover:border-[#a34c38] transition-colors"
                        >
                            <div>
                                <div className="flex items-center justify-between text-[11px] font-mono text-[#a34c38]">
                                    <span className="font-bold">{meetup.city}</span>
                                    <span>{meetup.date}</span>
                                </div>
                                <h5 className="mt-2 font-bold text-sm leading-snug">{meetup.title}</h5>
                                <p className="mt-1 text-xs text-black/50">{meetup.venue}</p>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
                                <span className="text-[11px] text-black/60">{meetup.spots}</span>
                                <a
                                    href="#rsvp"
                                    onClick={closeMenu}
                                    className="font-bold text-[#a34c38] underline"
                                >
                                    RSVP
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // VARIANT 3: Topic Radar & Community Leaderboard
    if (variant === 3) {
        return (
            <div
                data-variant={variant}
                data-size={size}
                data-disabled={disabled || loading}
                className={cn(
                    'bg-[#1e1715] text-[#ede3de] p-8 border-t border-white/10',
                    className,
                )}
                {...props}
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Trending Discussions */}
                    <div className="lg:col-span-8 space-y-4">
                        <div className="flex items-center gap-2 text-[11px] font-mono text-[#ffccad] uppercase tracking-wider">
                            <HiOutlineFire className="text-base" /> Trending Discussions This Week
                        </div>
                        <div className="space-y-3">
                            {[
                                {
                                    votes: '▲ 342',
                                    comments: '88 replies',
                                    title: 'Showcase: I spent 6 months building an open-source physics engine for Figma',
                                    author: 'by @dev_marcus &bull; 4h ago',
                                },
                                {
                                    votes: '▲ 289',
                                    comments: '64 replies',
                                    title: 'Salary Transparency Thread 2026: Design Engineers & Technologists',
                                    author: 'by @elena_ui &bull; 1d ago',
                                },
                                {
                                    votes: '▲ 195',
                                    comments: '42 replies',
                                    title: 'Why we killed our native mobile apps and rebuilt on progressive web standards',
                                    author: 'by @cto_kevin &bull; 2d ago',
                                },
                            ].map((thread) => (
                                <a
                                    key={thread.title}
                                    href="#thread"
                                    onClick={closeMenu}
                                    className="flex items-start gap-4 rounded-lg border border-white/10 bg-white/5 p-4 hover:border-[#ffccad] transition-colors"
                                >
                                    <div className="rounded bg-white/10 px-2 py-1 font-mono text-xs font-bold text-[#ffccad] shrink-0 text-center">
                                        {thread.votes}
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-sm text-white hover:underline">{thread.title}</h5>
                                        <div className="mt-1 flex items-center gap-3 text-[11px] text-white/50">
                                            <span>{thread.author}</span>
                                            <span>&bull;</span>
                                            <span>{thread.comments}</span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Right: Leaderboard */}
                    <div className="lg:col-span-4 rounded-lg border border-white/10 bg-white/[0.03] p-5 space-y-4">
                        <span className="text-[10px] font-mono text-[#ffccad] uppercase tracking-wider block">
                            TOP CONTRIBUTORS &bull; KARMA LEADERBOARD
                        </span>
                        <div className="space-y-3 text-xs">
                            {[
                                { rank: '01', name: 'Sophia Chen', karma: '14,820 pts', badge: 'Shader Master' },
                                { rank: '02', name: 'Alexandru Pop', karma: '12,410 pts', badge: 'Systems Guru' },
                                { rank: '03', name: 'Tatsuya Mori', karma: '10,950 pts', badge: 'Founding Mentor' },
                            ].map((user) => (
                                <div key={user.rank} className="flex items-center justify-between border-b border-white/10 pb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-white/40">{user.rank}</span>
                                        <div>
                                            <span className="font-bold text-white block">{user.name}</span>
                                            <span className="text-[10px] text-[#ffccad]">{user.badge}</span>
                                        </div>
                                    </div>
                                    <span className="font-mono text-white/60">{user.karma}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // VARIANT 4: Peer Q&A & Collaborative Problem Solving
    if (variant === 4) {
        return (
            <div
                data-variant={variant}
                data-size={size}
                data-disabled={disabled || loading}
                className={cn(
                    'bg-[#291f1b] text-white p-8 border-t border-[#a34c38]',
                    className,
                )}
                {...props}
            >
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/15 pb-4 gap-4">
                    <div>
                        <span className="font-mono text-[10px] uppercase tracking-[.25em] text-[#ffccad]">
                            COMMUNITY PROBLEM SOLVER &bull; CODE & DESIGN REVIEWS
                        </span>
                        <h3 className="mt-1 text-2xl font-bold">Get Unstuck with Peer Feedback</h3>
                    </div>
                    <a
                        href="#ask"
                        onClick={closeMenu}
                        className="rounded-full bg-[#ffccad] px-4 py-2 text-xs font-bold text-[#291f1b] hover:bg-white transition-colors"
                    >
                        Post a Question / Request Review
                    </a>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            type: 'CODE REVIEW',
                            title: 'GLSL Raymarching Shader Artifacts on Mobile GPUs',
                            replies: '6 Solutions',
                            solved: true,
                        },
                        {
                            type: 'DESIGN TEARDOWN',
                            title: 'Evaluating Accessibility Contrast on Glassmorphic HUD',
                            replies: '14 Critiques',
                            solved: true,
                        },
                        {
                            type: 'PITCH DECK REVIEW',
                            title: 'Seed Round Deck for Open-Source Dev Tool ($2M Ask)',
                            replies: '8 Founder Notes',
                            solved: false,
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className="rounded-lg border border-white/10 bg-white/5 p-4 flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between text-[10px] font-mono text-[#ffccad]">
                                    <span>{item.type}</span>
                                    <span className={item.solved ? 'text-emerald-400' : 'text-amber-400'}>
                                        {item.solved ? '✓ SOLVED' : '● ACTIVE'}
                                    </span>
                                </div>
                                <h5 className="mt-2 font-bold text-sm leading-snug">{item.title}</h5>
                            </div>
                            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                                <span>{item.replies}</span>
                                <a href="#view-qa" onClick={closeMenu} className="font-semibold text-[#ffccad] hover:underline">
                                    View Thread &rarr;
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // VARIANT 5: Open-Source Collective & Discord Bridge
    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'bg-[#1b1513] text-[#e8ded9] p-8 border-t border-white/15',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
                <div>
                    <span className="font-mono text-[10px] text-[#ffccad] uppercase tracking-[.25em]">
                        DISCORD INTEGRATION &bull; LIVE AUDIO SESSIONS
                    </span>
                    <h3 className="mt-1 text-2xl font-bold text-white">Join 18,400+ Discord Members</h3>
                </div>
                <div className="flex items-center gap-2 rounded bg-indigo-900/60 px-3 py-1.5 text-xs text-indigo-200">
                    <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
                    <span>2,140 Discord Members Online</span>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Live Room */}
                <div className="rounded-lg border border-white/10 bg-white/5 p-5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 font-mono text-[10px] text-red-400">
                            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                            <span>LIVE VOICE LOUNGE</span>
                        </div>
                        <h4 className="mt-2 font-bold text-sm text-white">Ambient Coding & Lo-Fi Synthesis</h4>
                        <p className="mt-1 text-xs text-white/60">24 engineers coding together in silence with low-tempo ambient sound.</p>
                    </div>
                    <a
                        href="#discord-voice"
                        onClick={closeMenu}
                        className="mt-4 flex items-center justify-center gap-2 rounded bg-indigo-600 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition-colors"
                    >
                        Hop into Voice Room
                    </a>
                </div>

                {/* Open Collective Ledger */}
                <div className="rounded-lg border border-white/10 bg-white/5 p-5 flex flex-col justify-between">
                    <div>
                        <span className="font-mono text-[10px] text-[#ffccad] block">OPEN COLLECTIVE LEDGER</span>
                        <div className="mt-2 font-mono text-2xl font-bold text-white">$42,850 / yr</div>
                        <p className="mt-1 text-xs text-white/60">Community funds distributed to open-source creators and event hosts.</p>
                    </div>
                    <a
                        href="#ledger"
                        onClick={closeMenu}
                        className="mt-4 text-xs font-semibold text-[#ffccad] underline hover:text-white"
                    >
                        View Transparent Budget &rarr;
                    </a>
                </div>

                {/* Manifesto & Code of Conduct */}
                <div className="rounded-lg border border-white/10 bg-white/5 p-5 flex flex-col justify-between">
                    <div>
                        <span className="font-mono text-[10px] text-white/50 block">ETHOS & VALUES</span>
                        <h4 className="mt-2 font-bold text-sm text-white">Generosity, Craft & Zero Spam</h4>
                        <p className="mt-1 text-xs text-white/60">Read our community charter and rules for pitching client work.</p>
                    </div>
                    <a
                        href="#charter"
                        onClick={closeMenu}
                        className="mt-4 text-xs font-semibold text-[#ffccad] underline hover:text-white"
                    >
                        Read Community Charter &rarr;
                    </a>
                </div>
            </div>
        </div>
    )
}

export default CommunityHubMegaMenuCollection
