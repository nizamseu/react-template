// BecomeAHostFooter

// Footer04 · Booking & Reservations › Footers

// Description:
// A terracotta host-recruitment footer. The eyebrow "Know a place worth
// sharing?" and headline "Make room for the next good guest." sit beside a
// white "Become a host" pill; a slim bottom bar shows "© Elsewhere 2026" and
// "Hosting · Safety · Support".

// Design:
// - Flex column → md:flex-row (md:items-end, justify-between) for message
//   and CTA, then a justify-between bottom bar under a white/25 rule
// - Terracotta #b65f47 background, white text (white/70 eyebrow and bottom
//   bar), white CTA with #132d3a text
// - Serif text-4xl headline, bold uppercase text-xs eyebrow with
//   tracking-[.14em]; rounded-lg shell, rounded-full CTA
// - Message and CTA stack below md; padding p-7 → sm:p-10

// What it does:
// - Purely presentational: no content props, no state
// - "Become a host" (HiArrowRight) is an anchor to #host; the bottom-bar
//   items are plain text, not links

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import BecomeAHostFooter from '@/TestComponent/SectionDesigns/Sections/booking/Footer04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <BecomeAHostFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function BecomeAHostFooter({
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
                'rounded-lg bg-[#b65f47] p-7 text-white sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-white/70">
                        Know a place worth sharing?
                    </p>
                    <h2 className="mt-3 max-w-xl font-serif text-4xl">
                        Make room for the next good guest.
                    </h2>
                </div>
                <a
                    href="#host"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#132d3a]"
                >
                    Become a host <HiArrowRight />
                </a>
            </div>
            <div className="mt-9 flex justify-between border-t border-white/25 pt-4 text-xs text-white/70">
                <span>© Elsewhere 2026</span>
                <span>Hosting · Safety · Support</span>
            </div>
        </footer>
    )
}

export default BecomeAHostFooter
