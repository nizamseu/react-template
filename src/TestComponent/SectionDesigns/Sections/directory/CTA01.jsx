// ClaimYourListingVerificationCTA

// CTA01 · Directories & Search Aggregators › Banner CTAs

// Description:
// Dark owner-facing banner: "Own an Independent Workshop, Roastery, or
// Bookstore?" It invites proprietors to claim a free verified directory marker
// (hours, replies to patron notes, maker story) via a "Claim Your Independent
// Listing" button, verified by business registration or postal dispatch.

// Design:
// - Single left-aligned content block (max-w-2xl) ending in a button + note row
// - Dark #14201e background, white text (white/70 body, white/50 note), lime
//   #d9f064 eyebrow and pill button with #14201e text (hover white)
// - Eyebrow font-mono 10px bold uppercase tracking-widest with a shield icon;
//   heading font-serif text-3xl → sm:text-4xl bold; rounded-2xl section with
//   border-white/10 and shadow-2xl; rounded-full button
// - Below sm the button (full width) and centred note stack; from sm they sit
//   in a row; padding p-8 → sm:p-12

// What it does:
// - Purely presentational: no content props, no state
// - "Claim Your Independent Listing" links to #claim-listing

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ClaimYourListingVerificationCTA from '@/TestComponent/SectionDesigns/Sections/directory/CTA01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <ClaimYourListingVerificationCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight, HiOutlineShieldCheck } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function ClaimYourListingVerificationCTA({
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
                'relative overflow-hidden rounded-2xl border border-white/10 bg-[#14201e] p-8 text-white sm:p-12 shadow-2xl',
                className,
            )}
            {...props}
        >
            <div className="relative z-10 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#d9f064]">
                    <HiOutlineShieldCheck className="text-sm" /> PROPRIETOR VERIFICATION &bull; ZERO ADS
                </span>
                <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold leading-tight">
                    Own an Independent Workshop, Roastery, or Bookstore?
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                    Claim your official verified directory marker. Update operating hours, respond directly to patron notes, and showcase your maker story. 100% free forever.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <a
                        href="#claim-listing"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d9f064] px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-[#14201e] hover:bg-white transition-colors"
                    >
                        <span>Claim Your Independent Listing</span>
                        <HiArrowRight />
                    </a>
                    <span className="font-mono text-xs text-white/50 text-center sm:text-left">
                        Verified via business registration or postal dispatch
                    </span>
                </div>
            </div>
        </section>
    )
}

export default ClaimYourListingVerificationCTA
