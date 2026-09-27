// BrowseStaysFooter

// Footer05 · Booking & Reservations › Footers

// Description:
// A dark closing footer that invites one more search. Under "Somewhere is
// calling" the headline "Find a place to let the week fall away." leads to a
// "Browse all stays" link, beside a 2x2 grid of stay categories; it ends with
// "© Elsewhere · Travel well."

// Design:
// - md:grid-cols-[1fr_auto]: message left, link grid bottom-aligned
//   (self-end) right; copyright below a white/15 rule
// - Deep teal #132d3a background, white text, peach #f0aa8d eyebrow and link
//   underline, white/60 links, white/40 copyright
// - Serif text-4xl headline, bold uppercase text-xs eyebrow with
//   tracking-[.14em], underlined text link; rounded-lg shell
// - Stacks below md; padding p-7 → sm:p-10

// What it does:
// - Purely presentational: no content props, no state
// - Anchors: "Browse all stays" (HiArrowRight) → #search, #coast, #cabins,
//   #city, #hosts

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import BrowseStaysFooter from '@/TestComponent/SectionDesigns/Sections/booking/Footer05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <BrowseStaysFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function BrowseStaysFooter({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    return (
        <footer
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'rounded-lg bg-[#132d3a] p-7 text-white sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="grid gap-8 md:grid-cols-[1fr_auto]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#f0aa8d]">
                        Somewhere is calling
                    </p>
                    <h2 className="mt-3 max-w-lg font-serif text-4xl">
                        Find a place to let the week fall away.
                    </h2>
                    <a
                        href="#search"
                        className="mt-5 inline-flex items-center gap-2 border-b border-[#f0aa8d] pb-2 text-sm"
                    >
                        Browse all stays <HiArrowRight />
                    </a>
                </div>
                <div className="grid grid-cols-2 gap-x-7 gap-y-3 self-end text-xs text-white/60">
                    <a href="#coast">Coastal stays</a>
                    <a href="#cabins">Cabins</a>
                    <a href="#city">City breaks</a>
                    <a href="#hosts">Meet the hosts</a>
                </div>
            </div>
            <p className="mt-8 border-t border-white/15 pt-4 text-xs text-white/40">
                © Elsewhere · Travel well.
            </p>
        </footer>
    )
}

export default BrowseStaysFooter
