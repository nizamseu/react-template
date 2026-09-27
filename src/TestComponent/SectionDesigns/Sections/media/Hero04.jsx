// DailyNotePhotoSplitHero

// Hero04 · Blogs & Digital Media › Hero sections

// Description:
// A hero for a daily short-read column, "THE DAILY / NO. 246". A narrow
// text column holds the headline "A small thought / for a large day." and a
// "Today's note" link, beside a wide golden-light photo captioned
// "A three-minute read".

// Design:
// - Grid with minimum height 390px, `md:grid-cols-[.7fr_1.3fr]` so the
//   photo takes the larger share; text column is a vertical flex with
//   kicker, headline and link spread top to bottom
// - Light cream palette: background #f3eee5, ink #28221e, rust accent
//   #a84f34 on the kicker; caption tag uses the page background colour
// - Serif headline text-5xl with leading-none (no larger size on wider
//   screens); bold xs uppercase tracked kicker; photo fills its box with
//   object-cover; rounded-lg outer corners with overflow-hidden
// - Stacks below md, with the image block below the text at min height
//   16rem; padding p-7 → sm:p-10

// What it does:
// - Purely presentational: no content props, no state
// - Text link "Today's note" to `#today` with arrow icon; image is a remote
//   Unsplash photo

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import DailyNotePhotoSplitHero from '@/TestComponent/SectionDesigns/Sections/media/Hero04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <DailyNotePhotoSplitHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function DailyNotePhotoSplitHero({
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
                'overflow-hidden rounded-lg bg-[#f3eee5] text-[#28221e]',
                className,
            )}
            {...props}
        >
            <div className="grid min-h-[390px] md:grid-cols-[.7fr_1.3fr]">
                <div className="flex flex-col justify-between p-7 sm:p-10">
                    <p className="text-xs font-bold uppercase tracking-[.16em] text-[#a84f34]">
                        THE DAILY / NO. 246
                    </p>
                    <h2 className="my-8 font-serif text-5xl leading-none">
                        A small thought
                        <br />
                        for a large day.
                    </h2>
                    <a
                        href="#today"
                        className="inline-flex items-center gap-2 text-sm"
                    >
                        Today&apos;s note <HiArrowRight />
                    </a>
                </div>
                <div className="relative min-h-64">
                    <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1200&q=85"
                        alt="Quiet golden morning light"
                    />
                    <span className="absolute bottom-4 left-4 bg-[#f3eee5] px-3 py-2 text-xs">
                        A three-minute read
                    </span>
                </div>
            </div>
        </section>
    )
}

export default DailyNotePhotoSplitHero
