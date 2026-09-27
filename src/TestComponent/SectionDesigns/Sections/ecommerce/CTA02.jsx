// CircularBuybackVoucherCTA

// CTA02 · E-commerce & Marketplaces › Banner CTAs

// Description:
// Neo-brutalist trade-in banner: "SEND US YOUR WORN GOODS. GET $50 STORE CREDIT." Copy
// explains that authentic past-season pieces are refurbished into the circular
// marketplace with a free shipping label; a faux barcode voucher "#RECYCLE-2026" sits next
// to a "Generate Label" button.

// Design:
// - flex-col → lg:flex-row (items-center, justify-between): copy left, voucher + button
//   right (shrink-0).
// - Lime #d6f36a background, black text and borders, white voucher box, black button with
//   lime text that inverts to white/black on hover; no dark-mode variants.
// - Mono font-black uppercase headline text-2xl → sm:text-4xl; black eyebrow chip with lime
//   text; rounded-none border-2 border-black with hard offset shadow
//   shadow-[8px_8px_0px_0px_#000]; the barcode is drawn with pipe characters.
// - Voucher and button stack below sm (button full width), then sit side by side.

// What it does:
// - Purely presentational: no content props, no state.
// - One anchor CTA "Generate Label" → #buyback (HiArrowRight icon).

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CircularBuybackVoucherCTA from '@/TestComponent/SectionDesigns/Sections/ecommerce/CTA02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <CircularBuybackVoucherCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CircularBuybackVoucherCTA({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'overflow-hidden rounded-none border-2 border-black bg-[#d6f36a] p-8 text-black shadow-[8px_8px_0px_0px_#000]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <span className="font-mono text-xs font-black uppercase tracking-[.2em] bg-black text-[#d6f36a] px-2 py-0.5">
                        CIRCULAR BUYBACK VOUCHER
                    </span>
                    <h2 className="mt-3 font-mono text-2xl sm:text-4xl font-black uppercase tracking-tight">
                        SEND US YOUR WORN GOODS. GET $50 STORE CREDIT.
                    </h2>
                    <p className="mt-2 font-mono text-xs text-black/80 max-w-xl">
                        Any authentic piece from past seasons cleaned and refurbished into our circular marketplace. Free shipping label provided immediately.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
                    <div className="font-mono text-[9px] text-center border border-black p-2 bg-white">
                        <div className="tracking-widest">||| | |||| | ||| || |||</div>
                        <div className="font-bold">#RECYCLE-2026</div>
                    </div>
                    <a
                        href="#buyback"
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 border-2 border-black bg-black px-6 py-3.5 font-mono text-xs font-black uppercase tracking-wider text-[#d6f36a] hover:bg-white hover:text-black transition-colors"
                    >
                        <span>Generate Label</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default CircularBuybackVoucherCTA
