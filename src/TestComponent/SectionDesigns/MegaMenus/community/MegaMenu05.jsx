// DiscordCollectiveMegaMenu

// MegaMenu05 · Social Networks & Communities › Mega menus

// Description:
// A dark Discord-linked hub panel for an online community ("DISCORD INTEGRATION • LIVE
// AUDIO SESSIONS"). Under "Join 18,400+ Discord Members" and a "2,140 Discord Members
// Online" pill it shows three cards: a live voice lounge ("Ambient Coding & Lo-Fi
// Synthesis") with "Hop into Voice Room", an Open Collective ledger ($42,850 / yr) and
// the "Generosity, Craft & Zero Spam" community charter.

// Design:
// - Header stacks on mobile and becomes a row from md:; three hand-written cards in
//   grid-cols-1 md:grid-cols-3 gap-6, each flex-col with its link pinned to the bottom
// - Dark #1b1513 surface, #e8ded9 text, white/15 top border; peach #ffccad eyebrow and
//   text links; Discord indigo accents (indigo-900/60 pill, indigo-400 ping dot,
//   indigo-600 button, hover indigo-500); red-500 pulsing LIVE dot with a red-400 label
// - Mono text-[10px] labels, bold text-2xl heading, mono bold text-2xl ledger figure;
//   rounded pill, rounded-lg white/5 cards with white/10 borders and no hover effect
// - Text links are underlined and turn white on hover

// What it does:
// - "Hop into Voice Room" (#discord-voice), "View Transparent Budget →" (#ledger) and
//   "Read Community Charter →" (#charter) call closeMenu on click
// - The online pill and LIVE dot are animation only; no state or effect
// - Used by DiscordGuildHubGridNavbar: <MegaMenu category="community" variant={5} />
//   opens it in a dropdown panel framed with 'rounded-none border border-white/15 shadow-2xl bg-[#1b1513]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import DiscordCollectiveMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/community/MegaMenu05';

// // Inside DiscordGuildHubGridNavbar it opens from <MegaMenu category="community" variant={5} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-none border border-white/15 shadow-2xl bg-[#1b1513]">
//         <DiscordCollectiveMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function DiscordCollectiveMegaMenu({
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

export default DiscordCollectiveMegaMenu
