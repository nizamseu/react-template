// EngineeringOfficeHoursRSVPBanner

// CTA02 · Knowledge Bases & Documentation › Banner CTAs

// Description:
// A dark event banner promoting weekly "LIVE ENGINEERING OFFICE HOURS": a
// "Deep-Dive Architecture AMA with Core Systems Maintainers". It lists the
// schedule (Every Wed @ 11:00 AM PT, 45 minutes, Google Meet / YouTube Live) and
// offers a side panel to submit a question and RSVP with an email.

// Design:
// - Relative section with a blurred mint glow top-right; flex column that
//   becomes lg:flex-row: copy block (max-w-2xl) on the left, RSVP panel
//   (w-full lg:w-96) on the right.
// - Dark palette: background #12201a, border #41715d/40, glow #9bd2a7/10; mint
//   accent #9bd2a7 (eyebrow, icons, input focus border, button background with
//   #12201a text, hover white); emerald-400/500 live dot; panel black/40 with
//   backdrop-blur-sm, inputs black/60.
// - Monospace uppercase tracking-widest eyebrow; headline text-2xl → sm:text-4xl
//   bold tracking-tight; text-sm body; text-xs inputs/buttons with rounded-lg;
//   rounded-2xl section, rounded-xl panel, shadow-2xl.
// - Padding p-8 → sm:p-12; the RSVP panel stacks full-width below the copy until
//   lg; the schedule row uses flex-wrap.

// What it does:
// - No content props or state. The "live" dot animates with animate-ping (CSS only).
// - The question (text) and email inputs are uncontrolled, not inside a form and
//   have no labels; "RSVP & Add to Calendar" is a type="button" with no onClick,
//   so nothing is submitted and no .ics invite is actually sent. No links.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import EngineeringOfficeHoursRSVPBanner from '@/TestComponent/SectionDesigns/Sections/knowledge/CTA02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <EngineeringOfficeHoursRSVPBanner />
//     </main>
// )
// ```

'use client'

import { HiArrowRight, HiCalendar, HiClock, HiOutlineVideoCamera } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function EngineeringOfficeHoursRSVPBanner({
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
                'relative overflow-hidden rounded-2xl border border-[#41715d]/40 bg-[#12201a] p-8 text-white sm:p-12 shadow-2xl',
                className,
            )}
            {...props}
        >
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#9bd2a7]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="max-w-2xl">
                    <div className="flex items-center gap-2">
                        <span className="flex h-2.5 w-2.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                        </span>
                        <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#9bd2a7]">
                            LIVE ENGINEERING OFFICE HOURS &bull; EVERY WEDNESDAY
                        </span>
                    </div>

                    <h2 className="mt-3 font-sans text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                        Deep-Dive Architecture AMA with Core Systems Maintainers
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">
                        Join our Principal Distributed Systems Architects and SRE Leads for unscripted technical discussions on query latency optimization, consensus failover, and multi-region synchronization.
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-white/60 font-mono">
                        <span className="flex items-center gap-1.5 text-white/90">
                            <HiCalendar className="text-[#9bd2a7]" /> Every Wed @ 11:00 AM PT
                        </span>
                        <span className="flex items-center gap-1.5 text-white/90">
                            <HiClock className="text-[#9bd2a7]" /> 45 Minutes Live Q&amp;A
                        </span>
                        <span className="flex items-center gap-1.5 text-white/90">
                            <HiOutlineVideoCamera className="text-[#9bd2a7]" /> Google Meet / YouTube Live
                        </span>
                    </div>
                </div>

                <div className="w-full lg:w-96 rounded-xl border border-white/10 bg-black/40 p-5 backdrop-blur-sm shrink-0">
                    <span className="block font-mono text-[11px] uppercase tracking-wider text-white/50 mb-3">
                        Submit Question for Next Session
                    </span>
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="e.g., How do you handle split-brain in raft?"
                            className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:border-[#9bd2a7] focus:outline-none"
                        />
                        <input
                            type="email"
                            placeholder="your.email@company.com"
                            className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:border-[#9bd2a7] focus:outline-none"
                        />
                        <button
                            type="button"
                            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#9bd2a7] px-4 py-2.5 font-sans text-xs font-bold text-[#12201a] hover:bg-white transition-all shadow"
                        >
                            <span>RSVP &amp; Add to Calendar</span>
                            <HiArrowRight className="text-xs" />
                        </button>
                    </div>
                    <p className="mt-2.5 text-center text-[10px] text-white/40 font-mono">
                        Calendar invite (.ics) sent immediately.
                    </p>
                </div>
            </div>
        </section>
    )
}

export default EngineeringOfficeHoursRSVPBanner
