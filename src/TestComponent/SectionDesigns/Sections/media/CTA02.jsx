// PatronTierPledgeCTA

// CTA02 · Blogs & Digital Media › Banner CTAs

// Description:
// A dark reader-funding banner: "ZERO CORPORATE SPONSORSHIP · 100% PATRON
// BACKED". The headline "Critical Journalism Without Advertisers or Paywall
// Clickbait" explains that 42,000 patrons fund the work, and a side panel
// offers $5, $15 and $50 monthly tiers with a "Join Patron Fellowship" button.

// Design:
// - Flex row from lg (stacked below): copy block (max-w-xl) on the left, a
//   boxed tier selector on the right with a 3-column button grid and a
//   full-width action link
// - Dark palette: background #191919, white text (copy white/70), peach
//   accent #e7a37c (kicker, highlighted tier, action button), panel bg
//   white/5, borders white/10 and white/20
// - Serif text-3xl font-light headline; monospace labels and buttons;
//   rounded-xl banner and panel, small rounded tier buttons; shadow-2xl
// - Stacks below lg; the tier panel is full width on mobile and 320px wide
//   (sm:w-80) from sm; padding p-8 → sm:p-12

// What it does:
// - No content props or state: the tier buttons have no click handlers, and the
//   $15/mo tier is styled as selected with static classes (the others only
//   change colour on hover)
// - "Join Patron Fellowship" links to `#pledge`

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PatronTierPledgeCTA from '@/TestComponent/SectionDesigns/Sections/media/CTA02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <PatronTierPledgeCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function PatronTierPledgeCTA({
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
                'rounded-xl border border-white/10 bg-[#191919] p-8 text-white sm:p-12 shadow-2xl',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="max-w-xl">
                    <span className="font-mono text-xs text-[#e7a37c] font-bold uppercase tracking-widest">
                        ZERO CORPORATE SPONSORSHIP &bull; 100% PATRON BACKED
                    </span>
                    <h2 className="mt-3 font-serif text-3xl font-light leading-tight">
                        Critical Journalism Without Advertisers or Paywall Clickbait
                    </h2>
                    <p className="mt-3 text-sm text-white/70 leading-relaxed">
                        We refuse affiliate revenue, brand activations, and sponsored listicles. Every investigation is funded entirely by small recurring pledges from 42,000 patrons.
                    </p>
                </div>

                <div className="rounded-xl bg-white/5 p-5 border border-white/10 shrink-0 sm:w-80">
                    <span className="block font-mono text-[10px] text-white/50 mb-3">SELECT PATRON TIER:</span>
                    <div className="grid grid-cols-3 gap-2 font-mono text-xs font-bold mb-4">
                        <button type="button" className="rounded border border-white/20 p-2 hover:border-[#e7a37c] hover:text-[#e7a37c]">
                            $5/mo
                        </button>
                        <button type="button" className="rounded border-2 border-[#e7a37c] p-2 bg-[#e7a37c]/10 text-[#e7a37c]">
                            $15/mo
                        </button>
                        <button type="button" className="rounded border border-white/20 p-2 hover:border-[#e7a37c] hover:text-[#e7a37c]">
                            $50/mo
                        </button>
                    </div>
                    <a
                        href="#pledge"
                        className="flex items-center justify-center gap-2 w-full rounded bg-[#e7a37c] py-2.5 font-mono text-xs font-bold text-[#191919] hover:bg-white transition-colors"
                    >
                        <span>Join Patron Fellowship</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default PatronTierPledgeCTA
