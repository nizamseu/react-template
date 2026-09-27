// InvestorRelationsTickerNavbar

// Navbar02 · Corporate & Business › Navbars

// Description:
// Dark investor-relations header for "NORTHSTAR / IR" with a share-price badge
// ("NYSE: NST $148.60 ▲ +3.2%"). A right-aligned nav holds an "Investor Relations" mega
// menu plus Q3 Earnings, Board & ESG and SEC Filings links, followed by an outlined
// "2026 Annual Report" button.

// Design:
// - flex justify-between: brand + ticker on the left, nav + report button pushed right
//   with ml-auto (gap-8)
// - Very dark #0b111a background with a white/10 bottom border; sky-blue #84b9ff for
//   brand, trigger and button outline (#84b9ff/40, hover fills #84b9ff with #0b111a text);
//   ticker in emerald-400 on emerald-500/10; nav links white/70 -> hover white
// - Everything font-mono text-xs (ticker text-[10px]); brand tracking-[.18em]; small
//   rounded ticker badge and button; square header
// - Below sm the ticker hides; below md the nav (mega menu included) hides with no mobile
//   menu, leaving brand + report button; padding px-5 -> sm:px-8

// What it does:
// - No content props or local state; MegaMenu (category="corporate", variant={2}, accent #84b9ff)
//   toggles on trigger click, opens on keyboard focus, and closes on Escape, focus loss,
//   ~160 ms after the pointer leaves, or when a panel link is clicked
// - Its panel (portalled, fixed just below this header) shows a ticker banner, earnings
//   call notice, regulatory filings and corporate governance lists, and an Investor Day
//   webcast card; the header ticker itself is static text, not live data
// - Anchors: #home, #earnings, #governance, #filings and the CTA #annual-report (with
//   HiArrowRight)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import InvestorRelationsTickerNavbar from '@/TestComponent/SectionDesigns/Sections/corporate/Navbar02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <InvestorRelationsTickerNavbar />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function InvestorRelationsTickerNavbar({
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
                'rounded-none border-b border-white/10 bg-[#0b111a] px-5 py-3.5 text-white sm:px-8',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between gap-6">
                {/* Brand Far Left with Stock Ticker */}
                <div className="flex items-center gap-4 shrink-0">
                    <a href="#home" className="font-mono text-xs font-bold tracking-[.18em] text-[#84b9ff]">
                        NORTHSTAR / IR
                    </a>
                    <span className="hidden sm:inline-flex items-center gap-1.5 rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400 border border-emerald-500/20">
                        NYSE: NST $148.60 ▲ +3.2%
                    </span>
                </div>

                {/* Right-Flush Navigation & Annual Report Group */}
                <div className="flex items-center gap-8 ml-auto">
                    <nav className="hidden items-center gap-7 text-xs font-mono text-white/70 md:flex">
                        <MegaMenu
                            category="corporate"
                            accent="#84b9ff"
                            variant={2}
                            label="Investor Relations"
                            triggerClassName="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#84b9ff] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#earnings" className="hover:text-white transition-colors">
                            Q3 Earnings
                        </a>
                        <a href="#governance" className="hover:text-white transition-colors">
                            Board & ESG
                        </a>
                        <a href="#filings" className="hover:text-white transition-colors">
                            SEC Filings
                        </a>
                    </nav>

                    <a
                        href="#annual-report"
                        className="inline-flex items-center gap-1.5 rounded border border-[#84b9ff]/40 px-3.5 py-1.5 font-mono text-xs text-[#84b9ff] hover:bg-[#84b9ff] hover:text-[#0b111a] transition-colors shrink-0"
                    >
                        <span>2026 Annual Report</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}

export default InvestorRelationsTickerNavbar
