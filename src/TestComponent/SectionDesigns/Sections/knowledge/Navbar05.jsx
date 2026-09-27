// RuntimeSupportEscalationGridNavbar

// Navbar05 · Knowledge Bases & Documentation › Navbars

// Description:
// A boxed, three-cell operations header for "NORTHSTAR / RUNTIME" support docs.
// It pairs the wordmark and a "KERNEL" tag with a "Support Escalation" mega menu
// and links to Error Codes (5xx), Trace Diagnostics and PagerDuty Sync, plus a
// static "OPERATIONAL" status light and a "P1 PAGER →" escalation link.

// Design:
// - Bordered grid: one column on mobile, md:grid-cols-[240px_1fr_220px] from md,
//   with divide-y-2 / md:divide-x-2 separators (brand · nav strip · status).
// - Dark palette: background #172721, text #e0eee6, 2px border #41715d, dividers
//   #41715d/40, mint accent #9bd2a7, links white/70, emerald-400 status text and dot.
// - Everything monospace and uppercase with wide tracking; text-xs links,
//   text-[10px] tags; square corners; pulsing round status dot (animate-pulse).
// - Below md the three cells stack vertically; the nav strip stays visible and
//   scrolls horizontally (overflow-x-auto); "99.999% SLA MONITOR" shows only from lg.

// What it does:
// - No content props or own state. "Support Escalation" is the shared MegaMenu (category
//   "knowledge", variant 5, accent #41715d): toggles on click or opens on focus,
//   closes on pointer leave (160ms delay), Escape or blur, and portals a panel
//   with the SLA guarantee, office hours and an urgent incident ticket card.
// - The "OPERATIONAL" status is hard-coded, not fetched. Anchors: brand → #docs,
//   #error-codes, #diagnostics, #pagerduty, and "P1 PAGER →" → #escalate.
// - Its mega menu panel is SupportSLAMegaMenu in MegaMenus/knowledge/MegaMenu05.jsx.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <header> with cn()
// - ...props: spread onto the root <header> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import RuntimeSupportEscalationGridNavbar from '@/TestComponent/SectionDesigns/Sections/knowledge/Navbar05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <RuntimeSupportEscalationGridNavbar />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu';
import { cn } from '@/design-system/lib/cn';

export function RuntimeSupportEscalationGridNavbar({
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
                'rounded-none border-2 border-[#41715d] bg-[#172721] text-[#e0eee6]',
                className,
            )}
            {...props}
        >
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr_220px] divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#41715d]/40">
                {/* Column 1: Monospace Index */}
                <div className="p-3.5 flex items-center justify-between">
                    <a href="#docs" className="font-mono text-xs font-bold uppercase tracking-[.18em] text-white">
                        NORTHSTAR <span className="text-[#9bd2a7]">/ RUNTIME</span>
                    </a>
                    <span className="font-mono text-[10px] text-[#9bd2a7]">KERNEL</span>
                </div>

                {/* Column 2: Navigation strip */}
                <div className="p-3.5 flex items-center justify-between overflow-x-auto">
                    <nav className="flex items-center gap-7 text-xs font-mono uppercase tracking-wider">
                        <MegaMenu
                            category="knowledge"
                            accent="#41715d"
                            variant={5}
                            label="Support Escalation"
                            triggerClassName="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#9bd2a7] hover:text-white transition-colors cursor-pointer"
                        />
                        <a href="#error-codes" className="text-white/70 hover:text-white transition-colors">
                            Error Codes (5xx)
                        </a>
                        <a href="#diagnostics" className="text-white/70 hover:text-white transition-colors">
                            Trace Diagnostics
                        </a>
                        <a href="#pagerduty" className="text-white/70 hover:text-white transition-colors">
                            PagerDuty Sync
                        </a>
                    </nav>
                    <span className="hidden lg:inline font-mono text-[10px] text-[#9bd2a7]">
                        99.999% SLA MONITOR
                    </span>
                </div>

                {/* Column 3: Live Incident Status */}
                <div className="p-3.5 flex items-center justify-between font-mono text-xs font-bold">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>OPERATIONAL</span>
                    </div>
                    <a
                        href="#escalate"
                        className="flex items-center gap-1 text-[#9bd2a7] hover:underline"
                    >
                        <span>P1 PAGER &rarr;</span>
                    </a>
                </div>
            </div>
        </header>
    )
}

export default RuntimeSupportEscalationGridNavbar
