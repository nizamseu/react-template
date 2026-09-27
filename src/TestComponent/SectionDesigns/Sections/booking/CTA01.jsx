// PrivateBuyoutConciergeCTA

// CTA01 · Booking & Reservations › Banner CTAs

// Description:
// A dark luxury banner selling full private-island and residence buyouts for
// sabbaticals, executive summits and creative retreats. Under the headline
// "Exclusive Solitude for What Matters Most." it offers an "Inquire with
// Private Concierge" button and a response-time / confidentiality note.

// Design:
// - Padded section with content in a max-w-2xl column (relative z-10); the
//   CTA and its note sit in a row below the copy
// - Deep teal #102530 background, white text, white/70 and white/50 muted
//   copy, coral #e07d5b eyebrow and CTA (hover inverts to white with
//   #102530 text)
// - Mono uppercase tracking-widest eyebrow and CTA; serif text-3xl →
//   sm:text-5xl normal-weight headline; rounded-2xl shell, white/10 border,
//   shadow-2xl, rounded-full CTA
// - Padding p-8 → sm:p-12; CTA row is a stretched column on mobile and
//   becomes sm:flex-row

// What it does:
// - Purely presentational: no content props, no state
// - "Inquire with Private Concierge" (HiArrowRight) is an anchor to
//   #inquire-concierge

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PrivateBuyoutConciergeCTA from '@/TestComponent/SectionDesigns/Sections/booking/CTA01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <PrivateBuyoutConciergeCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function PrivateBuyoutConciergeCTA({
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
                'relative overflow-hidden rounded-2xl border border-white/10 bg-[#102530] p-8 text-white sm:p-12 shadow-2xl',
                className,
            )}
            {...props}
        >
            <div className="relative z-10 max-w-2xl">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#e07d5b]">
                    PRIVATE ISLAND & RESIDENCE BUYOUTS &bull; BESPOKE ACCESS
                </span>
                <h2 className="mt-3 font-serif text-3xl sm:text-5xl font-normal leading-tight">
                    Exclusive Solitude for What Matters Most.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                    Complete sanctuary buyouts for multi-generational sabbaticals, executive summits, and creative retreats. Dedicated private aviation liaisons and discrete on-site staff.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <a
                        href="#inquire-concierge"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e07d5b] px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-white hover:text-[#102530] transition-colors"
                    >
                        <span>Inquire with Private Concierge</span>
                        <HiArrowRight />
                    </a>
                    <span className="font-mono text-xs text-white/50 text-center sm:text-left">
                        Responses within 4 hours &bull; Strict confidentiality
                    </span>
                </div>
            </div>
        </section>
    )
}

export default PrivateBuyoutConciergeCTA
