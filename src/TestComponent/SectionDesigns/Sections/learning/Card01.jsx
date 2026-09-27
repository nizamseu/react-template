// CreativeDirectionCohortSyllabusCard

// Card01 · Learning Management & EdTech › Cards

// Description:
// Dark course card for a "10-WEEK INTENSIVE • COHORT 04" (18 students max) titled
// "Creative Direction & Systems for Modern Brands". It shows an instructor blurb,
// a mini roadmap of three weekly modules (W01 Strategy, W03 Identity, W06
// Spatial), the start date and price (Oct 15 • $1,450) and a "Syllabus" button.

// Design:
// - Single <article>: header row (cohort label + capacity chip, border-b),
//   title and blurb, inset roadmap panel of label/topic rows, footer row (border-t)
// - Dark palette: #0e272f background, #e8f3ea base text with white/60-80
//   secondary, lime #c8ef70 labels and CTA, #1b3e49 capacity chip, white/5
//   roadmap panel, white/10 borders
// - Mono 10px uppercase tracking-widest labels, serif text-2xl bold title;
//   rounded-2xl card with shadow-xl, rounded-xl roadmap, rounded-full chip/CTA
// - No breakpoint classes: fluid width that fills its grid cell

// What it does:
// - Purely presentational: no content props, no state
// - Single anchor "Syllabus" -> #cohort-detail (hover:bg-white colour
//   transition); roadmap rows are hard-coded, not mapped from an array

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CreativeDirectionCohortSyllabusCard from '@/TestComponent/SectionDesigns/Sections/learning/Card01';

// const CourseGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <CreativeDirectionCohortSyllabusCard />
//     </div>
// )
// ```

'use client'

import { HiArrowRight, HiOutlineClock, HiOutlineUserGroup } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CreativeDirectionCohortSyllabusCard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    return (
        <article
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'overflow-hidden rounded-2xl border border-white/10 bg-[#0e272f] p-5 text-[#e8f3ea] shadow-xl',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#c8ef70]">
                    10-WEEK INTENSIVE &bull; COHORT 04
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#1b3e49] px-2.5 py-0.5 text-[10px] text-white">
                    <HiOutlineUserGroup /> 18 Students Max
                </span>
            </div>

            <div className="mt-4">
                <h3 className="font-serif text-2xl font-bold text-white leading-tight">
                    Creative Direction & Systems for Modern Brands
                </h3>
                <p className="mt-2 text-xs text-white/70">
                    Lead by former design directors from Pentagram and Apple. Transition from senior craftsperson into visionary design leadership.
                </p>

                {/* 4-Week Milestone Roadmap */}
                <div className="mt-4 space-y-2 rounded-xl bg-white/5 p-3 text-xs border border-white/5">
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-[#c8ef70]">W01 &bull; STRATEGY</span>
                        <span className="text-white/80">Cultural Positioning & Voice</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-[#c8ef70]">W03 &bull; IDENTITY</span>
                        <span className="text-white/80">Kinetic Typography Systems</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-[#c8ef70]">W06 &bull; SPATIAL</span>
                        <span className="text-white/80">3D Interactive Environments</span>
                    </div>
                </div>

                <div className="mt-5 flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="flex items-center gap-1.5 font-mono text-xs text-white/60">
                        <HiOutlineClock />
                        <span>Starts Oct 15 &bull; $1,450</span>
                    </div>
                    <a
                        href="#cohort-detail"
                        className="inline-flex items-center gap-1 rounded-full bg-[#c8ef70] px-4 py-1.5 font-mono text-xs font-bold text-[#0e272f] hover:bg-white transition-colors"
                    >
                        <span>Syllabus</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </article>
    )
}

export default CreativeDirectionCohortSyllabusCard
