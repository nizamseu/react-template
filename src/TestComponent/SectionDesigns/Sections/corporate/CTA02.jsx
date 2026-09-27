// InvestorSymposiumInvitationCTA

// CTA02 · Corporate & Business › Banner CTAs

// Description:
// Dark event banner for the "2026 GLOBAL INVESTOR SYMPOSIUM · ZURICH", headlined "Annual
// Institutional Partners & LP Summit". The copy invites 250 sovereign wealth CIOs, private
// equity GPs and Fortune 50 executives to two days of closed-door sessions; visitors can
// "Request Institutional Delegate Invitation", with an accreditation note below.

// Design:
// - Grid grid-cols-1 -> lg:grid-cols-[1.3fr_0.7fr] gap-8 items-center (copy | action stack)
// - Very dark #0b111a background with a white/20 border; sky-blue #84b9ff eyebrow and
//   filled button (text #0b111a, hover:bg-white); body copy white/70, note white/50
// - Headline text-3xl -> sm:text-4xl font-bold; font-mono eyebrow, button and note;
//   rounded-xl section, rounded-lg button
// - Below lg the action stack sits under the copy with a full-width button; padding
//   p-8 -> sm:p-12

// What it does:
// - Purely presentational: no content props, no state
// - Single anchor CTA -> #register-symposium with an HiArrowRight icon

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import InvestorSymposiumInvitationCTA from '@/TestComponent/SectionDesigns/Sections/corporate/CTA02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <InvestorSymposiumInvitationCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function InvestorSymposiumInvitationCTA({
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
                'rounded-xl border border-white/20 bg-[#0b111a] p-8 text-white sm:p-12',
                className,
            )}
            {...props}
        >
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 items-center">
                <div>
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#84b9ff]">
                        2026 GLOBAL INVESTOR SYMPOSIUM &bull; ZURICH
                    </span>
                    <h2 className="mt-2 text-3xl sm:text-4xl font-bold leading-tight">
                        Annual Institutional Partners & LP Summit
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">
                        Join 250 sovereign wealth CIOs, private equity general partners, and Fortune 50 executives for two days of closed-door macroeconomic intelligence and direct bilateral dealmaking.
                    </p>
                </div>

                <div className="flex flex-col gap-3 justify-end">
                    <a
                        href="#register-symposium"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#84b9ff] px-6 py-3.5 font-mono text-xs font-bold text-[#0b111a] hover:bg-white transition-colors"
                    >
                        <span>Request Institutional Delegate Invitation</span>
                        <HiArrowRight />
                    </a>
                    <span className="font-mono text-[11px] text-white/50 text-center">
                        Strict accreditation verification required
                    </span>
                </div>
            </div>
        </section>
    )
}

export default InvestorSymposiumInvitationCTA
