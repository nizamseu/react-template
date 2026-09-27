// StrategicPartnersMastheadNavbar

// Navbar03 · Corporate & Business › Navbars

// Description:
// Three-tier dark masthead for "Northstar Strategic Partners": a micro-ticker ("GLOBAL
// ENTERPRISE COUNSEL · $18.4B ASSETS ADVISED WORLDWIDE", office cities, "EST. 1994"), a
// serif wordmark with a "Request Executive Briefing" link, and a bottom shelf nav with a
// "Quantified Impact" mega menu and practice links (Energy Transition, Private Equity
// Advisory, Sovereign Wealth, Verified ESG).

// Design:
// - Stacked rows: ticker bar, masthead row (flex justify-between) and a bottom nav shelf on
//   a darker #0a111a strip, separated by white/10 borders
// - Navy #0e1724 background, border-y #3476c5/20, shadow-xl; sky-blue #84b9ff for the
//   ticker, briefing link and trigger; practice links white/70 -> hover white
// - Wordmark font-serif text-2xl -> sm:text-3xl bold; ticker font-mono text-[10px]; nav
//   text-xs font-semibold; square header (rounded-none)
// - Below sm the city list and briefing link hide; the nav row never collapses but
//   scrolls horizontally (overflow-x-auto); "GLOBAL PRACTICE LEADERSHIP" shows from lg;
//   padding px-5 -> sm:px-8

// What it does:
// - No content props or local state; MegaMenu (category="corporate", variant={3}, accent #84b9ff)
//   toggles on trigger click, opens on keyboard focus, and closes on Escape, focus loss,
//   ~160 ms after the pointer leaves, or when a panel link is clicked
// - Its panel (portalled, fixed just below this header) lists three mapped client outcome
//   cards (e.g. $140M opex saved, 99.999% availability, -42% carbon intensity)
// - Anchors: #home, #briefing, #energy, #private-equity, #sovereign, #esg

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import StrategicPartnersMastheadNavbar from '@/TestComponent/SectionDesigns/Sections/corporate/Navbar03';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <StrategicPartnersMastheadNavbar />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function StrategicPartnersMastheadNavbar({
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
                'rounded-none border-y border-[#3476c5]/20 bg-[#0e1724] text-white shadow-xl',
                className,
            )}
            {...props}
        >
            {/* Top Micro-Ticker */}
            <div className="border-b border-white/10 px-5 py-1.5 font-mono text-[10px] text-[#84b9ff] flex items-center justify-between sm:px-8">
                <span>GLOBAL ENTERPRISE COUNSEL &bull; $18.4B ASSETS ADVISED WORLDWIDE</span>
                <span className="hidden sm:inline">NEW YORK &bull; LONDON &bull; ZURICH &bull; SINGAPORE</span>
                <span className="text-white/60">EST. 1994</span>
            </div>

            {/* Middle Main Masthead */}
            <div className="px-5 py-4 flex items-center justify-between sm:px-8">
                <a href="#home" className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                    Northstar Strategic Partners
                </a>
                <a
                    href="#briefing"
                    className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#84b9ff] hover:underline"
                >
                    <span>Request Executive Briefing &rarr;</span>
                </a>
            </div>

            {/* Bottom Shelf Navigation */}
            <div className="border-t border-white/10 bg-[#0a111a] px-5 py-2.5 sm:px-8">
                <nav className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-8 overflow-x-auto">
                        <MegaMenu
                            category="corporate"
                            accent="#84b9ff"
                            variant={3}
                            label="Quantified Impact"
                            triggerClassName="inline-flex items-center gap-1 text-xs font-semibold text-[#84b9ff] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#energy" className="text-white/70 hover:text-white transition-colors">
                            Energy Transition
                        </a>
                        <a href="#private-equity" className="text-white/70 hover:text-white transition-colors">
                            Private Equity Advisory
                        </a>
                        <a href="#sovereign" className="text-white/70 hover:text-white transition-colors">
                            Sovereign Wealth
                        </a>
                        <a href="#esg" className="text-white/70 hover:text-white transition-colors">
                            Verified ESG
                        </a>
                    </div>
                    <span className="font-mono text-[10px] text-white/40 hidden lg:inline">
                        GLOBAL PRACTICE LEADERSHIP
                    </span>
                </nav>
            </div>
        </header>
    )
}

export default StrategicPartnersMastheadNavbar
