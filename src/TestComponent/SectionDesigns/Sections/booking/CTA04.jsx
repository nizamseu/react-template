// SecretSeasonArchiveCTA

// CTA04 · Booking & Reservations › Banner CTAs

// Description:
// A dark, invitation-only banner for the "Secret Season Archive": 18 historic
// residences whose owners never list publicly, open only in off-peak
// shoulder seasons to verified patrons. A key-icon eyebrow ("UNLISTED
// PROPERTIES • PRIVATE INVITATION") leads to a "Request Secret Season Key" pill.

// Design:
// - Flex column → md:flex-row (copy in max-w-xl | button), justify-between
// - Dark teal #1a2d36 background, white text, white/70 body, coral #e07d5b
//   eyebrow and button (hover white with #1a2d36 text), white/10 border
// - Mono uppercase tracking-widest text-[10px] eyebrow with HiOutlineKey,
//   serif text-3xl bold headline; rounded-2xl shell, shadow-xl,
//   rounded-full button
// - Stacks below md; padding p-8 → sm:p-12

// What it does:
// - Purely presentational: no content props, no state
// - "Request Secret Season Key" (HiArrowRight) is an anchor to #secret-season

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SecretSeasonArchiveCTA from '@/TestComponent/SectionDesigns/Sections/booking/CTA04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <SecretSeasonArchiveCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight, HiOutlineKey } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function SecretSeasonArchiveCTA({
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
                'rounded-2xl border border-white/10 bg-[#1a2d36] p-8 text-white sm:p-12 shadow-xl',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-xl">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#e07d5b]">
                        <HiOutlineKey className="text-sm" /> UNLISTED PROPERTIES &bull; PRIVATE INVITATION
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-bold leading-tight">
                        Access the Secret Season Archive
                    </h2>
                    <p className="mt-2 text-sm text-white/70">
                        18 architecturally historic residences whose owners never list publicly. Accessible only during off-peak shoulder seasons to verified patrons of the craft.
                    </p>
                </div>

                <a
                    href="#secret-season"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e07d5b] px-6 py-3.5 font-mono text-xs font-bold text-white hover:bg-white hover:text-[#1a2d36] transition-colors shrink-0"
                >
                    <span>Request Secret Season Key</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

export default SecretSeasonArchiveCTA
