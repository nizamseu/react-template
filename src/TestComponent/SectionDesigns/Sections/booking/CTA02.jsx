// AnnualKeyMembershipCTA

// CTA02 · Booking & Reservations › Banner CTAs

// Description:
// A light membership banner for "The Elsewhere Annual Key": 14 redeemable
// nights a year across 48 architectural residences, with priority dates,
// waived deposits and private chef services. A "Request Keyholder Portfolio"
// button carries the note "Limited to 150 members globally per year".

// Design:
// - Grid: single column → lg:grid-cols-[1.3fr_0.7fr] (copy | CTA stack),
//   items vertically centered
// - Paper #f7f5f0 background, ink #1c2c34 text (70% for body), rust #b65f47
//   eyebrow and button (hover #1c2c34), #d8e2e6 border, gray-500 note
// - Mono uppercase tracking-widest eyebrow, serif text-3xl → sm:text-4xl
//   bold headline; rounded-xl shell, rounded-lg button, no shadow
// - Padding p-8 → sm:p-12; the CTA column drops below the copy under lg

// What it does:
// - Purely presentational: no content props, no state
// - "Request Keyholder Portfolio" (HiArrowRight) is an anchor to #request-key

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import AnnualKeyMembershipCTA from '@/TestComponent/SectionDesigns/Sections/booking/CTA02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <AnnualKeyMembershipCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function AnnualKeyMembershipCTA({
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
                'rounded-xl border border-[#d8e2e6] bg-[#f7f5f0] p-8 text-[#1c2c34] sm:p-12',
                className,
            )}
            {...props}
        >
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 items-center">
                <div>
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#b65f47]">
                        THE ELSEWHERE ANNUAL KEY &bull; 14 NIGHTS GLOBALLY
                    </span>
                    <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold leading-tight">
                        One Flexible Membership. 48 Extraordinary Residences.
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-[#1c2c34]/70">
                        Enjoy 14 redeemable nights throughout the year across our entire global portfolio of architectural sanctuaries. Priority dates, waived deposit fees, and dedicated private chef services.
                    </p>
                </div>

                <div className="flex flex-col gap-3 justify-end">
                    <a
                        href="#request-key"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#b65f47] px-6 py-3.5 font-mono text-xs font-bold text-white hover:bg-[#1c2c34] transition-colors"
                    >
                        <span>Request Keyholder Portfolio</span>
                        <HiArrowRight />
                    </a>
                    <span className="font-mono text-[11px] text-gray-500 text-center">
                        Limited to 150 members globally per year
                    </span>
                </div>
            </div>
        </section>
    )
}

export default AnnualKeyMembershipCTA
