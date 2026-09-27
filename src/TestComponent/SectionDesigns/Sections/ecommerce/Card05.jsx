// LiveVaultAuctionLotCard

// Card05 · E-commerce & Marketplaces › Cards

// Description:
// Marketplace auction card for "LIVE VAULT AUCTION • LOT #408", a 1974 "Brazilian Rosewood
// Lounge Chair" from the Archive Vault. It shows a pinging live dot, "84 watching", a
// "CONDITION: MINT (A+)" badge, the current bid $2,450 (18 bids) and time left
// "04h 18m 32s", with "Place Bid ($2,500)" and "History" buttons.

// Design:
// - Header row → h-60 image with a top-right condition badge → eyebrow + serif title →
//   2-column bid/clock panel → button row (flex-1 primary + compact secondary).
// - Dark palette: #1c1b18 card, #f3eee6 text, white/10 borders, white/5 panel, amber-300
//   bid and badge text, rose-400/500 live dot and countdown, amber-400 primary button
//   (hover white); always dark.
// - rounded-xl card with shadow-2xl, rounded-lg image, panel and buttons; mono type for
//   labels and figures, serif bold title text-lg; animate-ping live dot; image
//   hover:scale-105.
// - No breakpoint-specific classes: the card fills the width of its grid cell.

// What it does:
// - Purely presentational: no content props, no state; the bid and countdown are static text.
// - "Place Bid ($2,500)" and "History" are buttons with no handlers.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import LiveVaultAuctionLotCard from '@/TestComponent/SectionDesigns/Sections/ecommerce/Card05';

// const ProductGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <LiveVaultAuctionLotCard />
//     </div>
// )
// ```

'use client'

import { HiOutlineClock, HiOutlineEye } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function LiveVaultAuctionLotCard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    return (
        <article
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'overflow-hidden rounded-xl border border-white/10 bg-[#1c1b18] p-5 text-[#f3eee6] shadow-2xl',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-rose-400">
                    <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                    LIVE VAULT AUCTION &bull; LOT #408
                </span>
                <span className="flex items-center gap-1 text-[11px] font-mono text-white/50">
                    <HiOutlineEye /> 84 watching
                </span>
            </div>

            <div className="relative mt-4 h-60 overflow-hidden rounded-lg bg-black">
                <img
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=85"
                    alt="Vintage 1974 Brazilian Rosewood Armchair"
                />
                <div className="absolute top-3 right-3 rounded bg-black/80 px-2 py-1 font-mono text-[10px] text-amber-300 backdrop-blur-sm">
                    CONDITION: MINT (A+)
                </div>
            </div>

            <div className="mt-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest">
                            ARCHIVE VAULT &bull; DESIGNED 1974
                        </span>
                        <h3 className="mt-1 font-serif text-lg font-bold text-white">
                            Brazilian Rosewood Lounge Chair
                        </h3>
                    </div>
                </div>

                {/* Auction Live Clock & Current Bid */}
                <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-white/5 p-3 font-mono border border-white/10">
                    <div>
                        <span className="block text-[10px] text-white/40">CURRENT BID (18 BIDS)</span>
                        <span className="text-lg font-black text-amber-300">$2,450</span>
                    </div>
                    <div className="text-right">
                        <span className="flex items-center justify-end gap-1 text-[10px] text-white/40">
                            <HiOutlineClock /> TIME LEFT
                        </span>
                        <span className="text-base font-black text-rose-400">04h 18m 32s</span>
                    </div>
                </div>

                <div className="mt-4 flex gap-2">
                    <button
                        type="button"
                        className="flex-1 rounded-lg bg-amber-400 py-2.5 font-mono text-xs font-black uppercase tracking-wider text-black hover:bg-white transition-colors"
                    >
                        Place Bid ($2,500)
                    </button>
                    <button
                        type="button"
                        className="rounded-lg border border-white/20 px-3 py-2.5 text-xs font-mono text-white/80 hover:bg-white/10 transition-colors"
                    >
                        History
                    </button>
                </div>
            </div>
        </article>
    )
}

export default LiveVaultAuctionLotCard
