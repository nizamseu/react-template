// CircularPreLovedMarketMegaMenu

// MegaMenu04 · E-commerce & Marketplaces › Mega menus

// Description:
// A dark circular-fashion dropdown for a pre-loved or resale designer marketplace. A banner
// reads "Live Impact: 14,820 designer garments rescued this month" beside "Carbon Offset:
// -42.8 tonnes CO₂e". Below sit an "AUCTION / DROP 28" card for a "1998 Helmut Lang
// Distressed Biker Jacket" ($620 current bid, "Place Bid"), four "EXPLORE BY VERIFIED
// CONDITION" grade links and a "Sell Your Designer Pieces" trade-in card with a CTA.

// Design:
// - p-8 panel: a flex-wrap banner row, then a grid that is one column on mobile and three
//   at lg: (auction card, condition links, trade-in card); there is no md: step
// - Olive-black #202315 surface with #f4f7ea text and a lime #d6f36a border-t-2; cards use
//   #2a301c, the trade-in card a gradient to #1c1f13 with a #d6f36a/30 border
// - Lime marks the round ♻ badge, DROP tag, countdown, bid price, icons and both solid
//   CTAs (hover:bg-white); font-mono 10–11px labels, rounded-lg cards, white/10 borders
// - Condition links are rounded-md white/5 tiles whose border and title turn lime on hover;
//   the auction photo is an h-40 object-cover Unsplash image

// What it does:
// - "Place Bid" (#bid), every condition tile (all share #condition) and "Estimate My
//   Trade-in Value" (#sell-trade) call closeMenu on click
// - Impact figures, the "ENDS IN 03:22:15" countdown and the bid are static text (no timer
//   or bidding logic); no state or effect
// - Used by CircularHubFloatingPillNavbar: <MegaMenu category="ecommerce" variant={4} />
//   opens it in a dropdown panel framed with 'rounded-none border-t-4 border-[#d6f36a] border-b-2 border-black/40 shadow-2xl bg-[#202315]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CircularPreLovedMarketMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/ecommerce/MegaMenu04';

// // Inside CircularHubFloatingPillNavbar it opens from <MegaMenu category="ecommerce" variant={4} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-none border-t-4 border-[#d6f36a] border-b-2 border-black/40 shadow-2xl bg-[#202315]">
//         <CircularPreLovedMarketMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { HiArrowRight, HiOutlineTag, HiOutlineRefresh } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CircularPreLovedMarketMegaMenu({
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
                'bg-[#202315] text-[#f4f7ea] p-8 border-t-2 border-[#d6f36a]',
                className,
            )}
            {...props}
        >
            {/* Top Live Impact Banner */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-[#2a301c] px-5 py-3 border border-[#d6f36a]/20">
                <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d6f36a] text-[#202315] font-bold text-xs">
                        ♻
                    </span>
                    <span className="text-xs font-semibold">
                        Live Impact: 14,820 designer garments rescued this month
                    </span>
                </div>
                <span className="font-mono text-xs text-[#d6f36a]">
                    Carbon Offset: -42.8 tonnes CO₂e
                </span>
            </div>

            {/* 3 Columns: Drop of Day, Fast Filters, Trade-in Box */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Col 1: Flash Pre-loved Drop */}
                <div className="rounded-lg bg-[#2a301c] p-5 border border-white/10 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="rounded bg-[#d6f36a] px-2 py-0.5 font-bold text-[#202315]">
                                AUCTION / DROP 28
                            </span>
                            <span className="text-[#d6f36a]">ENDS IN 03:22:15</span>
                        </div>
                        <img
                            src="https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80"
                            alt="Vintage Leather Jacket"
                            className="mt-4 h-40 w-full rounded object-cover"
                        />
                        <h4 className="mt-3 font-bold text-sm">1998 Helmut Lang Distressed Biker Jacket</h4>
                        <p className="mt-1 text-xs text-white/60">Condition: Pristine Archive &bull; Size: 48 (EU)</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                        <div>
                            <span className="text-[10px] text-white/50 block font-mono">CURRENT BID</span>
                            <span className="font-mono text-lg font-bold text-[#d6f36a]">$620</span>
                        </div>
                        <a
                            href="#bid"
                            onClick={closeMenu}
                            className="rounded-full bg-[#d6f36a] px-4 py-1.5 text-xs font-bold text-[#202315] hover:bg-white transition-colors"
                        >
                            Place Bid
                        </a>
                    </div>
                </div>

                {/* Col 2: Categories by Condition */}
                <div className="space-y-4">
                    <p className="font-mono text-[11px] text-[#d6f36a] uppercase tracking-wider">
                        EXPLORE BY VERIFIED CONDITION
                    </p>
                    <div className="grid grid-cols-1 gap-2.5 text-xs">
                        {[
                            { title: 'Pristine / With Tags', desc: 'Unworn designer samples & deadstock', count: '142 items' },
                            { title: 'Gently Loved (Grade A)', desc: 'Near zero signs of wear, dry-cleaned', count: '390 items' },
                            { title: 'Vintage Character (Grade B)', desc: 'Beautiful natural patina, authentic wear', count: '210 items' },
                            { title: 'Restored & Upcycled', desc: 'Mended by artisan tailors with sashiko', count: '64 items' },
                        ].map((cond) => (
                            <a
                                key={cond.title}
                                href="#condition"
                                onClick={closeMenu}
                                className="group flex flex-col rounded-md border border-white/10 bg-white/5 p-3 hover:border-[#d6f36a] transition-all"
                            >
                                <div className="flex items-center justify-between font-semibold">
                                    <span className="group-hover:text-[#d6f36a] transition-colors">{cond.title}</span>
                                    <span className="font-mono text-[10px] text-white/40">{cond.count}</span>
                                </div>
                                <span className="text-[11px] text-white/60 mt-0.5">{cond.desc}</span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Col 3: Instant Trade-In Estimator */}
                <div className="rounded-lg bg-gradient-to-br from-[#2a301c] to-[#1c1f13] p-6 border border-[#d6f36a]/30 flex flex-col justify-between">
                    <div>
                        <span className="inline-block rounded bg-[#d6f36a]/20 px-2 py-0.5 font-mono text-[10px] text-[#d6f36a]">
                            CIRCULAR TRADE-IN
                        </span>
                        <h4 className="mt-2 text-xl font-bold">Sell Your Designer Pieces</h4>
                        <p className="mt-2 text-xs text-white/70 leading-relaxed">
                            Send us photos of your authentic items. Receive an immediate payout or get <strong>+20% bonus</strong> in circular store credit.
                        </p>
                        <div className="mt-4 space-y-2 text-xs">
                            <div className="flex items-center gap-2 text-white/80">
                                <HiOutlineTag className="text-[#d6f36a]" /> Free prepaid shipping kit sent to your door
                            </div>
                            <div className="flex items-center gap-2 text-white/80">
                                <HiOutlineRefresh className="text-[#d6f36a]" /> Instant bank deposit upon authentication
                            </div>
                        </div>
                    </div>
                    <a
                        href="#sell-trade"
                        onClick={closeMenu}
                        className="mt-6 flex items-center justify-center gap-2 rounded-md bg-[#d6f36a] py-2.5 text-xs font-bold text-[#202315] hover:bg-white transition-colors"
                    >
                        Estimate My Trade-in Value <HiArrowRight />
                    </a>
                </div>
            </div>
        </div>
    )
}

export default CircularPreLovedMarketMegaMenu
