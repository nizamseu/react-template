// SecurityAdvisoryAlertSubscriptionBanner

// CTA05 · Knowledge Bases & Documentation › Banner CTAs

// Description:
// A near-black status/advisory banner: "Instant Real-Time Alerts for Breaking
// Changes & Security Advisories". A pulsing "99.998% EDGES OPERATIONAL" pill and
// four delivery-channel chips (Webhook, PagerDuty, Slack, Encrypted Email) sit
// beside an "Incident Dispatch Subscription" email sign-up panel.

// Design:
// - Flex column that becomes lg:flex-row: copy + channel chips on the left
//   (max-w-2xl), subscription panel on the right (w-full lg:w-96).
// - Dark palette: background #0a110e, border white/10; Tailwind emerald accents
//   (emerald-400 pill/checks/icons, emerald-500 button with black text hovering to
//   emerald-400, emerald-500 input focus border) rather than the folder's
//   #41715d / #9bd2a7 tokens; chips white/10, panel black/50, input black/60.
// - Monospace base font with a sans-serif headline text-2xl → sm:text-4xl
//   font-extrabold tracking-tight; rounded-full status pill, rounded-lg chips,
//   inputs and button; rounded-xl panel, rounded-2xl section, shadow-2xl.
// - Padding p-8 → sm:p-12; the panel stacks full-width below the copy until lg;
//   badge row and chips use flex-wrap.

// What it does:
// - No content props or state. The status dot pulses via animate-pulse (CSS only); the
//   email input is uncontrolled, not inside a form and has no label;
//   "Subscribe to Incident Alerts" is a type="button" with no onClick.
// - One anchor, "status.platform.dev →" → #status-page.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SecurityAdvisoryAlertSubscriptionBanner from '@/TestComponent/SectionDesigns/Sections/knowledge/CTA05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <SecurityAdvisoryAlertSubscriptionBanner />
//     </main>
// )
// ```

'use client'

import { HiArrowRight, HiOutlineBell, HiOutlineShieldCheck, HiCheck } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function SecurityAdvisoryAlertSubscriptionBanner({
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
                'relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a110e] p-8 text-white sm:p-12 shadow-2xl font-mono',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            99.998% EDGES OPERATIONAL
                        </span>
                        <span className="text-xs text-white/40">CVE &bull; TLS 1.3 &bull; ZERO-DAY DISPATCH</span>
                    </div>

                    <h2 className="mt-3 font-sans text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                        Instant Real-Time Alerts for Breaking Changes &amp; Security Advisories
                    </h2>
                    <p className="mt-3 font-sans text-sm leading-relaxed text-white/70">
                        Never get caught off-guard by scheduled gateway maintenance, protocol deprecations, or security patches. Stream instant machine-readable alerts directly to your incident pipeline.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2 text-xs">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1 text-white">
                            <HiCheck className="text-emerald-400" /> Webhook Payload
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1 text-white">
                            <HiCheck className="text-emerald-400" /> PagerDuty Service
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1 text-white">
                            <HiCheck className="text-emerald-400" /> Slack Channel
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1 text-white">
                            <HiCheck className="text-emerald-400" /> Encrypted Email
                        </span>
                    </div>
                </div>

                <div className="w-full lg:w-96 rounded-xl border border-white/10 bg-black/50 p-5 shrink-0">
                    <div className="flex items-center gap-2 text-xs text-white/80 font-bold mb-3">
                        <HiOutlineBell className="text-emerald-400 text-base" />
                        <span>Incident Dispatch Subscription</span>
                    </div>
                    <div className="space-y-3">
                        <input
                            type="email"
                            placeholder="ops-oncall@company.com"
                            className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:border-emerald-500 focus:outline-none"
                        />
                        <button
                            type="button"
                            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 font-sans text-xs font-bold text-black hover:bg-emerald-400 transition-colors shadow"
                        >
                            <span>Subscribe to Incident Alerts</span>
                            <HiArrowRight className="text-xs" />
                        </button>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
                        <span className="flex items-center gap-1">
                            <HiOutlineShieldCheck className="text-emerald-400" /> Verified Feed
                        </span>
                        <a href="#status-page" className="text-emerald-400 hover:underline">
                            status.platform.dev &rarr;
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SecurityAdvisoryAlertSubscriptionBanner
