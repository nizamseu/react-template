// DiscordGuildHubGridNavbar

// Navbar05 · Social Networks & Communities › Navbars

// Description:
// A dark, grid-ruled header for "COMMON / GUILDS", an invite-only, Discord-based builder
// community. Three bordered cells show the brand with a "HUB 05" index, a mono navigation strip
// (a "Discord Hub" mega menu plus Voice Stages, Study Halls and Project Drops) and a "24.8K
// BUILDERS" count with a "DISCORD →" link.

// Design:
// - Three-column grid md:grid-cols-[240px_1fr_200px] divided by 2px white/20 rules inside a 2px
//   white/20 frame
// - Palette: near-black brown #1b1513 with white text, peach #ffccad for the hub index, the
//   mega-menu trigger, the "INVITE ONLY" tag and the Discord link, white/50-70 secondary text;
//   dark theme
// - Typography & shapes: serif bold wordmark with a sans xs suffix, mono uppercase tracked nav and
//   labels; square edges throughout (rounded-none)
// - Responsive: below md the three cells stack as rows separated by horizontal rules (divide-y-2);
//   the nav stays visible and scrolls horizontally; "INVITE ONLY" shows only from lg

// What it does:
// - Renders the shared MegaMenu (category "community", variant 5, label "Discord Hub", accent
//   #ffccad): the trigger toggles on click and opens on keyboard focus; the panel is portaled to
//   document.body below this header and closes on Escape, on blur or shortly after the pointer leaves
// - No own props or state; anchors: logo → #home, #voice, #study, #collabs, "DISCORD →" → #join-discord

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import DiscordGuildHubGridNavbar from '@/TestComponent/SectionDesigns/Sections/community/Navbar05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <DiscordGuildHubGridNavbar />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function DiscordGuildHubGridNavbar({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    return (
        <header
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'rounded-none border-2 border-white/20 bg-[#1b1513] text-white',
                className,
            )}
            {...props}
        >
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr_200px] divide-y-2 md:divide-y-0 md:divide-x-2 divide-white/20">
                {/* Column 1: Monospace Index */}
                <div className="p-3.5 flex items-center justify-between">
                    <a href="#home" className="font-serif text-lg font-bold tracking-tight">
                        COMMON <span className="font-sans text-xs font-normal text-white/50">/ GUILDS</span>
                    </a>
                    <span className="font-mono text-[10px] text-[#ffccad]">HUB 05</span>
                </div>

                {/* Column 2: Navigation strip */}
                <div className="p-3.5 flex items-center justify-between overflow-x-auto">
                    <nav className="flex items-center gap-7 text-xs font-mono uppercase tracking-wider">
                        <MegaMenu
                            category="community"
                            accent="#ffccad"
                            variant={5}
                            label="Discord Hub"
                            triggerClassName="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#ffccad] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#voice" className="text-white/70 hover:text-white transition-colors">
                            Voice Stages
                        </a>
                        <a href="#study" className="text-white/70 hover:text-white transition-colors">
                            Study Halls
                        </a>
                        <a href="#collabs" className="text-white/70 hover:text-white transition-colors">
                            Project Drops
                        </a>
                    </nav>
                    <span className="hidden lg:inline font-mono text-[10px] text-[#ffccad]">
                        INVITE ONLY
                    </span>
                </div>

                {/* Column 3: Live Community Status */}
                <div className="p-3.5 flex items-center justify-between font-mono text-xs font-bold">
                    <span>24.8K BUILDERS</span>
                    <a
                        href="#join-discord"
                        className="flex items-center gap-1 text-[#ffccad] hover:underline"
                    >
                        <span>DISCORD &rarr;</span>
                    </a>
                </div>
            </div>
        </header>
    )
}

export default DiscordGuildHubGridNavbar
