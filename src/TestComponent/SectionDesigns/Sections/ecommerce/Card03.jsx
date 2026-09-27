// RawEmeraldRingHauteJoaillerieCard

// Card03 · E-commerce & Marketplaces › Cards

// Description:
// Luxury one-of-a-kind jewellery card for "The Solstice Raw Emerald Ring" (Haute
// Joaillerie No. 012, "1 OF 1 UNIQUE"). The photo carries "ZAMBIA • ETHICAL MINE" and
// "2.4 CT RAW" tags over a dark gradient, followed by the material line (18k recycled
// gold, lost-wax casting), a certification/valuation grid (GIA Verified #841, $1,850 USD)
// and "Acquire Piece" / "Inquire" buttons.

// Design:
// - Header row → h-64 image with a bottom gradient overlay and tag row → serif title →
//   2-column spec grid (border-y) → button row (flex-1 primary + compact secondary).
// - Dark luxe palette: #161412 card, #f5ede4 text, gold accent #c5a880 (also at /10 and
//   /80), white/10 borders and white/40–90 secondary text; always dark.
// - rounded-2xl card with shadow-2xl, rounded-xl image; serif light title text-xl
//   tracking-wide; mono text-[10px] uppercase labels; rounded-full outline buttons; the
//   photo scales to 110% on card hover (duration-700) and the primary fills gold on hover.
// - No breakpoint-specific classes: the card fills the width of its grid cell.

// What it does:
// - Purely presentational: no content props, no state.
// - "Acquire Piece" and "Inquire" are buttons with no handlers; HiOutlineSparkles marks the
//   unique badge.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import RawEmeraldRingHauteJoaillerieCard from '@/TestComponent/SectionDesigns/Sections/ecommerce/Card03';

// const ProductGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <RawEmeraldRingHauteJoaillerieCard />
//     </div>
// )
// ```

'use client'

import { HiOutlineSparkles, HiStar } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function RawEmeraldRingHauteJoaillerieCard({
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
                'group relative overflow-hidden rounded-2xl border border-white/10 bg-[#161412] p-5 text-[#f5ede4] shadow-2xl',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between text-[10px] font-mono text-[#c5a880] tracking-widest uppercase">
                <span>HAUTE JOAILLERIE &bull; NO. 012</span>
                <span className="flex items-center gap-1">
                    <HiOutlineSparkles /> 1 OF 1 UNIQUE
                </span>
            </div>

            <div className="relative mt-4 h-64 overflow-hidden rounded-xl bg-black">
                <img
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110 opacity-90"
                    src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85"
                    alt="Hand-forged raw emerald monolith ring"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#c5a880] bg-black/70 px-2 py-0.5 rounded backdrop-blur-sm">
                        ZAMBIA &bull; ETHICAL MINE
                    </span>
                    <span className="font-mono text-[10px] text-white/70">
                        2.4 CT RAW
                    </span>
                </div>
            </div>

            <div className="mt-4">
                <h3 className="font-serif text-xl font-light tracking-wide text-white">
                    The Solstice Raw Emerald Ring
                </h3>
                <p className="mt-1 text-xs text-[#c5a880]/80">
                    Solid 18k recycled molten gold &bull; Lost-wax casting
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 border-y border-white/10 py-3 text-xs">
                    <div>
                        <span className="block text-[10px] font-mono text-white/40 uppercase">CERTIFICATION</span>
                        <span className="font-medium text-white/90">GIA Verified #841</span>
                    </div>
                    <div>
                        <span className="block text-[10px] font-mono text-white/40 uppercase">VALUATION</span>
                        <span className="font-serif text-sm font-bold text-[#c5a880]">$1,850 USD</span>
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                    <button
                        type="button"
                        className="flex-1 rounded-full border border-[#c5a880] bg-[#c5a880]/10 py-2.5 text-center text-xs font-serif font-bold text-[#c5a880] hover:bg-[#c5a880] hover:text-black transition-colors"
                    >
                        Acquire Piece
                    </button>
                    <button
                        type="button"
                        className="rounded-full border border-white/20 px-3.5 py-2.5 text-xs text-white/70 hover:text-white transition-colors"
                    >
                        Inquire
                    </button>
                </div>
            </div>
        </article>
    )
}

export default RawEmeraldRingHauteJoaillerieCard
