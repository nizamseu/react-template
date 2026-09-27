// PrivateCapitalGridNavbar

// Navbar05 · Corporate & Business › Navbars

// Description:
// Boxed three-cell header for "NORTHSTAR CAPITAL" (Fund VI): a brand cell, a navigation
// strip with a "Private Capital" mega menu plus Portfolio, Mandate and General Partners
// links, and a status cell showing "$18.4B AUM" with an "LP PORTAL" link.

// Design:
// - grid grid-cols-1 -> md:grid-cols-[240px_1fr_220px] with 2px dividers (divide-y-2 on
//   mobile, md:divide-x-2) in #84b9ff/20; each cell p-3.5 flex justify-between
// - Near-black #0a0f17 background with border-2 #84b9ff/30; sky-blue #84b9ff accents
//   (CAPITAL tag, trigger, tagline, LP link); nav links white/70 -> hover white
// - Wordmark font-serif text-lg tracking-widest; nav font-mono uppercase text-xs
//   tracking-wider; square corners throughout (rounded-none)
// - Below md the three cells stack vertically; the nav strip stays visible and scrolls
//   horizontally (overflow-x-auto); "GLOBAL PRIVATE EQUITY" tag shows from lg

// What it does:
// - No content props or local state; MegaMenu (category="corporate", variant={5}, accent #84b9ff)
//   toggles on trigger click, opens on keyboard focus, and closes on Escape, focus loss,
//   ~160 ms after the pointer leaves, or when a panel link is clicked
// - Its panel (portalled, fixed just below this header) presents two investment
//   strategies and an "Accredited Investor Room" LP portal card
// - Anchors: #home, #portfolio, #criteria (labelled "Mandate"), #team, #lp-login
// - Its mega menu panel is PrivateCapitalMegaMenu in MegaMenus/corporate/MegaMenu05.jsx.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PrivateCapitalGridNavbar from '@/TestComponent/SectionDesigns/Sections/corporate/Navbar05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <PrivateCapitalGridNavbar />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function PrivateCapitalGridNavbar({
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
                'rounded-none border-2 border-[#84b9ff]/30 bg-[#0a0f17] text-white',
                className,
            )}
            {...props}
        >
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr_220px] divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#84b9ff]/20">
                {/* Column 1: Monospace Index */}
                <div className="p-3.5 flex items-center justify-between">
                    <a href="#home" className="font-serif text-lg tracking-widest text-white">
                        NORTHSTAR <span className="font-mono text-xs text-[#84b9ff]">CAPITAL</span>
                    </a>
                    <span className="font-mono text-[10px] text-white/40">FUND VI</span>
                </div>

                {/* Column 2: Navigation strip */}
                <div className="p-3.5 flex items-center justify-between overflow-x-auto">
                    <nav className="flex items-center gap-7 text-xs font-mono uppercase tracking-wider">
                        <MegaMenu
                            category="corporate"
                            accent="#84b9ff"
                            variant={5}
                            label="Private Capital"
                            triggerClassName="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#84b9ff] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#portfolio" className="text-white/70 hover:text-white transition-colors">
                            Portfolio
                        </a>
                        <a href="#criteria" className="text-white/70 hover:text-white transition-colors">
                            Mandate
                        </a>
                        <a href="#team" className="text-white/70 hover:text-white transition-colors">
                            General Partners
                        </a>
                    </nav>
                    <span className="hidden lg:inline font-mono text-[10px] text-[#84b9ff]">
                        GLOBAL PRIVATE EQUITY
                    </span>
                </div>

                {/* Column 3: AUM Status */}
                <div className="p-3.5 flex items-center justify-between font-mono text-xs font-bold">
                    <span>$18.4B AUM</span>
                    <a
                        href="#lp-login"
                        className="flex items-center gap-1 text-[#84b9ff] hover:underline"
                    >
                        <span>LP PORTAL &rarr;</span>
                    </a>
                </div>
            </div>
        </header>
    )
}

export default PrivateCapitalGridNavbar
