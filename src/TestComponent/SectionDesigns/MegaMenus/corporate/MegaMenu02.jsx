// InvestorRelationsHubMegaMenu

// MegaMenu02 · Corporate & Business › Mega menus

// Description:
// The investor-relations panel for a listed company's corporate site. A stock-ticker
// banner (NYSE: NST, $148.60 ▲ +3.2%, Market Cap: $18.4B, "Q3 2026 Earnings Call: Oct
// 28") sits above "REGULATORY FILINGS" (10-K, 10-Q, proxy, shareholder letters) and
// "CORPORATE GOVERNANCE" link lists, and an "INVESTOR DAY 2026" card with a "Register for
// Webcast" button.

// Design:
// - Flex-wrap ticker banner, then grid-cols-1 md:grid-cols-3 gap-6 (filings list,
//   governance list, Investor Day card); everything stacks to one column below md
// - Dark #0b111a surface, #cdd8e6 text, white/15 top border; sky-blue #84b9ff labels and
//   button (#0b111a text, hover:bg-white); emerald-400 price; the Investor Day card is a
//   from-[#121c2c] to-[#0a111a] gradient with a #84b9ff/30 border
// - Mono text-xs ticker on a white/5 rounded-lg strip; mono text-[10px] uppercase
//   tracking-widest labels; serif text-lg card title; list links divided by white/10
//   rules, filings tagged with a mono "PDF" marker
// - No panel heading of its own; list links brighten to white on hover

// What it does:
// - Filing links go to #filing, governance links to #gov and "Register for Webcast" to
//   #webcast; all call closeMenu on click
// - Ticker figures are static text (no live data); no state or effect
// - Used by InvestorRelationsTickerNavbar: <MegaMenu category="corporate" variant={2} />
//   opens it in a dropdown panel framed with 'rounded-lg border border-white/20 shadow-2xl bg-[#0b111a]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import InvestorRelationsHubMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/corporate/MegaMenu02';

// // Inside InvestorRelationsTickerNavbar it opens from <MegaMenu category="corporate" variant={2} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-lg border border-white/20 shadow-2xl bg-[#0b111a]">
//         <InvestorRelationsHubMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function InvestorRelationsHubMegaMenu({
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
                'bg-[#0b111a] text-[#cdd8e6] p-8 border-t border-white/15',
                className,
            )}
            {...props}
        >
            {/* Stock Ticker Banner */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-white/5 p-4 border border-white/10 font-mono text-xs">
                <div className="flex items-center gap-4">
                    <span className="font-bold text-white">NYSE: NST</span>
                    <span className="text-emerald-400 font-bold">$148.60 ▲ +3.2%</span>
                    <span className="text-white/40">Market Cap: $18.4B</span>
                </div>
                <div className="text-white/60">
                    Q3 2026 Earnings Call: Oct 28 &bull; 9:00 AM EST (Live Webcast)
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                    <span className="font-mono text-[10px] text-[#84b9ff] uppercase tracking-widest block">
                        REGULATORY FILINGS
                    </span>
                    <div className="space-y-2 text-xs">
                        {['Form 10-K Annual Report 2025', 'Form 10-Q Second Quarter 2026', 'Proxy Statement & Schedule 14A', 'Shareholder Letters by CEO'].map((doc) => (
                            <a
                                key={doc}
                                href="#filing"
                                onClick={closeMenu}
                                className="flex items-center justify-between border-b border-white/10 py-1.5 hover:text-white"
                            >
                                <span>&bull; {doc}</span>
                                <span className="font-mono text-[10px] text-white/40">PDF</span>
                            </a>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <span className="font-mono text-[10px] text-[#84b9ff] uppercase tracking-widest block">
                        CORPORATE GOVERNANCE
                    </span>
                    <div className="space-y-2 text-xs">
                        {['Board of Directors & Committees', 'Code of Business Conduct & Ethics', 'Whistleblower & Audit Policies', 'Executive Compensation Disclosures'].map((doc) => (
                            <a
                                key={doc}
                                href="#gov"
                                onClick={closeMenu}
                                className="block border-b border-white/10 py-1.5 hover:text-white"
                            >
                                &bull; {doc}
                            </a>
                        ))}
                    </div>
                </div>

                <div className="rounded-lg bg-gradient-to-br from-[#121c2c] to-[#0a111a] p-5 border border-[#84b9ff]/30 flex flex-col justify-between">
                    <div>
                        <span className="font-mono text-[10px] text-[#84b9ff] block">INVESTOR DAY 2026</span>
                        <h4 className="mt-2 font-serif text-lg text-white">Long-Term Capital Allocation & Dividends</h4>
                        <p className="mt-2 text-xs text-white/60">
                            Reaffirming 2026 guidance: 18-22% free cash flow margin expansion.
                        </p>
                    </div>
                    <a
                        href="#webcast"
                        onClick={closeMenu}
                        className="mt-4 inline-flex items-center justify-center rounded bg-[#84b9ff] py-2 text-xs font-bold text-[#0b111a] hover:bg-white transition-colors"
                    >
                        Register for Webcast
                    </a>
                </div>
            </div>
        </div>
    )
}

export default InvestorRelationsHubMegaMenu
