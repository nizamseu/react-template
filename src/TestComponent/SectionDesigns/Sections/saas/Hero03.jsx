// TeamSyncProjectHealthHero

// Hero03 · SaaS Platforms › Hero sections

// Description:
// A dark two-panel hero for an operations tool, pitched as "Operations / without
// the spreadsheets". The left panel shows the headline "Your whole team, in sync."
// and a "See the workflow" text link. The right panel is an inset "Project health"
// card reading "On track ↗", with a three-row task list: Design review (Done),
// Customer preview (Today) and Release notes (Next).

// Design:
// - <section> grid `md:grid-cols-[1fr_.9fr]`. The left column uses flex-col
//   justify-between to spread the eyebrow, headline and link vertically. The right
//   column is an inset card (m-5) holding a divided task list.
// - Dark palette: section #1b2832, inset card #111a22, mint accent #65e6b4 (eyebrow,
//   arrow, task statuses). Text is white, with white/50 labels and white/10
//   borders.
// - Typography: xs bold uppercase eyebrow, tracking-[.16em]; headline text-5xl
//   semibold leading-none (does not scale); card status text-3xl. The section and
//   card are rounded-lg, and tasks are separated by border-t dividers.
// - Responsive: the panels stack below md and sit side by side from md. Left panel
//   padding goes p-7 -> sm:p-11.

// What it does:
// - Purely presentational: no content props, no state.
// - One text link to `#demo` with a HiArrowRight icon. Task rows are mapped from
//   ['Design review', 'Customer preview', 'Release notes'], and each status is
//   picked by index from ['Done', 'Today', 'Next'].

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import TeamSyncProjectHealthHero from '@/TestComponent/SectionDesigns/Sections/saas/Hero03';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <TeamSyncProjectHealthHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function TeamSyncProjectHealthHero({
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
                'grid overflow-hidden rounded-lg bg-[#1b2832] text-white md:grid-cols-[1fr_.9fr]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col justify-between p-7 sm:p-11">
                <p className="text-xs font-bold uppercase tracking-[.16em] text-[#65e6b4]">
                    OPERATIONS / WITHOUT THE SPREADSHEETS
                </p>
                <h2 className="my-10 text-5xl font-semibold leading-none">
                    Your whole team,
                    <br />
                    in sync.
                </h2>
                <a
                    href="#demo"
                    className="inline-flex items-center gap-2 text-sm"
                >
                    See the workflow <HiArrowRight />
                </a>
            </div>
            <div className="m-5 rounded-lg border border-white/10 bg-[#111a22] p-5">
                <p className="text-xs text-white/50">PROJECT HEALTH</p>
                <p className="mt-3 text-3xl font-semibold">
                    On track <span className="text-[#65e6b4]">↗</span>
                </p>
                <div className="mt-6 space-y-3">
                    {['Design review', 'Customer preview', 'Release notes'].map(
                        (task, i) => (
                            <div
                                key={task}
                                className="flex justify-between border-t border-white/10 pt-3 text-xs"
                            >
                                <span>{task}</span>
                                <span className="text-[#65e6b4]">
                                    {['Done', 'Today', 'Next'][i]}
                                </span>
                            </div>
                        ),
                    )}
                </div>
            </div>
        </section>
    )
}

export default TeamSyncProjectHealthHero
