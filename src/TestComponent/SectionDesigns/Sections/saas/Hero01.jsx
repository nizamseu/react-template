// NorthstarOperationsCloudDashboardHero

// Hero01 · SaaS Platforms › Hero sections

// Description:
// A dark split hero for "Northstar / Operations Cloud", a work-management platform.
// The left column carries the headline "Less chasing. More shipping.", a one-line
// pitch ("A calm command center for projects, people, and the work between them")
// and a mint "See the platform" button. The right column is a static workspace
// dashboard mockup ("Team workspace / Q3 launch") with three KPI tiles and an 86%
// release-readiness progress bar.

// Design:
// - <section> with a two-column grid `lg:grid-cols-[.8fr_1.2fr]` (gap-9): the copy
//   column is vertically centred, and the mockup panel holds a 3-column KPI grid
//   plus a progress card.
// - Dark palette: base #111a22, panel #1b2832, tiles #24343e, mint accent #65e6b4
//   (eyebrow, CTA, progress fill, percentage). Text is white, with white/50-60 for
//   secondary copy.
// - Typography: xs bold uppercase eyebrow with tracking-[.16em]; headline
//   text-4xl -> sm:text-6xl semibold, leading-[1.02]; KPI values text-xl. The
//   section and panel are rounded-lg, tiles and button rounded-md, the panel has a
//   white/10 border, and there are no shadows.
// - Responsive: copy sits above the mockup below lg and beside it from lg. Padding
//   goes p-5 -> sm:p-8 (panel p-4 -> sm:p-6). The KPI grid stays 3 columns.

// What it does:
// - Purely presentational: no content props, no state.
// - One CTA anchor to `#product` with a HiArrowRight icon. The KPI tiles are
//   mapped from an inline [label, value] array (Tasks 128, On track 86%,
//   This week 24).

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import NorthstarOperationsCloudDashboardHero from '@/TestComponent/SectionDesigns/Sections/saas/Hero01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <NorthstarOperationsCloudDashboardHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function NorthstarOperationsCloudDashboardHero({
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
                'overflow-hidden rounded-lg bg-[#111a22] p-5 text-white sm:p-8',
                className,
            )}
            {...props}
        >
            <div className="grid gap-9 lg:grid-cols-[.8fr_1.2fr]">
                <div className="flex flex-col justify-center py-5">
                    <p className="text-xs font-bold uppercase tracking-[.16em] text-[#65e6b4]">
                        NORTHSTAR / OPERATIONS CLOUD
                    </p>
                    <h2 className="mt-4 text-4xl font-semibold leading-[1.02] sm:text-6xl">
                        Less chasing.
                        <br />
                        More shipping.
                    </h2>
                    <p className="mt-5 max-w-md text-sm leading-6 text-white/60">
                        A calm command center for projects, people, and the work
                        between them.
                    </p>
                    <a
                        href="#product"
                        className="mt-6 inline-flex items-center gap-2 self-start rounded-md bg-[#65e6b4] px-5 py-3 text-sm font-bold text-[#111a22]"
                    >
                        See the platform <HiArrowRight />
                    </a>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#1b2832] p-4 sm:p-6">
                    <div className="flex justify-between text-xs text-white/55">
                        <span>Team workspace / Q3 launch</span>
                        <span>•••</span>
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-3">
                        {[
                            ['Tasks', '128'],
                            ['On track', '86%'],
                            ['This week', '24'],
                        ].map(([label, value]) => (
                            <div
                                key={label}
                                className="rounded-md bg-[#24343e] p-3"
                            >
                                <p className="text-[10px] text-white/50">
                                    {label}
                                </p>
                                <p className="mt-2 text-xl font-semibold">
                                    {value}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 rounded-md bg-[#24343e] p-4">
                        <div className="flex justify-between text-xs">
                            <span>Release readiness</span>
                            <span className="text-[#65e6b4]">86%</span>
                        </div>
                        <div className="mt-3 h-1.5 rounded bg-white/10">
                            <div className="h-1.5 w-[86%] rounded bg-[#65e6b4]" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default NorthstarOperationsCloudDashboardHero
