// TopicRadarLeaderboardMegaMenu

// MegaMenu03 · Social Networks & Communities › Mega menus

// Description:
// A dark "what's hot" panel for a forum or discussion community. The left side lists
// "Trending Discussions This Week": three thread rows with a vote badge (▲ 342, ▲ 289,
// ▲ 195), title, author, age and reply count. The right side is a "TOP CONTRIBUTORS •
// KARMA LEADERBOARD" card ranking Sophia Chen, Alexandru Pop and Tatsuya Mori with their
// badge and karma points.

// Design:
// - grid-cols-1 lg:grid-cols-12 gap-8: threads take lg:col-span-8 and the leaderboard
//   lg:col-span-4; below lg the leaderboard stacks under the threads
// - Dark #1e1715 surface, #ede3de text, white/10 top border; peach #ffccad for the fire
//   icon label, vote badges and contributor badges; white/5 thread rows and a
//   white/[0.03] leaderboard card, both with white/10 borders (rows turn peach on hover)
// - Mono uppercase text-[11px] / text-[10px] labels, bold text-sm white thread titles
//   (underline on hover), mono vote badges on white/10 chips; rounded-lg rows and card
// - Leaderboard rows are flex justify-between (rank, name/badge, mono karma) separated by
//   white/10 bottom borders

// What it does:
// - Each thread row is a whole-row anchor to #thread that calls closeMenu on click
// - The leaderboard rows are plain divs (not interactive); there is no state or effect
// - The author strings hold "&bull;" inside JS strings, so it renders as the literal text
//   "&bull;" rather than a bullet
// - Used by CreatorCommonsThreeTierMastheadNavbar: <MegaMenu category="community" variant={3} />
//   opens it in a dropdown panel framed with 'rounded-xl border border-white/15 shadow-2xl bg-[#1e1715]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import TopicRadarLeaderboardMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/community/MegaMenu03';

// // Inside CreatorCommonsThreeTierMastheadNavbar it opens from <MegaMenu category="community" variant={3} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-xl border border-white/15 shadow-2xl bg-[#1e1715]">
//         <TopicRadarLeaderboardMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { HiOutlineFire } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function TopicRadarLeaderboardMegaMenu({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    closeMenu,
    className,
    ...props
}) {
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

export default TopicRadarLeaderboardMegaMenu
