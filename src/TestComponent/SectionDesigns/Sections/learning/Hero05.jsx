// StudioClassMentorLedDualCTAHero

// Hero05 · Learning Management & EdTech › Hero sections

// Description:
// Two-column hero on a soft sage background for "THE STUDIO CLASS". It shows the
// serif headline "Turn a good idea into something real.", a line about following
// a mentor through the work, and two CTAs ("Explore classes" and "Preview a
// lesson"), next to a photo of an instructor guiding a hands-on class.

// Design:
// - Equal grid `md:grid-cols-[1fr_1fr]`; the image is a direct grid child
//   (not absolutely positioned) with object-cover
// - Light palette: sage #dce8df background, dark teal #102d36 text and primary
//   button, forest green #3c7e5d eyebrow, white button label
// - Serif text-5xl headline (leading .96), xs bold uppercase eyebrow (.14em
//   tracking), rounded-full primary pill plus a plain-text secondary link;
//   rounded-lg wrapper with overflow-hidden
// - Stacks below md; image is h-64 on mobile and md:h-full beside the text;
//   CTA row uses flex-wrap; padding p-7 -> sm:p-11

// What it does:
// - Purely presentational: no content props, no state
// - Anchors: "Explore classes" -> #class (HiArrowRight) and "Preview a lesson"
//   -> #preview (HiPlay); neither plays media, they are plain links

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import StudioClassMentorLedDualCTAHero from '@/TestComponent/SectionDesigns/Sections/learning/Hero05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <StudioClassMentorLedDualCTAHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight, HiPlay } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function StudioClassMentorLedDualCTAHero({
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
                'grid overflow-hidden rounded-lg bg-[#dce8df] text-[#102d36] md:grid-cols-[1fr_1fr]',
                className,
            )}
            {...props}
        >
            <div className="p-7 sm:p-11">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#3c7e5d]">
                    THE STUDIO CLASS
                </p>
                <h2 className="mt-4 font-serif text-5xl leading-[.96]">
                    Turn a good idea into something real.
                </h2>
                <p className="mt-4 max-w-sm text-sm leading-6">
                    Follow a mentor through the messy, rewarding middle of the
                    work.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                    <a
                        href="#class"
                        className="inline-flex items-center gap-2 rounded-full bg-[#102d36] px-5 py-3 text-sm text-white"
                    >
                        Explore classes <HiArrowRight />
                    </a>
                    <a
                        href="#preview"
                        className="inline-flex items-center gap-2 px-3 text-sm"
                    >
                        <HiPlay /> Preview a lesson
                    </a>
                </div>
            </div>
            <img
                className="h-64 w-full object-cover md:h-full"
                src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1000&q=85"
                alt="Instructor guiding a hands-on class"
            />
        </section>
    )
}

export default StudioClassMentorLedDualCTAHero
