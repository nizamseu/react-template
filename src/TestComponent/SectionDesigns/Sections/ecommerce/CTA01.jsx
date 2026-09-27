// PrivateSalonVaultAccessCTA

// CTA01 · E-commerce & Marketplaces › Banner CTAs

// Description:
// Dark luxury banner inviting patrons to "Unlock the Private Salon Vault." A "PASSKEY
// ACCESS ONLY • DROP 05" pill, copy about archive pieces and 1-of-1 collaborative
// prototypes opened to registered patrons 24 hours before public release, and an email
// form with a "Request Access Key" button.

// Design:
// - Single content column (relative z-10, max-w-2xl) inside a relative section.
// - Always dark: #161412 background, #f5eee6 text, gold accent #c5a880 (also at /15, /30
//   and /80), white/5 input fill, white/20 borders.
// - Serif light headline text-3xl → sm:text-4xl tracking-wide; mono uppercase pill badge;
//   rounded-full input and button; rounded-2xl shell with shadow-2xl; the button turns
//   white on hover and the input border turns gold on focus.
// - Form stacks on mobile and goes inline from sm; padding p-8 → sm:p-12.

// What it does:
// - Email form whose onSubmit only calls e.preventDefault(), so nothing is sent; the
//   input has a placeholder but no label or aria-label. No content props, no state.
// - No links; icons HiOutlineKey and HiArrowRight from react-icons/hi.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PrivateSalonVaultAccessCTA from '@/TestComponent/SectionDesigns/Sections/ecommerce/CTA01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <PrivateSalonVaultAccessCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight, HiOutlineKey } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function PrivateSalonVaultAccessCTA({
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
                'relative overflow-hidden rounded-2xl border border-white/10 bg-[#161412] p-8 text-[#f5eee6] sm:p-12 shadow-2xl',
                className,
            )}
            {...props}
        >
            <div className="relative z-10 max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#c5a880]/15 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#c5a880] border border-[#c5a880]/30">
                    <HiOutlineKey /> PASSKEY ACCESS ONLY &bull; DROP 05
                </span>
                <h2 className="mt-4 font-serif text-3xl sm:text-4xl font-light tracking-wide text-white">
                    Unlock the Private Salon Vault.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#c5a880]/80">
                    Our most sought-after archive pieces and 1-of-1 collaborative prototypes open to registered patrons 24 hours prior to public release.
                </p>

                <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex flex-col sm:flex-row gap-3">
                    <input
                        type="email"
                        placeholder="Enter personal email for passkey..."
                        className="rounded-full border border-white/20 bg-white/5 px-5 py-3 text-xs text-white placeholder:text-white/40 outline-none focus:border-[#c5a880] flex-1"
                    />
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c5a880] px-6 py-3 font-serif text-xs font-bold text-black hover:bg-white transition-colors shrink-0"
                    >
                        <span>Request Access Key</span>
                        <HiArrowRight />
                    </button>
                </form>
            </div>
        </section>
    )
}

export default PrivateSalonVaultAccessCTA
