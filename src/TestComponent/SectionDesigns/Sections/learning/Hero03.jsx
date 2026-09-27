// SmallLessonsCreamSplitHero

// Hero03 · Learning Management & EdTech › Hero sections

// Description:
// Editorial split hero on a cream background. A narrow text column carries the
// eyebrow "A BETTER WAY TO LEARN", the serif headline "Small lessons. Real
// momentum." and a "Choose a learning path" link; the wider column is filled
// with a workshop photo of learners sharing ideas.

// Design:
// - Grid `md:grid-cols-[.72fr_1.28fr]` (image column wider than text); text
//   column is flex-col justify-between; image absolutely fills its cell
// - Light palette: cream #f5f1e8 background, dark teal #102d36 text, forest
//   green #3c7e5d eyebrow
// - xs bold uppercase eyebrow, serif text-5xl leading-none headline with a
//   manual line break, bold small text link (no button); rounded-lg wrapper
//   with overflow-hidden, object-cover image
// - Stacks below md with the image underneath (min-h-64); padding p-7 -> sm:p-10

// What it does:
// - Purely presentational: no content props, no state
// - Single anchor "Choose a learning path" -> #paths with HiArrowRight icon

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SmallLessonsCreamSplitHero from '@/TestComponent/SectionDesigns/Sections/learning/Hero03';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <SmallLessonsCreamSplitHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function SmallLessonsCreamSplitHero({
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
                'grid overflow-hidden rounded-lg bg-[#f5f1e8] text-[#102d36] md:grid-cols-[.72fr_1.28fr]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col justify-between p-7 sm:p-10">
                <p className="text-xs font-bold uppercase text-[#3c7e5d]">
                    A BETTER WAY TO LEARN
                </p>
                <h2 className="my-10 font-serif text-5xl leading-none">
                    Small lessons.
                    <br />
                    Real momentum.
                </h2>
                <a
                    href="#paths"
                    className="inline-flex items-center gap-2 text-sm font-bold"
                >
                    Choose a learning path <HiArrowRight />
                </a>
            </div>
            <div className="relative min-h-64">
                <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1100&q=85"
                    alt="Learners sharing ideas during a workshop"
                />
            </div>
        </section>
    )
}

export default SmallLessonsCreamSplitHero
