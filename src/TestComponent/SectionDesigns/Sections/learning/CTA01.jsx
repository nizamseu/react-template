// EmergingVoicesFellowshipScholarshipCTA

// CTA01 · Learning Management & EdTech › Banner CTAs

// Description:
// Dark banner announcing the "2026 EMERGING VOICES FELLOWSHIP" with five
// full-ride scholarships. It carries the headline "Never Let Tuition Stand in
// the Way of Extraordinary Craft.", copy about funded seats, coaching and
// stipends, an "Apply for Fellowship" button and the deadline "Oct 30, 2026".

// Design:
// - Single left-aligned content block (max-w-2xl, relative z-10) inside a
//   relative, overflow-hidden section; the CTA row pairs the button and deadline
// - Dark palette: #0e272f background, #e8f3ea / white / white-70 / white-50
//   text, lime #c8ef70 eyebrow and button (#0e272f label, white on hover),
//   white/10 border
// - Mono xs uppercase tracking-widest eyebrow, serif text-3xl -> sm:text-4xl
//   bold headline; rounded-2xl section with shadow-2xl, rounded-full mono
//   uppercase button
// - CTA row is flex-col (full-width button, centred deadline) below sm and a
//   row from sm; padding p-8 -> sm:p-12

// What it does:
// - Purely presentational: no content props, no state
// - Single anchor "Apply for Fellowship" -> #apply-fellowship (HiArrowRight)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import EmergingVoicesFellowshipScholarshipCTA from '@/TestComponent/SectionDesigns/Sections/learning/CTA01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <EmergingVoicesFellowshipScholarshipCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function EmergingVoicesFellowshipScholarshipCTA({
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
                'relative overflow-hidden rounded-2xl border border-white/10 bg-[#0e272f] p-8 text-[#e8f3ea] sm:p-12 shadow-2xl',
                className,
            )}
            {...props}
        >
            <div className="relative z-10 max-w-2xl">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#c8ef70]">
                    2026 EMERGING VOICES FELLOWSHIP &bull; 5 FULL-RIDE SCHOLARSHIPS
                </span>
                <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                    Never Let Tuition Stand in the Way of Extraordinary Craft.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                    We reserve 5 fully funded seats per cohort for underrepresented creatives. Includes 1-on-1 career coaching, equipment stipends, and placement introductions.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <a
                        href="#apply-fellowship"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c8ef70] px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-[#0e272f] hover:bg-white transition-colors"
                    >
                        <span>Apply for Fellowship</span>
                        <HiArrowRight />
                    </a>
                    <span className="font-mono text-xs text-white/50 text-center sm:text-left">
                        Deadline: Oct 30, 2026
                    </span>
                </div>
            </div>
        </section>
    )
}

export default EmergingVoicesFellowshipScholarshipCTA
